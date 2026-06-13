"use client";

import Modal from "./Modal";
import { signOut, useSession } from "next-auth/react";
import {
  LogOut,
  Mail,
  User,
} from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function ReadOnlyField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-text-3">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl0 border border-white/10 bg-white/[0.03] px-4 py-3">
        <Icon className="h-4 w-4 text-text-3" />
        <span className="text-sm text-text-1">
          {value || "Not available"}
        </span>
      </div>
    </div>
  );
}

export default function SettingsModal({
  open,
  onClose,
}: SettingsModalProps) {
  const { data: session, status } = useSession();

  const user = session?.user;

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-text-2" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-text-1">
            Account Settings
          </h1>

          <p className="mt-2 text-text-2">
            View your account and authentication details.
          </p>
        </div>

        {status === "loading" ? (
          <div className="text-center text-text-2">
            Loading account...
          </div>
        ) : (
          <>
            {/* Account Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-text-1">
                Account Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <ReadOnlyField
                  label="Full Name"
                  value={user?.name}
                  icon={User}
                />

                <ReadOnlyField
                  label="Email Address"
                  value={user?.email}
                  icon={Mail}
                />
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl0 border border-red-500/20 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/15"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
}