"use client";

import PlanCard from "../PlanCard";
import { CircleBadge, HeptagonBadge, StarBadge } from "../PlanBadges";
import Modal from "./Modal";

function openPurchase() {
  window.open("/api/go/plans", "_blank", "noopener,noreferrer");
}

interface BillingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BillingModal({ open, onClose }: BillingModalProps) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl md:max-w-5xl lg:max-w-7xl">
      <div className="max-h-[85vh] overflow-y-auto py-2 text-center">
        <h1 className="text-text-1 text-3xl md:text-4xl font-extrabold mb-3">
          Get more out of ACELA
        </h1>
        <p className="text-text-2 text-base md:text-lg mb-8 ">
          Pay-as-you-go freedom, buy exactly what you need with zero recurring monthly
          subscription.
        </p>

        <div className="flex flex-col gap-6 lg:flex-row">
          <PlanCard
            name="Mini"
            price="$2"
            badge={<CircleBadge />}
            ctaLabel="Get mini plan"
            onSelect={openPurchase}
            features={[
              "Quick token boost: Instantly added to your balance with absolutely no expiration date.",
              "Zero recurring monthly fees.",
              "Great for a quick boost or finishing up a small project.",
            ]}
          />

          <PlanCard
            name="Standard"
            price="$5"
            badge={<HeptagonBadge />}
            ctaLabel="Get standard plan"
            onSelect={openPurchase}
            features={[
              "Value refill: A larger token drop for regular usage, providing better value per dollar.",
              "Higher usage limit.",
              "Ideal for regular usage and multiple ongoing tasks.",
            ]}
          />

          <PlanCard
            name="Mega"
            price="$10"
            badge={<StarBadge />}
            ctaLabel="Get mega plan"
            onSelect={openPurchase}
            features={[
              "Maximum token volume: Our best cost-effective tier to maximize your output.",
              "Higher usage limit",
              "Built for heavy usage, power users, and high-volume needs.",
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}
