"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchRecommendations, updateRecommendation } from "@/app/lib/api";
import { Recommendation } from "@/app/types/recommendation";

export function useRecommendations() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchRecommendations();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const toggleCompletion = async (id: string, completed: boolean) => {
    // optimistic update
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed } : r))
    );
    try {
      await updateRecommendation(id, { completed });
      setError(null);
    } catch {
      // rollback on error
      setData((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: !completed } : r))
      );
      setError("Unable to update recommendation. Please try again.");
    }
  };

  const retry = () => {
    void loadRecommendations();
  };

  return { data, loading, error, toggleCompletion, retry };
}
