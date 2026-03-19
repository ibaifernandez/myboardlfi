import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

// ── Submenu panel ────────────────────────────────────────────
function SubPanel({ items, onClose }) {
  return (
    <div className="min-w-[200px] max-h-[320px] overflow-y-auto bg-[#1a1d26] border border-[#2e3140] rounded-xl shadow-2xl py-1">
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="my-1 border-t border-[#2e3140]" />;
        }
        if (item.type === 'label') {
          return (
            <div key={i} className="px-3 pt-2 pb-0.5 text-[10px] uppercase tracking-wider text-[#555b70] font-semibold">
              {item.label}
            </div>
          );
        }
        return (
          <button
            key={i}
            onClick={() => { if (!item.disabled) { item.action?.(); onClose(); } }}
            disabled={item.disabled}
            className={`
              w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors
              ${item.disabled
                ? 'text-[#555b70] cursor-default'
                : 'text-[#e8eaf0] hover:bg-[#2e3140] cursor-pointer'}
            `}
          >
            {item.icon && <span className="shrink-0 text-[#8b90a0]">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
            {item.checked && <Check size={12} className="text-indigo-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Single menu item (normal | separator | label | submenu) ──
function MenuItem({ item, onClose }) {
  const [subOpen, setSubOpen] = useState(false);
  const [subSide, setSubSide] = useState('right');

  if (item.type === 'separator') {
    return <div className="my-1 border-t border-[#2e3140]" />;
  }
  if (item.type === 'label') {
    return (
      <div className="px-3 pt-2 pb-0.5 text-[10px] uppercase tracking-wider text-[#555b70] font-semibold">
        {item.label}
      </div>
    );
  }
  if (item.type === 'submenu') {
    return (
      <div
        className="relative"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setSubSide(rect.right + 220 > window.innerWidth ? 'left' : 'right');
          setSubOpen(true);
        }}
        onMouseLeave={() => setSubOpen(false)}
      >
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#e8eaf0] hover:bg-[#2e3140] cursor-pointer transition-colors text-left">
          {item.icon && <span className="shrink-0 text-[#8b90a0]">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          <ChevronRight size={13} className="text-[#555b70] shrink-0" />
        </button>

        {subOpen && (
          <div className={`absolute top-0 z-10 ${subSide === 'right' ? 'left-full ml-1' : 'right-full mr-1'}`}>
            <SubPanel items={item.items} onClose={onClose} />
          </div>
        )}
      </div>
    );
  }

  // Normal clickable item
  return (
    <button
      onClick={() => { item.action?.(); onClose(); }}
      disabled={item.disabled}
      className={`
        w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors
        ${item.danger
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-[#e8eaf0] hover:bg-[#2e3140]'}
        ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {item.icon && (
        <span className={`shrink-0 ${item.danger ? 'text-red-400' : 'text-[#8b90a0]'}`}>
          {item.icon}
        </span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.checked && <Check size={12} className="text-indigo-400 shrink-0" />}
    </button>
  );
}

// ── Public component ─────────────────────────────────────────
export function ContextMenu({ x, y, items, onClose }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ left: x, top: y, opacity: 0 });

  // Smart boundary detection — run after first paint
  useEffect(() => {
    if (!menuRef.current) return;
    const { width, height } = menuRef.current.getBoundingClientRect();
    setPos({
      left:    x + width  > window.innerWidth  ? Math.max(4, x - width)  : x,
      top:     y + height > window.innerHeight ? Math.max(4, y - height) : y,
      opacity: 1,
    });
  }, [x, y]);

  // Close on Escape or outside click
  useEffect(() => {
    const onKey   = (e) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    document.addEventListener('keydown',   onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown',   onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[190px] bg-[#1a1d26] border border-[#2e3140] rounded-xl shadow-2xl py-1 select-none transition-opacity duration-75"
      style={{ left: pos.left, top: pos.top, opacity: pos.opacity }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => (
        <MenuItem key={i} item={item} onClose={onClose} />
      ))}
    </div>
  );
}
