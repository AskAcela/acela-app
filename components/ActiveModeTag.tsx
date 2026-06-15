import { LucideIcon, X } from "lucide-react";

interface ActiveModeTagProps {
  icon: LucideIcon;
  label: string;
  onClear?: () => void;
}

export default function ActiveModeTag({ icon: Icon, label, onClear }: ActiveModeTagProps) {
  return (
    <span className="inline-flex items-center justify-center gap-2 rounded-x5 bg-primary px-3 py-1.5 text-sm font-medium text-base cursor-pointer">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Clear ${label}`}
        className="ml-1 -mr-0.5 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </span>
  );
}
