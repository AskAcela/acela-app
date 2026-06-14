"use client";

import { Plus, Send, Loader2 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import ActiveModeTag from "../ActiveModeTag";

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  activeMode?: { icon: LucideIcon; label: string } | null;
  onClearMode?: () => void;
  className?: string;
  loading?: boolean;
}

export default function ChatInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "What can I help you with?",
  activeMode,
  onClearMode,
  className = "",
  loading = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div
      className={`rounded-x10 bg-card border border-white/5 px-4 pt-4 pb-3 shadow-lg shadow-black/20 ${className}`}
    >
      <textarea
        disabled={loading}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent text-text-1 placeholder:text-text-2 focus:outline-none text-base mb-3 max-h-40"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-1 hover:bg-white/5 transition-colors shrink-0"
          >
            <Plus className="h-5 w-5" strokeWidth={1.75} />
          </button>
          {activeMode && (
            <ActiveModeTag icon={activeMode.icon} label={activeMode.label} onClear={onClearMode} />
          )}
        </div>
        <button
          type="button"
          onClick={onSubmit}
          aria-label="Send message"
          disabled={!value.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-text-1 transition-colors enabled:hover:bg-white/5 disabled:text-faint-text disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}
