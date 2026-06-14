"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SessionUser } from "@/types";
import { UserCircle2 } from "lucide-react";

interface TopBarProps {
  plan: string;
  onMenuClick: () => void;
  user: SessionUser | null;
  onUpgradeClick?: () => void;
  openAuthModal: () => void;
  openSettingsModal: () => void;
}

export default function TopBar({ plan, onMenuClick, user, onUpgradeClick, openAuthModal, openSettingsModal }: TopBarProps) {
  const pill = (
    <div className="inline-flex items-center gap-4 rounded-b-x10 bg-card px-4 py-2 text-sm shadow-md">
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
  );

  return (
    <div className="relative flex items-center justify-between px-4 py-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-1 md:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>

      {/* mobile: fixed → centers on viewport; desktop: absolute → centers on content area.
          top-0 is flush to the screen in both cases since the TopBar starts at y=0. */}
      <div className="fixed md:absolute top-0 left-1/2 -translate-x-1/2 z-40">
        {pill}
      </div>

      <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 md:hidden relative">
        {user ? (
          <Image
            src={user?.image ?? "/logo.svg"}
            alt="User avatar"
            fill
            className="object-cover cursor-pointer"
            unoptimized
            onClick={openSettingsModal}
          />
        ) : (
          <UserCircle2 className="h-10 w-10 shrink-0 cursor-pointer" onClick={openAuthModal} />
        )}
      </div>
      <div className="hidden md:block w-10" />
    </div>
  );
}
