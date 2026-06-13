"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, HelpCircle, Compass } from "lucide-react";
import AcelaLogo from "./AcelaLogo";
import ModePill from "./ModePill";
import ChatInput from "./ChatInput";
import TopBar from "./TopBar";
import { AppMode, ModeOption, RecentChat, User } from "./types";
import SidebarNav from "./SidebarNav";
import BillingModal from "./BillingModal";

const modeOptions: ModeOption[] = [
  { id: "idea", label: "Idea mode", icon: Lightbulb },
  { id: "ask", label: "Ask mode", icon: HelpCircle },
  { id: "explore", label: "Explore", icon: Compass },
];

const defaultUser: User = {
  name: "Aizen",
  plan: "Free Plan",
  avatarUrl:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces",
};

const defaultRecentChats: RecentChat[] = [
  { id: "1", title: "What's Acela all about" },
  { id: "2", title: "Tell me more about Celo on base" },
  { id: "3", title: "How does one build a podcast on celo" },
];

interface HomePageProps {
  user?: User;
  recentChats?: RecentChat[];
  hasHistory?: boolean;
}

export default function HomePage({
  user = defaultUser,
  recentChats = defaultRecentChats,
  hasHistory = false,
}: HomePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeMode, setActiveMode] = useState<AppMode | null>(null);
  const [billingOpen, setBillingOpen] = useState(false);

  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as AppMode | null;

  useEffect(() => {
    if (modeParam && ["idea", "ask", "explore"].includes(modeParam)) {
      setActiveMode(modeParam);
    } else {
      setActiveMode(null);
    }
  }, [modeParam]);

  const activeModeOption = modeOptions.find((m) => m.id === activeMode) ?? null;

  const handleModeClick = (modeId: AppMode) => {
    setActiveMode((current) => (current === modeId ? null : modeId));
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    // Hook up navigation / send logic here.
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <SidebarNav recentChats={recentChats} user={user} activeChatId={hasHistory ? recentChats[0]?.id : undefined} onMobileClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} defaultOpen={false} onSelectChat={(id) => { }} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          plan={user.plan}
          onMenuClick={() => setSidebarOpen(true)}
          avatarUrl={user.avatarUrl}
          onUpgradeClick={() => setBillingOpen(true)}
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 md:pb-32">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8">
              <AcelaLogo size={40} className="md:hidden" />
              <AcelaLogo size={48} className="hidden md:block" />
              <h1 className="text-text-1 font-extrabold text-3xl md:text-5xl">
                Welcome, {user.name}
              </h1>
            </div>

            {/* Mobile: mode pills sit above the input. Desktop: below. */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4 md:hidden">
              {modeOptions.map((mode) => (
                <ModePill
                  key={mode.id}
                  icon={mode.icon}
                  label={mode.label}
                  active={activeMode === mode.id}
                  onClick={() => handleModeClick(mode.id)}
                />
              ))}
            </div>

            <ChatInput
              value={message}
              onChange={setMessage}
              onSubmit={handleSubmit}
              activeMode={activeModeOption}
              onClearMode={() => setActiveMode(null)}
              className="w-full"
            />

            <div className="hidden md:flex flex-wrap items-center justify-center gap-3 mt-6">
              {modeOptions.map((mode) => (
                <ModePill
                  key={mode.id}
                  icon={mode.icon}
                  label={mode.label}
                  active={activeMode === mode.id}
                  onClick={() => handleModeClick(mode.id)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      <BillingModal open={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
}
