import ChatInput from "@/components/ChatInput";
import { User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Share, Zap } from "lucide-react";

export default function ChatInterface() {
  const messages = [
    {
      id: 1,
      role: "user",
      content: "Can you help me brainstorm some ideas for a new marketing campaign for a sustainable fashion brand?",
    },
    {
      id: 2,
      role: "assistant",
      content: "Absolutely! Here are a few creative marketing campaign ideas for a sustainable fashion brand:\n\n1. **\"Thread of Truth\" Documentary Series**: Create short, behind-the-scenes videos showcasing your transparent supply chain, from sourcing organic materials to ethical manufacturing.\n\n2. **\"Wear Your Values\" Influencer Partnerships**: Partner with micro-influencers who actively promote eco-friendly lifestyles to showcase your pieces in their everyday lives.\n\n3. **Upcycling Challenge**: Launch a social media contest encouraging customers to upcycle their old clothes, offering a discount on your brand for the most creative entries.\n\nWould you like to explore any of these in more detail?",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 md:static md:bg-transparent md:backdrop-blur-none">
        <div className="md:hidden flex items-center w-8">
          {/* Spacer for mobile menu icon from layout */}
        </div>
        
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <button className="font-medium text-white flex items-center gap-2 hover:bg-zinc-800/50 px-3 py-1.5 rounded-lg transition-colors">
            Sustainable Marketing
            <span className="text-zinc-500 text-xs">▼</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <Share size={16} />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors shadow-sm">
            <Zap size={16} className="text-emerald-500" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>
        </div>
      </header>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500 text-white"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <span className="font-bold text-xs">A</span>}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-zinc-800 text-white rounded-tr-sm" 
                    : "bg-transparent text-zinc-100 p-0"
                }`}>
                  <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>

                {/* AI Actions */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-2 text-zinc-500">
                    <button className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-md transition-colors" title="Copy">
                      <Copy size={14} />
                    </button>
                    <button className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-md transition-colors" title="Regenerate">
                      <RotateCcw size={14} />
                    </button>
                    <button className="p-1.5 hover:text-emerald-400 hover:bg-zinc-800 rounded-md transition-colors" title="Good response">
                      <ThumbsUp size={14} />
                    </button>
                    <button className="p-1.5 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors" title="Bad response">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-8">
        <ChatInput />
      </div>
    </div>
  );
}
