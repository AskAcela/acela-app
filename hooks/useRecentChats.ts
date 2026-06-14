"use client";

import { useEffect, useState } from "react";
import { fetchRecentChats } from "@/lib/chat-api";
import { RecentChat } from "@/types/chat";

export function useRecentChats(initialLimit = 20) {
  const [items, setItems] = useState<RecentChat[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchRecentChats({ limit: initialLimit });
        setItems(data.items);
        setNextCursor(data.nextCursor);
      } finally {
        setLoading(false);
      }
    }

    load();
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
  };
}