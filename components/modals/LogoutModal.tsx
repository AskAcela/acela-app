"use client";

import { X, LogOut } from "lucide-react";
import Modal from "./Modal";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-text-1 text-xl md:text-2xl font-bold mb-6">Logout</h2>

      <p className="text-text-1 text-base mb-6">Are you sure you want to logout?</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-xl bg-status-error px-5 py-2.5 text-base font-medium text-text-1 hover:opacity-90 transition-opacity"
        >
          <X className="h-4 w-4" strokeWidth={2} />
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-2 rounded-xl0 border border-white/10 px-5 py-2.5 text-base font-medium text-text-1 hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </Modal>
  );
}
