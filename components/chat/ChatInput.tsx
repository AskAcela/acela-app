"use client";

import { useRef, useState, useEffect } from "react";
import { Plus, Send, Loader2 } from "lucide-react";
import ActiveModeTag from "../ActiveModeTag";
import { AppMode, ModeOption } from "@/types";

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  activeMode?: ModeOption | null;
  onClearMode?: () => void;
  onModeSelect?: (modeId: AppMode) => void;
  modeOptions?: ModeOption[];
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
  onModeSelect,
  modeOptions = [],
  className = "",
  loading = false,
}: ChatInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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
        <div className="relative flex items-center gap-2 min-w-0" ref={dropdownRef}>
          <button
            type="button"
            aria-label="Select mode"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-1 hover:bg-white/5 transition-colors shrink-0"
          >
            <Plus className="h-5 w-5" strokeWidth={1.75} />
          </button>

          {dropdownOpen && modeOptions.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 min-w-[160px] rounded-xl bg-card border border-white/10 shadow-xl shadow-black/30 py-1 z-50">
              {modeOptions.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode?.id === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      onModeSelect?.(mode.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                      isActive ? "text-primary" : "text-text-1"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          )}

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
