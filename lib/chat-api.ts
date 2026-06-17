import { AppMode, ChatMessage, RecentChat } from "@/types";

export async function sendChatMessage(input: {
  conversationId?: string;
  message: string;
  mode?: AppMode;
}) {
  const mode = input.mode ?? "ask";

  const search = new URLSearchParams();
  search.set("mode", mode);

  const res = await fetch(`/api/chat?${search.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to send message");
  }

  return res.json() as Promise<{
    conversationId: string;
    reply: string;
    creditsRemaining: number;
    creditsCharged: number;
    tokensUsed: number;
    plan: string;
  }>;
}

export async function fetchRecentChats(params?: {
  cursor?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.limit) search.set("limit", String(params.limit));

  const res = await fetch(`/api/conversations/recent?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load recent chats");

  return res.json() as Promise<{
    items: RecentChat[];
    nextCursor: string | null;
  }>;
}

export async function generateConversationTitle(
  conversationId: string,
  message: string
): Promise<string | null> {
  const res = await fetch(`/api/conversations/${conversationId}/title`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) return null;
  const data = await res.json() as { title: string };
  return data.title ?? null;
}

export async function fetchIdeaSummary(
  conversationId: string
): Promise<{ summary: string; tokensUsed: number }> {
  const res = await fetch("/api/idea/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
  });
  if (!res.ok) throw new Error("Failed to generate summary");
  return res.json();
}

export async function fetchConversationMessages(conversationId: string) {
  const res = await fetch(`/api/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("Failed to load conversation messages");

  return res.json() as Promise<{
    messages: ChatMessage[];
    ideaSummary: string | null;
  }>;
}