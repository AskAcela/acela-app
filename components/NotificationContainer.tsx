"use client";

import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import type { Notification, NotificationType } from "@/context/NotificationContext";

const iconMap: Record<NotificationType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
};

const iconColorMap: Record<NotificationType, string> = {
  info: "text-status-accent-blue",
  success: "text-status-success",
  error: "text-status-error",
};

const borderColorMap: Record<NotificationType, string> = {
  info: "border-status-accent-blue/30",
  success: "border-status-success/30",
  error: "border-status-error/30",
};

function Toast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const Icon = iconMap[notification.type];

  return (
    <div
      className={`flex items-start gap-3 rounded-x10 bg-card border ${borderColorMap[notification.type]} px-4 py-3 shadow-lg shadow-black/30 min-w-64 max-w-sm animate-toast-in`}
    >
      <Icon
        className={`h-5 w-5 mt-0.5 shrink-0 ${iconColorMap[notification.type]}`}
        strokeWidth={1.75}
      />
      <p className="flex-1 text-sm text-text-1 leading-snug">{notification.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 text-text-faint hover:text-text-2 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationContainer({
  notifications,
  onDismiss,
}: {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <Toast notification={n} onDismiss={() => onDismiss(n.id)} />
        </div>
      ))}
    </div>
  );
}
