"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, HelpCircle, Compass } from "lucide-react";
import AuthModal from "./modals/AuthModal";
import AcelaLogo from "./icons/AcelaLogo";
import ModePill from "./ModePill";
import ChatInput from "./ChatInput";
import TopBar from "./TopBar";
import { AppMode, ModeOption, RecentChat, SessionUser } from "../types";
import SidebarNav from "./SidebarNav";
import BillingModal from "./modals/BillingModal";
import { useSession } from "next-auth/react";
import SettingsModal from "./modals/SettingsModal";

const modeOptions: ModeOption[] = [
  { id: "idea", label: "Idea mode", icon: Lightbulb },
  { id: "ask", label: "Ask mode", icon: HelpCircle },
  { id: "explore", label: "Explore", icon: Compass },
];

const defaultRecentChats: RecentChat[] = [
  { id: "1", title: "What's Acela all about" },
  { id: "2", title: "Tell me more about Celo on base" },
  { id: "3", title: "How does one build a podcast on celo" },
];

interface HomePageProps {
  user?: SessionUser;
  recentChats?: RecentChat[];
  hasHistory?: boolean;
}

export default function HomePage({
  recentChats = defaultRecentChats,
  hasHistory = false,
}: HomePageProps) {
  const { data: session, status: sessionStatus } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeMode, setActiveMode] = useState<AppMode | null>(null);
  const [billingOpen, setBillingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  if (sessionStatus === "loading") {
    return <div className="h-dvh w-screen bg-base flex items-center justify-center text-text-2">Loading...</div>; // or skeleton
  }

  const openAuthModal = () => {
    setAuthOpen(true);
  }

  return (
    <div className="flex h-dvh bg-base overflow-hidden">
      <SidebarNav recentChats={recentChats} user={session?.user ?? null} activeChatId={hasHistory ? recentChats[0]?.id : undefined} onMobileClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} defaultOpen={false} onSelectChat={(id) => { }} openAuthModal={openAuthModal} openSettingsModal={() => setSettingsOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          plan={"Free Plan"}
          onMenuClick={() => setSidebarOpen(true)}
          user={session?.user ?? null}
          onUpgradeClick={() => setBillingOpen(true)}
          openAuthModal={openAuthModal}
          openSettingsModal={() => setSettingsOpen(true)}
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4 md:pb-24 md:pb-32">
          <div className="w-full h-full max-w-2xl flex justify-between md:justify-center flex-col items-center">
            <div className="pt-10 md:pt-0 md:hidden"> </div>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center">
                <AcelaLogo size={30} className="md:hidden mb-1" />
                <AcelaLogo size={38} className="hidden mb-2 md:block" />
              </div>
              <h1 className="bg-gradient-to-r from-text-1 to-text-1/60 bg-clip-text text-center text-[28px] font-bold text-transparent tracking-tight">
                What’s on your mind today?
              </h1>
            </div>

            {/* Mobile: mode pills sit above the input. Desktop: below. */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 md:hidden">
              {modeOptions.map((mode) => (
                <ModePill
                  key={mode.id}
                  icon={mode.icon}
                  label={mode.label}
                  active={activeMode === mode.id}
                  onClick={() => handleModeClick(mode.id)}
                />
              ))}
              <ChatInput
                value={message}
                onChange={setMessage}
                onSubmit={handleSubmit}
                activeMode={activeModeOption}
                onClearMode={() => setActiveMode(null)}
                className="w-full"
              />
            </div>



            <div className="hidden md:flex flex-wrap items-center justify-center gap-3 mt-6">
              <ChatInput
                value={message}
                onChange={setMessage}
                onSubmit={handleSubmit}
                activeMode={activeModeOption}
                onClearMode={() => setActiveMode(null)}
                className="w-full"
              />
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
