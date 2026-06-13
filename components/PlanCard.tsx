import { ReactNode } from "react";

interface PlanCardProps {
  name: string;
  price: string;
  badge: ReactNode;
  ctaLabel: string;
  onSelect?: () => void;
  features: string[];
}

export default function PlanCard({ name, price, badge, ctaLabel, onSelect, features }: PlanCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-white/5 p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-text-1 text-2xl font-bold">{name}</h3>
        {badge}
      </div>

      <p className="text-text-1 text-4xl md:text-5xl font-extrabold mb-6">{price}</p>

      <button
        type="button"
        onClick={onSelect}
        className="w-full rounded-2xl bg-text-1 px-6 py-3.5 text-base font-semibold text-base hover:opacity-90 transition-opacity mb-6"
      >
        {ctaLabel}
      </button>

      <ul className="list-disc pl-5 space-y-2 text-text-1 text-sm">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
