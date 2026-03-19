export function IconButton({ onClick, title, children, className = '', danger = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1 rounded transition-colors
        ${danger
          ? 'text-[#555b70] hover:text-red-400 hover:bg-red-500/10'
          : 'text-[#555b70] hover:text-[#e8eaf0] hover:bg-[#2e3140]'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
