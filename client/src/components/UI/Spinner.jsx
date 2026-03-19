export function Spinner({ size = 5 }) {
  return (
    <div
      className={`w-${size} h-${size} border-2 border-[#2e3140] border-t-indigo-500 rounded-full animate-spin`}
    />
  );
}
