"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, children, maxWidth = "max-w-md" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-surface border border-white/5 p-6 md:p-8 shadow-2xl shadow-black/40`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-text-1 hover:text-text-2 transition-colors"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
        {children}
      </div>
    </div>
  );
}
