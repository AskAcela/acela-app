import ChatInput from "@/components/ChatInput";
import { MessageSquare, Sparkles, BookOpen } from "lucide-react";

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 h-full bg-zinc-950">
      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Welcome, Aizen
          </h1>
          <p className="text-lg text-zinc-400">
            How can I help you today?
          </p>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
          <button className="flex flex-col items-start p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg mb-4">
              <Sparkles size={20} />
            </div>
            <span className="font-semibold text-white mb-1">Generate Ideas</span>
            <span className="text-sm text-zinc-400">Brainstorm new concepts or features</span>
          </button>
          
          <button className="flex flex-col items-start p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg mb-4">
              <MessageSquare size={20} />
            </div>
            <span className="font-semibold text-white mb-1">Draft an Email</span>
            <span className="text-sm text-zinc-400">Write professional correspondence</span>
          </button>
          
          <button className="flex flex-col items-start p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg mb-4">
              <BookOpen size={20} />
            </div>
            <span className="font-semibold text-white mb-1">Learn a Topic</span>
            <span className="text-sm text-zinc-400">Explain complex concepts simply</span>
          </button>
        </div>

      </div>
      
      {/* Input Area anchored to bottom */}
      <div className="w-full pb-6 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent sticky bottom-0">
        <ChatInput />
      </div>
    </div>
  );
}
