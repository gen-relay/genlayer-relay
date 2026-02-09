import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean; 
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [hoverIndex, setHoverIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------
   * FIX 1 — Lock body scroll when dropdown is open
   * ------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  /* -------------------------------------------------
   * Debounce filter
   * ------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(filter), 150);
    return () => clearTimeout(t);
  }, [filter]);

  /* -------------------------------------------------
   * Memoized + capped filtering
   * ------------------------------------------------- */
  const filtered = useMemo(() => {
    const f = debouncedFilter.toLowerCase();
    return options
      .filter(o => o.toLowerCase().includes(f))
      .slice(0, 50);
  }, [options, debouncedFilter]);

  /* -------------------------------------------------
   * Keyboard navigation
   * ------------------------------------------------- */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      setHoverIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      setHoverIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      onChange(filtered[hoverIndex]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilter("");
    setDebouncedFilter("");
    onChange("");
  };

  // const headerRect = headerRef.current?.getBoundingClientRect();

  return (
    <div className="dropdown-container" ref={containerRef}>
      <div
        ref={headerRef}
        className={`dropdown-header ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setOpen(prev => !prev)}
      >
        {value || placeholder || "Select…"}
        {value && !disabled && (
          <span className="clear-btn" onClick={handleClear}>×</span>
        )}
      </div>

      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="dropdown-backdrop"
              onClick={e => { e.stopPropagation(); setOpen(false); }}
            />

            {/* Skeleton Dropdown Body */}
            <div className="dropdown-body">
              <input
                type="text"
                value={filter}
                onChange={e => { setFilter(e.target.value); setHoverIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search…"
                className="dropdown-search"
                autoFocus
                disabled={disabled}
              />

              <div className="dropdown-options">
                {filtered.length === 0 && <div className="dropdown-option">No results</div>}
                {filtered.map((opt, i) => (
                  <div
                    key={opt}
                    className={`dropdown-option ${i === hoverIndex ? "hovered" : ""}`}
                    onMouseEnter={() => setHoverIndex(i)}
                    onClick={() => { onChange(opt); setOpen(false); }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </>,
          document.getElementById("overlay-root")!
        )}
    </div>
  );
}
