"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

const STORAGE_KEY = "acela:telegram-banner-dismissed";
const TELEGRAM_URL = "/api/go/telegram";

export default function TelegramBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="relative shrink-0 border-b border-primary/20 bg-primary/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 px-10 py-2 text-center text-xs sm:text-sm">
        <Send size={14} className="hidden shrink-0 text-primary sm:block" aria-hidden />
        <p className="text-text-2">
          Got questions or want the latest updates?{" "}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Join our Telegram community
          </a>
          .
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss Telegram announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-2 transition-colors hover:bg-white/5 hover:text-text-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}
