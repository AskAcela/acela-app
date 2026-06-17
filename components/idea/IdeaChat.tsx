"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Clock } from "lucide-react";
import AcelaLogo from "@/components/icons/AcelaLogo";
import AssistantMarkdown from "@/components/chat/AssistantMarkdown";
import { ChatMessage, SessionUser } from "@/types";

interface IdeaChatProps {
  user: SessionUser | null | undefined;
  messages: ChatMessage[];
  loading: boolean;
  streamingMessageId?: string | null;
  onSendMessage: (msg: string) => Promise<boolean>;
  onSessionEnd: (elapsed: number) => void;
}

const DURATION = 300;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// All colors derive from globals.css CSS variables via color-mix() for opacity variants
function getTimerStyles(timeLeft: number) {
  if (timeLeft > 60)
    return {
      color: "var(--primary)",
      bg: "color-mix(in srgb, var(--primary) 8%, transparent)",
      border: "var(--primary-glow)",
    };
  if (timeLeft > 30)
    return {
      color: "var(--status-info)",
      bg: "color-mix(in srgb, var(--status-info) 8%, transparent)",
      border: "color-mix(in srgb, var(--status-info) 20%, transparent)",
    };
  return {
    color: "var(--status-error)",
    bg: "color-mix(in srgb, var(--status-error) 8%, transparent)",
    border: "color-mix(in srgb, var(--status-error) 20%, transparent)",
  };
}

export default function IdeaChat({
  user,
  messages,
  loading,
  streamingMessageId,
  onSendMessage,
  onSessionEnd,
}: IdeaChatProps) {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sessionOver = timeLeft <= 0;

  const timerPaused = loading || !!streamingMessageId || input.trim().length > 0;

  useEffect(() => {
    if (timeLeft <= 0 || timerPaused) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerPaused]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  const timerStyles = getTimerStyles(timeLeft);
  const isCritical = timeLeft <= 30 && !sessionOver;
  const userInitial =
    user?.name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    setInput(el.value);
  };

  const handleSend = async () => {
    if (!input.trim() || sending || sessionOver || loading) return;
    const msg = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(true);
    await onSendMessage(msg);
    setSending(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const visibleMessages = messages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">

      {/* ── Timer bar ─────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-center py-3 px-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${isCritical ? "animate-timer-blink" : ""}`}
          style={{ background: timerStyles.bg, border: `1px solid ${timerStyles.border}` }}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: timerStyles.color }} strokeWidth={2} />
          <span className="font-mono text-sm font-semibold tabular-nums" style={{ color: timerStyles.color }}>
            {sessionOver ? "Time's up" : formatTime(timeLeft)}
          </span>
          {!sessionOver && (
            <span className="text-xs text-text-faint ml-1 hidden sm:inline">
              {timerPaused ? "paused" : "remaining"}
            </span>
          )}
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {visibleMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-center max-w-xs">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--primary) 15%, transparent)",
                }}
              >
                <AcelaLogo size={20} />
              </div>
              <p className="text-text-faint text-sm leading-relaxed">
                The session has started. Describe your idea and I&apos;ll help you sharpen it.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {visibleMessages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-3 animate-fade-up ${isUser ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  {isUser ? (
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                        color: "var(--base)",
                      }}
                    >
                      {user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="" className="w-8 h-8 object-cover" />
                      ) : (
                        userInitial
                      )}
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--primary) 18%, transparent)",
                      }}
                    >
                      <AcelaLogo size={18} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[76%] rounded-2xl px-4 py-3 ${
                      isUser ? "rounded-tr-sm" : "rounded-tl-sm"
                    }`}
                    style={
                      isUser
                        ? {
                            background:
                              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent) 0%, color-mix(in srgb, var(--primary) 8%, transparent) 100%)",
                            border: "1px solid var(--primary-glow)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }
                    }
                  >
                    {isUser ? (
                      <p className="text-sm leading-relaxed text-text-1">{msg.content}</p>
                    ) : (
                      <AssistantMarkdown content={msg.content} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking indicator */}
            {(loading || streamingMessageId) && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--primary) 18%, transparent)",
                  }}
                >
                  <AcelaLogo size={18} />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex gap-1 items-center h-4">
                    {[0, 140, 280].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: "var(--text-faint)", animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input / session-over CTA ───────────────────────── */}
      <div
        className="shrink-0 px-4 pb-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {sessionOver ? (
          <div className="flex flex-col items-center gap-3 py-3">
            <p className="text-text-2 text-sm">Your session is complete.</p>
            <button
              onClick={() => onSessionEnd(DURATION - timeLeft)}
              className="flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
                color: "var(--base)",
                boxShadow: "0 0 24px var(--primary-glow)",
              }}
            >
              View Executive Summary →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-3xl mx-auto">
            {/* Message input */}
            <div
              className="flex items-end gap-3 rounded-[10px] px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Describe your idea…"
                rows={1}
                className="flex-1 bg-transparent text-text-1 placeholder:text-text-faint text-sm resize-none outline-none leading-relaxed"
                style={{ maxHeight: 120 }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending || loading}
                className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: "var(--base)" }} />
              </button>
            </div>

            {/* End Session — secondary action */}
            <button
              onClick={() => onSessionEnd(DURATION - timeLeft)}
              className="w-full py-2.5 text-xs font-medium text-text-faint rounded-[10px] transition-colors hover:text-text-2 hover:bg-white/5 focus:outline-none"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              End Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
