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
  Settings,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AcelaLogo from "./icons/AcelaLogo";
import { RecentChat, SessionUser } from "../types";
import { UserCircle2 } from "lucide-react"

interface SidebarNavProps {
  recentChats: RecentChat[];
  activeChatId?: string;
  onSelectChat?: (id: string) => void;
  user: SessionUser | null;
  /** Controls the initial open/closed state on desktop. Defaults to closed (rail-only). */
  defaultOpen?: boolean;
  /** Mobile drawer open state — owned by parent (e.g. toggled from TopBar's hamburger). */
  mobileOpen: boolean;
  onMobileClose: () => void;
  openAuthModal: () => void;
  openSettingsModal: () => void;
}

type RailId = "new-chat" | "idea" | "explore" | "ask" | "account";

const navItems = [
  { id: "new-chat", icon: Plus, label: "New chat", href: "/" },
  { id: "idea", icon: Lightbulb, label: "Idea Mode", href: "/?mode=idea" },
  { id: "explore", icon: Compass, label: "Explore", href: "/?mode=explore" },
  { id: "ask", icon: HelpCircle, label: "Ask", href: "/?mode=ask" },
] as const;

export default function SidebarNav({
  recentChats,
  activeChatId,
  onSelectChat,
  user,
  defaultOpen = false,
  mobileOpen,
  onMobileClose,
  openAuthModal,
  openSettingsModal,
}: SidebarNavProps) {
  // Desktop: panel open/closed beside the persistent rail.
  const [open, setOpen] = useState(defaultOpen);
  // Tracks which rail icon is "active" so the panel can highlight/scroll to it.
  const [activeRailId, setActiveRailId] = useState<RailId | null>(null);

  const handleRailClick = (id: RailId) => {
    if (id == "account") {
      console.log("account")
      if (!user) {
        openAuthModal();
        return;
      }
      openSettingsModal();
      return;
    }

    if (open && activeRailId === id) {
      // Clicking the active item again collapses the panel.
      setOpen(false);
      setActiveRailId(null);
    } else {
      setActiveRailId(id);
      setOpen(true);
    }
  };

  return (
    <>
      {/* Mobile backdrop for full-screen drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ---------- DESKTOP: persistent rail + animated panel ---------- */}
      <div className="hidden md:flex h-dvh shrink-0 bg-base border-r border-white/5">
        <div
          className={`flex flex-col justify-between py-5 transition-[width] duration-300 ease-in-out overflow-hidden
            ${open ? "w-[300px]" : "w-[92px]"}`}
        >
          {/* Top section: toggle + nav rows */}
          <div className="flex flex-col gap-1">
            {/* Toggle button row */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              className={`flex items-center h-12 text-text-1 hover:text-text-2 transition-colors
                ${open ? "px-5 justify-start gap-3" : "justify-center"}`}
            >
              {open ? (
                <PanelLeftClose className="h-6 w-6 shrink-0" strokeWidth={1.5} />
              ) : (
                <PanelLeftOpen className="h-6 w-6 shrink-0" strokeWidth={1.5} />
              )}
              <span
                className={`text-base font-bold tracking-wide whitespace-nowrap transition-opacity duration-200
                  ${open ? "opacity-100 delay-150" : "opacity-0 w-0"}`}
              >
                ACELA
              </span>
            </button>

            <div className={open ? "h-4" : "h-7"} />

            {/* Nav rows */}
            {navItems.map(({ id, icon: Icon, label, href }) => (
              <Link
                key={id}
                href={href}
                onClick={() => {
                  setActiveRailId(id);
                  if (id !== "new-chat") setOpen(true);
                }}
                className={`flex items-center h-12 rounded-xl text-text-1 hover:bg-white/5 transition-colors
                  ${open ? "px-5 gap-3 mx-2" : "justify-center mx-0"}
                  ${activeRailId === id && open ? "bg-white/5" : ""}`}
              >
                <Icon className="h-6 w-6 shrink-0" strokeWidth={open ? 1.75 : 1.5} />
                <span
                  className={`text-text-1 whitespace-nowrap transition-all duration-200
                    ${open ? "opacity-100 max-w-[200px] delay-100" : "opacity-0 max-w-0"}`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom section: Recent (only when open) + footer */}
          <div className="flex flex-col gap-2">
            {open && (
              <div className="flex-1 overflow-y-auto px-3 max-h-[40vh] animate-in fade-in duration-300">
                <p className="px-3 py-2 text-sm font-medium text-text-1">Recent</p>
                <div className="flex flex-col gap-1">
                  {recentChats.map((chat) => (
                    <Link
                      key={chat.id}
                      href="/chat"
                      onClick={(e) => {
                        if (onSelectChat) {
                          e.preventDefault();
                          onSelectChat(chat.id);
                        }
                      }}
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
              </div>
            )}

            {/* Footer / avatar */}
            <div
              className={`flex items-center border-t border-white/5 pt-4 ${open ? "px-4 gap-3" : "justify-center px-0"
                }`}
            >
              <button
                type="button"
                onClick={() => handleRailClick("account")}
                className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 relative shrink-0"
              >{user ?
                <Image
                  src={user?.image ?? "/logo.svg"}
                  alt="User avatar"
                  fill
                  className="object-cover"
                  unoptimized
                /> : <UserCircle2 className="h-10 w-10 shrink-0 cursor-pointer" />
                }
              </button>
              {open && (
                <div className="flex-1 min-w-0 flex items-center justify-between animate-in fade-in duration-200">
                  <div className="min-w-0">
                    <p className="text-text-1 text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-text-faint text-xs">
                      {"Free Plan"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Settings"
                    className="text-text-1 hover:text-text-2 transition-colors"
                  >
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >

      {/* ---------- MOBILE: full-screen drawer (rail hidden entirely) ---------- */}
      < aside
        className={`fixed z-50 inset-y-0 left-0 w-[300px] bg-base border-r border-white/5 flex flex-col
          transition-transform duration-200 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
        }
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-text-1 font-bold tracking-wide text-lg">ACELA</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="text-text-1 hover:text-text-2 transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ id, icon: Icon, label, href }) => (
            <Link
              key={id}
              href={href}
              onClick={onMobileClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-text-1 text-base hover:bg-white/5 transition-colors text-left"
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex-1 overflow-y-auto px-3">
          <p className="px-3 py-2 text-sm font-medium text-text-1">Recent</p>
          <div className="flex flex-col gap-1">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href="/chat"
                onClick={(e) => {
                  onMobileClose();
                  if (onSelectChat) {
                    e.preventDefault();
                    onSelectChat(chat.id);
                  }
                }}
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
        </div>

        <div className="border-t border-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 relative shrink-0">

                <button
                  type="button"
                  onClick={() => handleRailClick("account")}
                  className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 relative shrink-0"
                >{user ?
                  <Image
                    src={user?.image ?? "/logo.svg"}
                    alt="User avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  /> : <UserCircle2 className="h-10 w-10 shrink-0 cursor-pointer" />
                  }</button>
              </div>
              <div className="min-w-0">
                <p className="text-text-1 text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-text-faint text-xs">
                  {"Free Plan"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside >
    </>
  );
}
