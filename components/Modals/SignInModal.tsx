import { X } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="font-bold text-xl text-white">A</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-zinc-400">Log in or sign up to continue</p>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium transition-colors">
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl font-medium transition-colors">
            {/* Apple Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.365 21.44c-.66.45-1.55.93-2.67.93-1.07 0-1.6-.33-2.58-.33-.99 0-1.44.35-2.57.35-1.14 0-1.84-.44-2.6-.96-1.74-1.21-3.32-3.8-3.32-6.66 0-3.35 2.15-5.11 4.2-5.11 1.14 0 2.02.43 2.72.43.71 0 1.93-.49 3.23-.49 1.01 0 2.45.1 3.45 1.25-2.73 1.54-2.3 5.48.51 6.64-.47 1.4-1.39 2.8-2.37 3.96zM15.11 6.84c.6-1.12.83-2.31.57-3.48-1.01.07-2.33.67-3.07 1.52-.77.89-1.28 2.1-1.07 3.3 1.09.11 2.46-.57 3.1-1.39-1.21-.08-2.22-.53-2.9-1.27.7-.63 1.7-.99 2.76-.99 1.15 0 2.37.52 3.1 1.34z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
