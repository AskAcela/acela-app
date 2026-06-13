import { Star } from "lucide-react";

export function CircleBadge({ className = "" }: { className?: string }) {
  return <div className={`h-10 w-10 rounded-full bg-status-info ${className}`} aria-hidden="true" />;
}

export function HeptagonBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`h-10 w-10 ${className}`} aria-hidden="true">
      <polygon
        points="20,1 35.5,9 38.7,26.5 27,38 13,38 1.3,26.5 4.5,9"
        fill="#FF5C5C"
      />
    </svg>
  );
}

export function StarBadge({ className = "" }: { className?: string }) {
  return (
    <Star
      className={`h-10 w-10 fill-primary text-primary ${className}`}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}
