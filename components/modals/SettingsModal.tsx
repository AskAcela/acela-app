"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Mail, User, Zap } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface CreditsData {
  creditsRemaining: number;
  creditsSpentTotal: number;
  creditsPurchasedTotal: number;
  plan: string;
}

function ReadOnlyField({ label, value, icon: Icon }: { label: string; value?: string | null; icon: React.ElementType }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-wider text-text-faint">{label}</label>
      <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
        <Icon className="h-3.5 w-3.5 text-text-2 shrink-0" />
        <span className="text-sm text-text-1 truncate">{value || "Not available"}</span>
      </div>
    </div>
  );
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [credits, setCredits] = useState<CreditsData | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/user/credits")
      .then((r) => r.json())
      .then((d) => setCredits(d))
      .catch(() => {});
  }, [open]);

  const totalCredits = credits
    ? credits.creditsSpentTotal + credits.creditsRemaining
    : null;

  const usedPct = totalCredits
    ? Math.min(100, Math.round((credits!.creditsSpentTotal / totalCredits) * 100))
    : 0;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] overflow-hidden shrink-0 flex items-center justify-center">
            {user?.image
              ? <img src={user.image} alt={user.name ?? "User"} className="h-full w-full object-cover" />
              : <User className="h-5 w-5 text-text-2" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-1 truncate">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-text-2 truncate">{user?.email ?? "—"}</p>
          </div>
        </div>

        {status === "loading" ? (
          <div className="text-sm text-text-2 text-center py-4">Loading…</div>
        ) : (
          <>
            {/* Account fields */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-text-2 uppercase tracking-wider">Account</p>
              <div className="grid gap-3 grid-cols-2">
                <ReadOnlyField label="Name" value={user?.name} icon={User} />
                <ReadOnlyField label="Email" value={user?.email} icon={Mail} />
              </div>
            </section>

            {/* Credits */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-text-2 uppercase tracking-wider">Credits</p>
              {credits === null ? (
                <div className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
              ) : (
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-2">
                      <Zap className="h-3.5 w-3.5" />
                      <span className="text-xs">Usage</span>
                    </div>
                    <span className="text-xs text-text-1 font-medium tabular-nums">
                      {credits.creditsSpentTotal} <span className="text-text-faint">/ {totalCredits}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-faint">
                    <span>{credits.creditsRemaining} remaining</span>
                    <span className="capitalize">{credits.plan.replace(/_/g, " ")}</span>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-white/8 pt-4">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/15"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </Modal>
  );
}
