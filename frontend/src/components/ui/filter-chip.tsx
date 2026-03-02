interface FilterChipProps {
  label: string;
  active: boolean;
  inactiveClass: string;
  activeClass: string;
  onClick: () => void;
}

export function FilterChip({ label, active, inactiveClass, activeClass, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
        active ? activeClass : inactiveClass
      }`}
    >
      {label}
    </button>
  );
}
