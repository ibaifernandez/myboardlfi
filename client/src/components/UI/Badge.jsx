export function Badge({ label, className = '' }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${className}`}>
      {label}
    </span>
  );
}
