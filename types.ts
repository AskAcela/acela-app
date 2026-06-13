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

export interface SessionUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}


export interface IconProps {
  className?: string;
}
