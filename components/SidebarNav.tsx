"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Lightbulb,
  Compass,
  HelpCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AcelaLogo from "./icons/AcelaLogo";
import { RecentChat, SessionUser } from "../types";
import { UserCircle2 } from "lucide-react";

interface SidebarNavProps {
  recentChats: RecentChat[];
  recentChatsLoading?: boolean;
  activeChatId?: string;
  user: SessionUser | null;
  defaultOpen?: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  openAuthModal: () => void;
  openSettingsModal: () => void;
}

const navItems = [
  { id: "new-chat", icon: Plus,       label: "New chat",  href: "/"             },
  { id: "idea",     icon: Lightbulb,  label: "Idea", href: "/?mode=idea"   },
  { id: "explore",  icon: Compass,    label: "Explore",   href: "/?mode=explore" },
  { id: "ask",      icon: HelpCircle, label: "Ask",       href: "/?mode=ask"    },
] as const;

export default function SidebarNav({
  recentChats,
  recentChatsLoading = false,
  activeChatId,
  user,
  defaultOpen = false,
  mobileOpen,
  onMobileClose,
  openAuthModal,
  openSettingsModal,
}: SidebarNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);

  function handleAccountClick() {
    if (!user) openAuthModal();
    else openSettingsModal();
  }

  const recentList = (
    <div className="flex flex-col gap-1">
      {recentChats.map((chat) => (
        <Link
          key={chat.id}
          href={`/c/${chat.id}`}
          className={`truncate rounded-xl px-3 py-2 text-left text-sm transition-colors block
            ${chat.id === activeChatId
              ? "text-text-1 bg-white/5"
              : "text-text-2 hover:bg-white/5 hover:text-text-1"
            }`}
        >
          {chat.title}
        </Link>
      ))}
    </div>
  );

  const recentSkeletons = (
    <div className="flex flex-col gap-1 px-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ── DESKTOP: single sidebar that expands ── */}
      <div
        className={`hidden md:flex flex-col h-dvh shrink-0 bg-base border-r border-white/5 py-5
          transition-[width] duration-300 ease-in-out overflow-hidden
          ${open ? "w-[260px]" : "w-[72px]"}`}
      >
        {/* Top section */}
        <div className="flex flex-col gap-1 px-3">
          {/* Toggle / logo row */}
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="flex items-center h-11 rounded-xl text-text-1 hover:bg-white/5 transition-colors px-2 gap-3"
          >
            <span className="shrink-0 flex items-center justify-center w-6 h-6">
              {open
                ? <PanelLeftClose className="h-5 w-5" strokeWidth={1.5} />
                : <PanelLeftOpen  className="h-5 w-5" strokeWidth={1.5} />
              }
            </span>
            <span className={`flex items-center gap-2 transition-[opacity,max-width] duration-200 overflow-hidden whitespace-nowrap
              ${open ? "opacity-100 max-w-[180px] delay-100" : "opacity-0 max-w-0"}`}>
              <AcelaLogo size={22} />
              <span className="text-text-1 font-bold tracking-wide text-sm">ACELA</span>
            </span>
          </button>

          <div className="h-2" />

          {/* Nav items */}
          {navItems.map(({ id, icon: Icon, label, href }) => (
            <button
              key={id}
              type="button"
              title={open ? undefined : label}
              onClick={() => router.push(href)}
              className="flex items-center h-10 rounded-xl text-text-1 hover:bg-white/5 transition-colors px-2 gap-3"
            >
              <span className="shrink-0 flex items-center justify-center w-6 h-6">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className={`text-sm whitespace-nowrap transition-[opacity,max-width] duration-200 overflow-hidden
                ${open ? "opacity-100 max-w-[180px] delay-100" : "opacity-0 max-w-0"}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Recent conversations — only visible when expanded */}
        <div className={`mt-8 flex-1 overflow-y-auto px-3 min-h-0 transition-opacity duration-200
          ${open ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"}`}>
          <p className="px-2 py-2 text-xs font-bold text-text-1 uppercase tracking-wider whitespace-nowrap ">
            Recent
          </p>
          {recentChatsLoading ? recentSkeletons : recentList}
        </div>

        {/* Footer */}
        <div className="px-3 pt-3 border-t border-white/5 shrink-0">
          <button
            type="button"
            onClick={handleAccountClick}
            title={open ? undefined : (user?.name ?? "Account")}
            className="flex items-center h-11 w-full rounded-xl hover:bg-white/5 transition-colors px-2 gap-3"
          >
            <span className="shrink-0 h-7 w-7 rounded-full overflow-hidden ring-1 ring-white/10 relative flex items-center justify-center">
              {user
                ? <Image src={user.image ?? "/logo.svg"} alt="User avatar" fill className="object-cover" unoptimized />
                : <UserCircle2 className="h-7 w-7" />
              }
            </span>
            <span className={`min-w-0 text-left transition-[opacity,max-width] duration-200 overflow-hidden
              ${open ? "opacity-100 max-w-[180px] delay-100" : "opacity-0 max-w-0"}`}>
              <p className="text-text-1 text-sm font-semibold truncate whitespace-nowrap">{user?.name ?? "Guest"}</p>
              <p className="text-text-faint text-xs whitespace-nowrap">Free Plan</p>
            </span>
          </button>
        </div>
      </div>

      {/* ── MOBILE: full-screen drawer ── */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-[280px] bg-base border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 shrink-0">
          <div className="flex items-center gap-2">
            <AcelaLogo size={24} />
            <span className="text-text-1 font-bold tracking-wide text-base">ACELA</span>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="text-text-1 hover:text-text-2 transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 shrink-0">
          {navItems.map(({ id, icon: Icon, label, href }) => (
            <Link
              key={id}
              href={href}
              onClick={onMobileClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-text-1 text-sm hover:bg-white/5 transition-colors"
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex-1 overflow-y-auto px-3 min-h-0">
          <p className="px-3 py-2 text-xs font-bold text-text-1 uppercase tracking-wider">Recent</p>
          {recentChatsLoading ? recentSkeletons : recentList}
        </div>

        <div className="border-t border-white/5 px-4 py-4 shrink-0">
          <button
            type="button"
            onClick={handleAccountClick}
            className="flex items-center gap-3 w-full"
          >
            <div className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-white/10 relative shrink-0 flex items-center justify-center">
              {user
                ? <Image src={user.image ?? "/logo.svg"} alt="User avatar" fill className="object-cover" unoptimized />
                : <UserCircle2 className="h-9 w-9" />
              }
            </div>
            <div className="min-w-0 text-left">
              <p className="text-text-1 text-sm font-semibold truncate">{user?.name ?? "Guest"}</p>
              <p className="text-text-faint text-xs">Free Plan</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
