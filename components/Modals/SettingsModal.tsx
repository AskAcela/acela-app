import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-48 sm:w-64 border-r border-zinc-800 p-4 space-y-1 overflow-y-auto">
            {["General", "Account", "Appearance", "Data Controls", "Builder Profile"].map((item, i) => (
              <button 
                key={item} 
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  i === 0 ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-6">General</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Theme</div>
                  <div className="text-sm text-zinc-500">Select your preferred interface theme.</div>
                </div>
                <select className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500">
                  <option>System Default</option>
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              </div>

              <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Clear all chats</div>
                  <div className="text-sm text-zinc-500">Permanently remove all your chat history.</div>
                </div>
                <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium rounded-lg transition-colors">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
