import { LucideIcon } from "lucide-react";

export type AppMode = "idea" | "ask" | "explore";

export type ChatRole = "user" | "assistant" | "system" | "tool";
export interface ChatMessage {
  _id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  tokenCount?: number;
  creditsCharged?: number;
}

export interface RecentChat {
  id: string;
  title: string;
  updatedAt?: string;
}
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
  size?: number;
  className?: string;
}

export type ChatRequestBody = {
  conversationId?: string;
  message: string;
};

export type AgentResponseShape = {
  message: string;
  usage: {
    total_tokens: number;
  }
};