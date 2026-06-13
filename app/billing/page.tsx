import { Check, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 sm:p-8 h-full">
      <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Upgrade your plan</h1>
          <p className="text-zinc-400">Choose the perfect plan for your needs. Always flexible.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
            <p className="text-zinc-400 text-sm mb-6 h-10">For individuals just getting started with Acela.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-zinc-500">/month</span>
            </div>
            
            <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors mb-8">
              Current Plan
            </button>

            <div className="space-y-4 flex-1">
              <p className="text-sm font-medium text-white mb-4">What&apos;s included:</p>
              <ul className="space-y-3">
                {["Basic chat capabilities", "Standard response speed", "Community support"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 flex flex-col relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap size={12} /> Most Popular
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-zinc-400 text-sm mb-6 h-10">For power users who need maximum capabilities.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$20</span>
              <span className="text-zinc-500">/month</span>
            </div>
            
            <button className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors mb-8 shadow-lg shadow-emerald-500/20">
              Upgrade to Pro
            </button>

            <div className="space-y-4 flex-1">
              <p className="text-sm font-medium text-white mb-4">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {["Access to advanced models", "Faster response times", "Priority support", "Early access to new features"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
