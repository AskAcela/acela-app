"use client";

import Modal from "./Modal";
import GoogleIcon from "../icons/GoogleIcon";
import GithubIcon from "../icons/GithubIcon";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const providers = [
  { icon: GoogleIcon, onClick: () => signIn("google"), id: "google" },
  { icon: GithubIcon, onClick: () => signIn("github"), id: "github" },
]

export default function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-text-1 text-2xl md:text-3xl font-extrabold mb-3">Log in or sign up</h2>
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
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-card border border-white/5 px-4 py-3.5 text-text-1 text-base font-medium hover:bg-white/5 transition-colors"
          >
            <provider.icon className="h-5 w-5" />
            Continue with {provider.id}
          </button>
        ))}
      </div>
    </Modal>
  );
}
