"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppMode, ChatMessage, RecentChat } from "@/types";
import { fetchConversationMessages, generateConversationTitle, sendChatMessage } from "@/lib/chat-api";
import { useNotification } from "@/context/NotificationContext";
import { getNotificationMessage } from "@/lib/errors";

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

interface UseChatCallbacks {
  /** Called with the new RecentChat when a brand-new conversation is created. */
  onNewConversation?: (chat: RecentChat) => void;
  /** Called with the conversation id + generated title after title arrives. */
  onTitleGenerated?: (id: string, title: string) => void;
  /** Called after the AI reply finishes streaming so the input can be re-focused. */
  onResponseComplete?: () => void;
  /** Called when the server returns 402 Insufficient Credits. */
  onInsufficientCredits?: () => void;
}

export function useChat(initialConversationId?: string, callbacks: UseChatCallbacks = {}) {
  const { onNewConversation, onTitleGenerated, onResponseComplete, onInsufficientCredits } = callbacks;
  const pathname = usePathname();
  const notify = useNotification();

  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(!!initialConversationId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!initialConversationId) return;
    setLoadingConversation(true);
    fetchConversationMessages(initialConversationId)
      .then((data) => {
        setMessages(data.messages);
        setConversationId(initialConversationId);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingConversation(false));
  }, [hydrated, initialConversationId]);

  function streamContent(messageId: string, fullText: string): Promise<void> {
    const tokens = fullText.split(/(\s+)/);
    let idx = 0;
    return new Promise<void>((resolve) => {
      const tick = () => {
        idx = Math.min(idx + 5, tokens.length);
        setMessages((prev) =>
          prev.map((m) => m._id === messageId ? { ...m, content: tokens.slice(0, idx).join("") } : m)
        );
        if (idx < tokens.length) {
          setTimeout(tick, 15);
        } else {
          setStreamingMessageId(null);
          resolve();
        }
      };
      setTimeout(tick, 30);
    });
  }

  async function sendMessage(message: string, mode: AppMode = "ask"): Promise<boolean> {
    const trimmed = message.trim();
    if (!trimmed || loading || streamingMessageId) return false;

    setLoading(true);

    const tempId = uuid();
    const tempUserMessage: ChatMessage = {
      _id: tempId,
      conversationId: conversationId ?? "temp",
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const result = await sendChatMessage({ conversationId, message: trimmed, mode });

      setLoading(false);

      const isNew = !conversationId;
      setConversationId(result.conversationId);

      if (pathname === "/") {
        window.history.replaceState(null, "", `/c/${result.conversationId}?mode=${mode}`);
      }

      // Optimistically add new conversation to sidebar
      if (isNew) {
        onNewConversation?.({
          id: result.conversationId,
          title: trimmed.slice(0, 60),
        });
      }

      const assistantId = uuid();
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempId),
        tempUserMessage,
        {
          _id: assistantId,
          conversationId: result.conversationId,
          role: "assistant" as const,
          content: "",
          createdAt: new Date().toISOString(),
          creditsCharged: result.creditsCharged,
        },
      ]);
      setStreamingMessageId(assistantId);

      await streamContent(assistantId, result.reply);

      // Focus input now that the response is fully rendered
      onResponseComplete?.();

      // Generate a proper title in the background (new conversations only)
      if (isNew) {
        generateConversationTitle(result.conversationId, trimmed)
          .then((title) => {
            if (title) onTitleGenerated?.(result.conversationId, title);
          })
          .catch(() => {});
      }

      return true;
    } catch (err) {
      setLoading(false);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));

      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Insufficient credits")) {
        onInsufficientCredits?.();
      }
      notify(getNotificationMessage(err), "error");
      return false;
    }
  }

  return {
    conversationId,
    messages,
    loading,
    loadingConversation,
    streamingMessageId,
    setMessages,
    sendMessage,
  };
}
