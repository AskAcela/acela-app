"use client";

import { useState, useEffect } from "react";
import IdeaWelcome from "./IdeaWelcome";
import IdeaChat from "./IdeaChat";
import IdeaSummary from "./IdeaSummary";
import { ChatMessage, SessionUser } from "@/types";
import { fetchIdeaSummary } from "@/lib/chat-api";

type IdeaScreen = "welcome" | "chat" | "summary";

interface IdeaFlowProps {
  user: SessionUser | null | undefined;
  conversationId?: string;
  messages: ChatMessage[];
  initialSummary?: string | null;
  loading: boolean;
  streamingMessageId?: string | null;
  onSendMessage: (msg: string) => Promise<boolean>;
  onAuthRequired: () => void;
  onUpgradeRequired: () => void;
  onResetChat: () => void;
}

export default function IdeaFlow({
  user,
  conversationId,
  messages,
  initialSummary,
  loading,
  streamingMessageId,
  onSendMessage,
  onAuthRequired,
  onUpgradeRequired,
  onResetChat,
}: IdeaFlowProps) {
  // If the conversation already has a summary (revisiting from recent chats),
  // go straight to the summary screen.
  const hasExistingSummary = !!initialSummary && messages.length > 0;
  const [screen, setScreen] = useState<IdeaScreen>(
    hasExistingSummary ? "summary" : messages.length > 0 ? "chat" : "welcome"
  );
  const [summary, setSummary] = useState<string | null>(initialSummary ?? null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  // null = still checking, true/false = result
  const [eligible, setEligible] = useState<boolean | null>(null);

  // Re-check eligibility every time the welcome screen is shown
  useEffect(() => {
    if (screen !== "welcome" || !user) return;
    setEligible(null);
    fetch("/api/idea/eligibility")
      .then((r) => r.json())
      .then((data) => setEligible(data.eligible ?? true))
      .catch(() => setEligible(true)); // fail open
  }, [screen, user]);

  const handleSessionEnd = async (elapsed: number) => {
    setSessionDuration(elapsed);
    setScreen("summary");
    if (!conversationId) return;
    setSummaryLoading(true);
    try {
      const result = await fetchIdeaSummary(conversationId);
      setSummary(result.summary);
    } catch {
      // IdeaSummary will fall back to placeholder
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setSummaryLoading(false);
    onResetChat(); // clear messages + conversationId from useChat
    setScreen("welcome");
  };

  if (screen === "welcome") {
    return (
      <IdeaWelcome
        user={user}
        eligible={eligible}
        onStart={() => setScreen("chat")}
        onAuthRequired={onAuthRequired}
        onUpgradeRequired={onUpgradeRequired}
      />
    );
  }

  if (screen === "summary") {
    return (
      <IdeaSummary
        messages={messages}
        summary={summary}
        loading={summaryLoading}
        duration={sessionDuration}
        onReset={handleReset}
      />
    );
  }

  return (
    <IdeaChat
      user={user}
      messages={messages}
      loading={loading}
      streamingMessageId={streamingMessageId}
      onSendMessage={onSendMessage}
      onSessionEnd={(elapsed) => handleSessionEnd(elapsed)}
    />
  );
}
