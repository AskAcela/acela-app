"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppMode, ChatMessage } from "@/types";
import { fetchConversationMessages, sendChatMessage } from "@/lib/chat-api";

export function useChat(initialConversationId?: string) {
  const router = useRouter();
  const pathname = usePathname();

  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function loadConversation() {
      if (!initialConversationId) return;

      const data = await fetchConversationMessages(initialConversationId);
      setMessages(data.messages);
      setConversationId(initialConversationId);
    }

    loadConversation().catch(() => {
      setMessages([]);
    });
  }, [hydrated, initialConversationId]);

  async function sendMessage(message: string, mode: AppMode = "ask") {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);

    const tempId = crypto.randomUUID();
    const tempUserMessage: ChatMessage = {
      _id: tempId,
      conversationId: conversationId ?? "temp",
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const result = await sendChatMessage({
        conversationId,
        message: trimmed,
        mode,
      });

      setConversationId(result.conversationId);

      const assistantMessage: ChatMessage = {
        _id: crypto.randomUUID(),
        conversationId: result.conversationId,
        role: "assistant",
        content: result.reply,
        createdAt: new Date().toISOString(),
        creditsCharged: result.creditsCharged,
      };

      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempId),
        tempUserMessage,
        assistantMessage,
      ]);

      const isFirstMessage = !initialConversationId && pathname === "/";

      if (isFirstMessage) {
        router.replace(`/c/${result.conversationId}?mode=${mode}`);
      } else if (pathname === "/") {
        router.replace(`/c/${result.conversationId}?mode=${mode}`);
      }

      return result;
    } finally {
      setLoading(false);
    }
  }

  return {
    conversationId,
    messages,
    loading,
    setMessages,
    sendMessage,
  };
}