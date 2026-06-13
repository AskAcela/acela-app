import { LucideIcon } from "lucide-react";

export type AppMode = "idea" | "ask" | "explore";

export interface ModeOption {
  id: AppMode;
  label: string;
  icon: LucideIcon;
}

export interface RecentChat {
  id: string;
  title: string;
}

export interface User {
  name: string;
  plan: "Free Plan" | "Pro Plan";
  avatarUrl: string;
}
