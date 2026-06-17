"use client";

import { ArrowRight, LogIn, Loader2, Zap } from "lucide-react";
import { IdeaBlob } from "./IdeaBlob";
import { SessionUser } from "@/types";

interface IdeaWelcomeProps {
  user: SessionUser | null | undefined;
  /** null = eligibility check in progress */
  eligible: boolean | null;
  onStart: () => void;
  onAuthRequired: () => void;
  onUpgradeRequired: () => void;
}

export default function IdeaWelcome({
  user,
  eligible,
  onStart,
  onAuthRequired,
  onUpgradeRequired,
}: IdeaWelcomeProps) {
  const isAuthenticated = !!user;

  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-base">

      {/* ── Animated background blobs ─────────────────── */}
      <div className="absolute -top-48 -right-48" style={{ color: "var(--primary)" }}>
        <IdeaBlob variant="lg" opacity={0.35} />
      </div>
      <div className="absolute -bottom-48 -left-48" style={{ color: "var(--primary)" }}>
        <IdeaBlob variant="lg" opacity={0.30} animationDelay="2s" />
      </div>
      <div className="absolute" style={{ top: "33%", left: "-8rem", color: "var(--status-info)" }}>
        <IdeaBlob variant="md" opacity={0.25} animationDelay="1s" />
      </div>
      <div className="absolute" style={{ bottom: "25%", right: "25%", color: "var(--status-accent-blue)" }}>
        <IdeaBlob variant="md" opacity={0.20} animationDelay="3s" />
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-3xl">

        {/* Heading */}
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text-1">
            Pitch your idea
          </h1>
          <p className="text-lg md:text-xl text-text-2 max-w-2xl mx-auto leading-relaxed">
            Acela will push back, challenge your assumptions, poke holes, and
            help you sharpen your thinking.
          </p>
        </div>

        {/* 2-minute badge */}
        <div className="border-[3px] border-primary px-6 py-4 rounded-[10px] bg-surface/60">
          <div className="text-3xl font-bold text-primary">5 minutes</div>
          <div className="text-sm uppercase text-text-faint mt-1 tracking-widest">
            Limited Time
          </div>
        </div>

        {/* CTA — three states */}
        {!isAuthenticated ? (
          // Not logged in
          <button
            onClick={onAuthRequired}
            className="flex items-center gap-2 border-[3px] border-primary font-bold px-8 py-4 text-lg rounded-[10px] text-primary focus:outline-none"
            style={{ transition: "background 0.15s, color 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "var(--base)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--primary)"; }}
          >
            <LogIn className="w-5 h-5" />
            Log in to get started
          </button>
        ) : eligible === null ? (
          // Checking eligibility
          <button
            disabled
            className="flex items-center gap-2 bg-primary font-bold px-8 py-4 text-lg rounded-[10px] opacity-60 cursor-not-allowed"
            style={{ color: "var(--base)" }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking…
          </button>
        ) : eligible ? (
          // Ready to start
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-primary font-bold px-8 py-4 text-lg rounded-[10px] transition-colors hover:bg-primary-hover focus:outline-none"
            style={{ color: "var(--base)" }}
          >
            Start Session
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          // No free session left / no credits
          <div className="flex flex-col items-center gap-3">
            <p className="text-text-faint text-sm">
              You&apos;ve used your free Idea session.
            </p>
            <button
              onClick={onUpgradeRequired}
              className="flex items-center gap-2 bg-primary font-bold px-8 py-4 text-lg rounded-[10px] transition-colors hover:bg-primary-hover focus:outline-none"
              style={{ color: "var(--base)" }}
            >
              <Zap className="w-5 h-5" />
              Get a plan to continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
