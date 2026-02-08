import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [hoverIndex, setHoverIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(filter.toLowerCase())
  );

  // Close on outside click (header scope only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      setHoverIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      setHoverIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[hoverIndex]) {
      onChange(filtered[hoverIndex]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilter("");
    onChange("");
  };

  const headerRect = headerRef.current?.getBoundingClientRect();

  return (
    <div className="dropdown-container" ref={containerRef}>
      <div
        ref={headerRef}
        className="dropdown-header"
        onClick={() => setOpen(prev => !prev)}
      >
        {value || placeholder || "Select..."}
        {value && (
          <span className="clear-btn" onClick={handleClear}>
            ×
          </span>
        )}
      </div>

      {open &&
        createPortal(
          <>
            {/* Full-screen backdrop */}
            <div
              className="dropdown-backdrop"
              onClick={() => setOpen(false)}
            />

            {/* Overlay dropdown (viewport anchored, centered) */}
            <div
              className="dropdown-body"
              style={{
                position: "fixed",

                // Anchor just below the trigger
                top: headerRect
                  ? headerRect.bottom + 12
                  : "50%",

                // TRUE horizontal center of trigger
                left: headerRect
                  ? headerRect.left + headerRect.width / 2
                  : "50%",

                transform: "translate(-50%, 0)",

                // Fully responsive + clamped
                width: "clamp(280px, min(90vw, 420px), 520px)",
                maxHeight: "clamp(240px, 50vh, 420px)",

                padding: "0.75rem",
                borderRadius: "0.75rem",
                boxSizing: "border-box",

                zIndex: 999,
              }}
            >
              <input
                type="text"
                value={filter}
                onChange={e => {
                  setFilter(e.target.value);
                  setHoverIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search asset…"
                className="dropdown-search"
                autoFocus
              />

              <div className="dropdown-options">
                {filtered.length === 0 && (
                  <div className="dropdown-option">No results</div>
                )}

                {filtered.map((opt, i) => (
                  <div
                    key={opt}
                    className={`dropdown-option ${
                      i === hoverIndex ? "hovered" : ""
                    }`}
                    onMouseEnter={() => setHoverIndex(i)}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
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
