"use client";

import { ChevronDown, Share, Menu } from "lucide-react";
import Link from "next/link";

interface ChatHeaderProps {
  title: string;
  plan: string;
  onMenuClick: () => void;
  onUpgradeClick?: () => void;
}

export default function ChatHeader({ title, plan, onMenuClick, onUpgradeClick }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 md:px-6 gap-3">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-1 md:hidden shrink-0"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        className="hidden md:flex items-center gap-2 text-text-2 hover:text-text-1 transition-colors text-sm min-w-0"
      >
        <span className="truncate">{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      </button>

      <div className="flex-1 flex justify-center md:flex-initial">
        <div className="inline-flex items-center gap-4 rounded-xl0 bg-card px-5 py-3 text-sm">
          <span className="text-text-1 font-medium">{plan}</span>
          {onUpgradeClick ? (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="text-text-2 hover:text-text-1 transition-colors font-medium cursor-pointer"
            >
              Upgrade
            </button>
          ) : (
            <Link
              href="/billing"
              className="text-text-2 hover:text-text-1 transition-colors font-medium"
            >
              Upgrade
            </Link>
          )}
        </div>
      </div>

      <button
        type="button"
        className="hidden md:inline-flex items-center gap-2 text-text-1 hover:text-text-2 transition-colors text-sm"
      >
        <Share className="h-4 w-4" strokeWidth={1.75} />
        Share
      </button>
    </div>
  );
}
