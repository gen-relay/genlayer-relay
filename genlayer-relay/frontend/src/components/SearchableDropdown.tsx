import { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchableDropdown({ options, value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [hoverIndex, setHoverIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(o => o.toLowerCase().includes(filter.toLowerCase()));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") setHoverIndex(prev => (prev + 1) % filtered.length);
    else if (e.key === "ArrowUp") setHoverIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    else if (e.key === "Enter" && filtered[hoverIndex]) {
      onChange(filtered[hoverIndex]);
      setOpen(false);
    }
    else if (e.key === "Escape") setOpen(false);
  };

  const handleClear = () => {
    setFilter("");
    onChange("");
  };

  return (
    <>
      {/* Full-page backdrop */}
      {open && <div className="dropdown-backdrop" onClick={() => setOpen(false)} />}

      <div className="dropdown-container" ref={containerRef}>
        <div className="dropdown-header" onClick={() => setOpen(!open)}>
          {value || placeholder || "Select..."}
          {value && <span className="clear-btn" onClick={handleClear}>×</span>}
        </div>

        {open && (
          <div className="dropdown-body">
            <input
              type="text"
              value={filter}
              onChange={e => { setFilter(e.target.value); setHoverIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="dropdown-search"
              autoFocus
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
        )}
      </div>
    </>
  );
}
