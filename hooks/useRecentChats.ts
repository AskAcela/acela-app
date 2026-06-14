"use client";

import { useEffect, useState } from "react";
import { fetchRecentChats } from "@/lib/chat-api";
import { RecentChat } from "@/types";

export function useRecentChats(initialLimit = 20) {
  const [items, setItems] = useState<RecentChat[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [version, setVersion] = useState(0);

  function refresh() {
    setVersion(v => v + 1);
  }

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

  useEffect(() => {
    load();
  }, [version, initialLimit]);

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
    refresh,
  };
}