export function getNotificationMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error ?? "");

  if (msg.includes("Insufficient credits")) {
    return "You've run out of credits. Visit billing to top up and keep chatting.";
  }
  if (msg.includes("Agent request failed") || msg.includes("Agent returned an empty response")) {
    return "The AI service is temporarily unavailable. Please try again in a moment.";
  }
  if (msg.includes("AGENT_URL")) {
    return "Service configuration error. Please try again later.";
  }
  if (msg.includes("Failed to save conversation")) {
    return "Your message was sent but couldn't be saved. Try refreshing the page.";
  }
  if (msg.includes("Failed to load recent chats")) {
    return "Couldn't load your recent conversations.";
  }
  if (msg.includes("Failed to load conversation")) {
    return "Couldn't load this conversation.";
  }
  if (msg.includes("Failed to send message") || msg.toLowerCase().includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}
