"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppMode, ChatMessage } from "@/types";
import { fetchConversationMessages, sendChatMessage } from "@/lib/chat-api";
import { useNotification } from "@/context/NotificationContext";
import { getNotificationMessage } from "@/lib/errors";

export function useChat(initialConversationId?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const notify = useNotification();

  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
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

  function streamContent(messageId: string, fullText: string): Promise<void> {
    const tokens = fullText.split(/(\s+)/); // split on whitespace, preserving spaces
    let idx = 0;

    return new Promise<void>((resolve) => {
      const tick = () => {
        idx = Math.min(idx + 5, tokens.length);
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, content: tokens.slice(0, idx).join("") }
              : m
          )
        );
        if (idx < tokens.length) {
          setTimeout(tick, 15);
        } else {
          setStreamingMessageId(null);
          resolve();
        }
      };
      setTimeout(tick, 30); // brief pause before first token appears
    });
  }

  async function sendMessage(message: string, mode: AppMode = "ask"): Promise<boolean> {
    const trimmed = message.trim();
    if (!trimmed || loading || streamingMessageId) return false;

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
      const result = await sendChatMessage({ conversationId, message: trimmed, mode });

      // Stop the thinking indicator the moment the response arrives,
      // then immediately begin streaming the content in.
      setLoading(false);
      setConversationId(result.conversationId);

      if (pathname === "/") {
        router.replace(`/c/${result.conversationId}?mode=${mode}`);
      }

      const assistantId = crypto.randomUUID();
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

      return true;
    } catch (err) {
      setLoading(false);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      notify(getNotificationMessage(err), "error");
      return false;
    }
  }

  return {
    conversationId,
    messages,
    loading,
    streamingMessageId,
    setMessages,
    sendMessage,
  };
}
