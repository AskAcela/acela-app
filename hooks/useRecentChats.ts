"use client";

import { useEffect, useState } from "react";
import { fetchRecentChats } from "@/lib/chat-api";
import { RecentChat } from "@/types";
import { useNotification } from "@/context/NotificationContext";
import { getNotificationMessage } from "@/lib/errors";

export function useRecentChats(initialLimit = 20) {
  const notify = useNotification();
  const [items, setItems] = useState<RecentChat[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  // loading is only true during the very first fetch, not on refresh
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  function prependChat(chat: RecentChat) {
    setItems((prev) => {
      // Avoid duplicates (e.g. if refresh and prepend race)
      if (prev.some((c) => c.id === chat.id)) return prev;
      return [chat, ...prev];
    });
  }

  // Update title of an existing item in-place (called after title generation)
  function updateTitle(id: string, title: string) {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }

  async function load(showSkeleton = false) {
    if (showSkeleton) setLoading(true);
    try {
      const data = await fetchRecentChats({ limit: initialLimit });
      setItems(data.items);
      setNextCursor(data.nextCursor);
    } catch (err) {
      notify(getNotificationMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
  }, [initialLimit]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await fetchRecentChats({
        limit: initialLimit,
        cursor: nextCursor,
      });

      setItems((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      notify(getNotificationMessage(err), "error");
    } finally {
      setLoadingMore(false);
    }
  }

  return {
    items,
    nextCursor,
    loading,
    loadingMore,
    loadMore,
    prependChat,
    updateTitle,
    reload: () => load(false),
  };
}