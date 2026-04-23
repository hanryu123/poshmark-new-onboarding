import { useCallback, useEffect, useRef, useState } from "react";
import type { AgeRange, Gender, SelectedListing } from "../types/onboarding.types";
import { mockSearchListings } from "../mockListings";

type Params = {
  query: string;
  gender: Gender | null;
  ageRange: AgeRange | null;
  debounceMs?: number;
};

export function useSearchListings({ query, gender, ageRange, debounceMs = 400 }: Params) {
  const [listings, setListings] = useState<SelectedListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tRef = useRef<number | null>(null);

  const runFetch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) {
        setListings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const qs = new URLSearchParams({
        q: trimmed,
        ...(gender ? { gender } : {}),
        ...(ageRange ? { ageRange } : {}),
      });
      try {
        const res = await fetch(`/api/listings/search?${qs}`);
        if (res.ok) {
          const data = (await res.json()) as { listings?: SelectedListing[] };
          setListings(data.listings ?? mockSearchListings(trimmed));
        } else {
          setListings(mockSearchListings(trimmed));
        }
      } catch {
        setListings(mockSearchListings(trimmed));
      } finally {
        setLoading(false);
      }
    },
    [gender, ageRange]
  );

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    const q = query.trim();
    if (!q) {
      setListings([]);
      setLoading(false);
      return;
    }
    tRef.current = window.setTimeout(() => {
      void runFetch(q);
    }, debounceMs);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [query, debounceMs, runFetch]);

  const refetch = useCallback(() => {
    void runFetch(query);
  }, [query, runFetch]);

  return { listings, loading, error, refetch };
}
