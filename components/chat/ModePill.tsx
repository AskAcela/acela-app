import { LucideIcon } from "lucide-react";

interface ModePillProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ModePill({
  icon: Icon,
  label,
  active = false,
  onClick,
  className = "",
}: ModePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-x10 border px-3 md:px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer
        ${
          active
            ? "bg-primary text-base border-primary"
            : "bg-card border-white/5 text-text-1 hover:border-white/10 hover:bg-white/5"
        }
        ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
