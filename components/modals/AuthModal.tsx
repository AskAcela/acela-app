"use client";

import Modal from "./Modal";
import GithubIcon from "../icons/GithubIcon";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

async function signInWithMigration(provider: string) {
  // Tag the callbackUrl so the page knows to run migration after redirect
  await signIn(provider, { callbackUrl: "/?migrate=1" });
}

const providers = [
  { icon: GithubIcon, onClick: () => signInWithMigration("github"), id: "github" },
];

export default function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-text-1 text-xl font-bold mb-2">Log in or sign up</h2>
        <p className="text-text-2 text-sm">
          You&apos;ll get smarter responses and can share, see chat history, and more.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={provider.onClick}
            className="w-full flex items-center justify-center gap-3 rounded-x10 bg-card border border-white/5 px-4 py-3.5 text-text-1 text-base font-medium hover:bg-white/5 transition-colors"
          >
            <provider.icon className="h-5 w-5" />
            Continue with {provider.id}
          </button>
        ))}
      </div>
    </Modal>
  );
}
