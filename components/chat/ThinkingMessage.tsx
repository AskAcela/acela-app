"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Thinking...",
  "Analyzing...",
  "Searching my knowledge...",
  "Processing...",
  "Reasoning...",
  "Almost there...",
];

export default function ThinkingMessage() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 200);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <p
        className={`text-sm text-text-faint transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {PHRASES[idx]}
      </p>
    </div>
  );
}
