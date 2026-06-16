"use client";

import { useCallback, useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import ThinkingMessage from "./ThinkingMessage";
import { ChatMessage } from "@/types";

export default function ChatWindow({
  messages,
  loading = false,
  streamingMessageId = null,
}: {
  messages: ChatMessage[];
  loading?: boolean;
  streamingMessageId?: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    atBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  }, []);

  useEffect(() => {
    if (atBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6" onScroll={handleScroll}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg._id} text={msg.content} />
          ) : (
            <AssistantMessage
              key={msg._id}
              text={msg.content}
              streaming={msg._id === streamingMessageId}
            />
          )
        )}
        {loading && <ThinkingMessage />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
