"use client";

import { useState } from "react";
import { Plus, Send, Sparkles, Compass, HelpCircle } from "lucide-react";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"ask" | "idea" | "explore">("ask");

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {/* Input Box */}
      <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
        <button className="p-3 text-zinc-400 hover:text-white transition-colors ml-1">
          <Plus size={20} />
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Acela anything..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 px-2 py-4 outline-none min-w-0"
        />
        
        <button 
          className={`p-3 transition-colors mr-1 ${input.trim() ? "text-emerald-400 hover:text-emerald-300" : "text-zinc-600 cursor-not-allowed"}`}
          disabled={!input.trim()}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={() => setMode("ask")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === "ask" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <HelpCircle size={14} /> Ask
        </button>
        <button
          onClick={() => setMode("idea")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === "idea" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Sparkles size={14} /> Idea
        </button>
        <button
          onClick={() => setMode("explore")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === "explore" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Compass size={14} /> Explore
        </button>
      </div>
    </div>
  );
}
