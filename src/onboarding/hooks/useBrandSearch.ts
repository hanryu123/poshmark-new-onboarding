import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND_IMAGE, similarPool } from "../../brandAssets";

export type BrandHit = { id: string; name: string; logoUrl: string };

function fromCatalog(q: string, limit = 5): BrandHit[] {
  const lower = q.trim().toLowerCase();
  if (lower.length < 2) return [];
  return Object.keys(BRAND_IMAGE)
    .filter((k) => k !== "default" && k.toLowerCase().startsWith(lower))
    .slice(0, limit)
    .map((name) => ({
      id: name,
      name,
      logoUrl: BRAND_IMAGE[name] ?? BRAND_IMAGE.default,
    }));
}

export function useBrandSearch(query: string) {
  const [hits, setHits] = useState<BrandHit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHits = useCallback(async (q: string) => {
    const t = q.trim();
    if (t.length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/brands/search?q=${encodeURIComponent(t)}`);
      if (res.ok) {
        const data = (await res.json()) as { brands?: BrandHit[] };
        setHits(data.brands?.length ? data.brands : fromCatalog(t));
      } else {
        setHits(fromCatalog(t));
      }
    } catch {
      setHits(fromCatalog(t));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHits(query);
  }, [query, fetchHits]);

  return { hits, loading };
}

export type SimilarBrand = BrandHit & { sampleListingUrl: string };

export async function fetchSimilarBrands(brand: string): Promise<SimilarBrand[]> {
  try {
    const res = await fetch(`/api/brands/similar?brand=${encodeURIComponent(brand)}`);
    if (res.ok) {
      const data = (await res.json()) as { brands?: SimilarBrand[] };
      if (data.brands?.length) return data.brands;
    }
  } catch {
    /* fall through */
  }
  const pool = similarPool(brand);
  return pool.slice(0, 6).map((name) => ({
    id: name,
    name,
    logoUrl: BRAND_IMAGE[name] ?? BRAND_IMAGE.default,
    sampleListingUrl: BRAND_IMAGE[name] ?? BRAND_IMAGE.default,
  }));
}
