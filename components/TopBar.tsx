"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TopBarProps {
  plan: string;
  onMenuClick: () => void;
  avatarUrl: string;
  onUpgradeClick?: () => void;
}

export default function TopBar({ plan, onMenuClick, avatarUrl, onUpgradeClick }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-1 md:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>

      <div className="flex-1 flex justify-center">
        <div className="inline-flex items-center gap-4 rounded-2xl bg-card px-5 py-3 text-sm">
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

      <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 md:hidden relative">
        <Image
          src={avatarUrl}
          alt="User avatar"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="hidden md:block w-10" />
    </div>
  );
}
