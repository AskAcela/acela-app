"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Lightbulb, HelpCircle, Compass } from "lucide-react";
import AuthModal from "./modals/AuthModal";
import AcelaLogo from "./icons/AcelaLogo";
import ModePill from "./chat/ModePill";
import ChatInput, { ChatInputHandle } from "./chat/ChatInput";
import TopBar from "./TopBar";
import { AppMode, ModeOption } from "../types";
import SidebarNav from "./SidebarNav";
import BillingModal from "./modals/BillingModal";
import SettingsModal from "./modals/SettingsModal";
import { useChat } from "@/hooks/useChat";
import { useRecentChats } from "@/hooks/useRecentChats";
import ChatWindow from "./chat/ChatWindow";
import ChatSkeleton from "./skeletons/ChatSkeleton";

const modeOptions: ModeOption[] = [
  { id: "idea", label: "Idea", icon: Lightbulb },
  { id: "ask", label: "Ask", icon: HelpCircle },
  { id: "explore", label: "Explore", icon: Compass },
];

interface ChatShellProps {
  initialConversationId?: string;
}

export default function ChatShell({ initialConversationId }: ChatShellProps) {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();

  const modeParam = searchParams.get("mode") as AppMode | null;
  const validModeParam = !!(modeParam && modeOptions.map((m) => m.id).includes(modeParam));

  const [modePillClicked, setModePillClicked] = useState(validModeParam);
  const [activeMode, setActiveMode] = useState<AppMode | null>(validModeParam ? modeParam : null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [billingOpen, setBillingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const chatInputRef = useRef<ChatInputHandle>(null);

  const { items: recentChats, loading: recentChatsLoading, prependChat, updateTitle } = useRecentChats();

  const { messages, sendMessage, loading: chatLoading, loadingConversation, streamingMessageId } = useChat(
    initialConversationId,
    {
      onNewConversation: (chat) => prependChat(chat),
      onTitleGenerated: (id, title) => updateTitle(id, title),
      onResponseComplete: () => chatInputRef.current?.focus(),
      onInsufficientCredits: () => setBillingOpen(true),
    }
  );

  const activeModeOption = modeOptions.find((m) => m.id === activeMode) ?? null;

  if (sessionStatus === "loading") {
    return (
      <div className="flex h-dvh bg-base overflow-hidden">
        <div className="hidden md:flex h-dvh shrink-0 w-[92px] bg-base border-r border-white/5 animate-pulse" />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="h-6 w-6 rounded bg-white/5 animate-pulse md:hidden" />
            <div className="h-8 w-32 rounded-b-x10 bg-white/5 animate-pulse mx-auto md:mx-0" />
            <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse md:hidden" />
          </div>
          <ChatSkeleton />
        </div>
      </div>
    );
  }

  const handleModeClick = (modeId: AppMode) => {
    setModePillClicked(true);
    setActiveMode((current) => (current === modeId ? null : modeId));
  };

  const handleChatSend = async () => {
    if (!message.trim()) return;
    const snapshot = message;
    setMessage("");
    const ok = await sendMessage(snapshot, activeMode ?? "ask");
    if (!ok) setMessage(snapshot);
  };

  const sharedInputProps = {
    value: message,
    onChange: setMessage,
    onSubmit: handleChatSend,
    activeMode: modePillClicked ? activeModeOption : null,
    onClearMode: () => { setActiveMode(null); setModePillClicked(false); },
    onModeSelect: (id: AppMode) => handleModeClick(id),
    modeOptions,
  };

  return (
    <div className="flex h-dvh bg-base overflow-hidden">
      <SidebarNav
        recentChats={recentChats}
        recentChatsLoading={recentChatsLoading}
        user={session?.user ?? null}
        activeChatId={initialConversationId}
        onMobileClose={() => setSidebarOpen(false)}
        mobileOpen={sidebarOpen}
        defaultOpen={false}
        openAuthModal={() => setAuthOpen(true)}
        openSettingsModal={() => setSettingsOpen(true)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          plan="Free Plan"
          onMenuClick={() => setSidebarOpen(true)}
          user={session?.user ?? null}
          onUpgradeClick={() => setBillingOpen(true)}
          openAuthModal={() => setAuthOpen(true)}
          openSettingsModal={() => setSettingsOpen(true)}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {loadingConversation ? (
            <ChatSkeleton />
          ) : messages.length > 0 ? (
            <>
              <ChatWindow
                messages={messages}
                loading={chatLoading}
                streamingMessageId={streamingMessageId}
              />
              <div className="shrink-0 px-4 pb-4 pt-2">
                <div className="mx-auto w-full max-w-3xl">
                  <ChatInput
                    ref={chatInputRef}
                    {...sharedInputProps}
                    className="w-full"
                    loading={chatLoading || !!streamingMessageId}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 md:pb-24 md:pb-32">
              <div className="w-full h-full max-w-2xl flex justify-between md:justify-center flex-col items-center">
                <div className="pt-10 md:pt-0 md:hidden" />
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="flex items-center">
                    <AcelaLogo size={30} className="md:hidden mb-1" />
                    <AcelaLogo size={38} className="hidden mb-2 md:block" />
                  </div>
                  <h1 className="bg-gradient-to-r from-text-1 to-text-1/60 bg-clip-text text-center text-[28px] font-bold text-transparent tracking-tight">
                    What's on your mind today?
                  </h1>
                </div>

                {/* Mobile: mode pills above, input below */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 md:hidden w-full">
                  {modeOptions.map((mode) => (
                    <ModePill
                      key={mode.id}
                      icon={mode.icon}
                      label={mode.label}
                      active={activeMode === mode.id && modePillClicked}
                      onClick={() => handleModeClick(mode.id)}
                    />
                  ))}
                  <ChatInput
                    ref={chatInputRef}
                    {...sharedInputProps}
                    className="w-full"
                    loading={chatLoading}
                  />
                </div>

                {/* Desktop: input above, pills below */}
                <div className="hidden md:flex flex-col w-full gap-3 mt-6">
                  <ChatInput
                    ref={chatInputRef}
                    {...sharedInputProps}
                    className="w-full"
                    loading={chatLoading}
                  />
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {modeOptions.map((mode) => (
                      <ModePill
                        key={mode.id}
                        icon={mode.icon}
                        label={mode.label}
                        active={activeMode === mode.id && modePillClicked}
                        onClick={() => handleModeClick(mode.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <BillingModal open={billingOpen} onClose={() => setBillingOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
