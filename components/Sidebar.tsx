"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  Search, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  CreditCard,
  LogIn
} from "lucide-react";
import SettingsModal from "./Modals/SettingsModal";
import LogoutModal from "./Modals/LogoutModal";
import SignInModal from "./Modals/SignInModal";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const navItems = [
    { name: "New Chat", href: "/", icon: Plus },
    { name: "Chat History", href: "/chat", icon: MessageSquare },
    { name: "Billing", href: "/billing", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 z-50 fixed top-0 w-full">
        <span className="font-bold text-xl text-emerald-400">Acela</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 transition duration-200 ease-in-out z-40
        w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full
      `}>
        {/* Brand */}
        <div className="p-6 hidden md:flex items-center">
          <span className="font-bold text-2xl text-emerald-400 tracking-tight">Acela</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-4 md:hidden mt-16" /> {/* Mobile spacer */}
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    isActive ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zinc-800">
          <nav className="space-y-1">
            <button
              onClick={() => { setIsSignInOpen(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-400 font-medium hover:bg-zinc-800/50 transition-colors"
            >
              <LogIn size={18} />
              Sign In (Demo)
            </button>
            <button
              onClick={() => { setIsSettingsOpen(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={() => { setIsLogoutOpen(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              Log out
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={() => console.log('Logged out')} />
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}
