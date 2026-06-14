"use client";

import { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { ChatMessage } from "@/types";

export default function ChatWindow({
  messages,
}: {
  messages: ChatMessage[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg._id} text={msg.content} />
          ) : (
            <AssistantMessage key={msg._id} text={msg.content} />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
