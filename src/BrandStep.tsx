import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  INITIAL_GRID,
  diversePool,
  imageForBrand,
  pickMixedBrands,
  similarPool,
} from "./brandAssets";

const COLS = 4;
const SLOT_COUNT = 20;

const FALLBACK_BRANDS: string[] = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Gucci",
  "Prada",
  "Louis Vuitton",
  "Chanel",
  "Lululemon",
  "Uniqlo",
  "Madewell",
  "Patagonia",
  "COS",
  "Everlane",
  "Gap",
  "ASOS",
  "Puma",
  "Reebok",
  "New Balance",
  "ASICS",
  "On",
  "Salomon",
  "Dior",
  "Hermès",
];

export type BrandStepProps = {
  min?: number;
  max?: number;
  onFinish: (brands: string[]) => void;
};

type Slot = { id: number; brand: string; wave: number };

function staggerDelayForIndex(clicked: number, index: number): number {
  if (index === clicked) return 0;
  const cr = Math.floor(clicked / COLS);
  const cc = clicked % COLS;
  const others = Array.from({ length: SLOT_COUNT }, (_, i) => i)
    .filter((i) => i !== clicked)
    .sort(
      (a, b) =>
        Math.abs(Math.floor(a / COLS) - cr) +
        Math.abs((a % COLS) - cc) -
        (Math.abs(Math.floor(b / COLS) - cr) + Math.abs((b % COLS) - cc))
    );
  const rank = others.indexOf(index);
  return Math.max(0, rank) * 0.048;
}

function useResolvedImage(brand: string): string {
  const [url, setUrl] = useState(() => imageForBrand(brand));
  const cache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const fallback = imageForBrand(brand);
    setUrl(fallback);

    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;
    if (!key) return;

    const cached = cache.current.get(brand);
    if (cached) {
      setUrl(cached);
      return;
    }

    let cancelled = false;
    const ac = new AbortController();

    (async () => {
      try {
        const q = encodeURIComponent(`${brand} fashion clothing`);
        const res = await fetch(
          `https://api.unsplash.com/search/photos?per_page=1&orientation=squarish&query=${q}`,
          {
            headers: { Authorization: `Client-ID ${key}` },
            signal: ac.signal,
          }
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          results?: { urls?: { small?: string } }[];
        };
        const next = data.results?.[0]?.urls?.small;
        if (!cancelled && next) {
          cache.current.set(brand, next);
          setUrl(next);
        }
      } catch {
        /* keep fallback */
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [brand]);

  return url;
}

function BrandFace(props: {
  brand: string;
  stagger: number;
  selected: boolean;
}) {
  const { brand, stagger, selected } = props;
  const img = useResolvedImage(brand);

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-lg bg-[#F5F5F5] shadow-sm ring-1 ring-black/[0.06]"
      initial={{ rotateY: 92, opacity: 0, scale: 0.94 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: -88, opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.52,
        delay: stagger,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      <div className="relative h-full min-h-0 overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover transition duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/45"
          aria-hidden
        />
        <span
          className="absolute inset-0 flex items-center justify-center px-1.5 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-[11px]"
          title={brand}
        >
          {brand}
        </span>
        {selected && (
          <span
            className="pointer-events-none absolute inset-0 rounded-lg ring-[3px] ring-white ring-offset-0"
            aria-hidden
          />
        )}
      </div>
    </motion.div>
  );
}

export function BrandStep(props: BrandStepProps) {
  const { min = 3, max = 10, onFinish } = props;

  const [slots, setSlots] = useState<Slot[]>(() =>
    INITIAL_GRID.map((brand, id) => ({
      id,
      brand,
      wave: 0,
    }))
  );
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [lastAnchor, setLastAnchor] = useState<number | null>(null);

  const q = query.trim().toLowerCase();

  const filteredSlots = useMemo(() => {
    if (!q) return slots;
    return slots.map((s) => ({
      ...s,
      _hidden: !s.brand.toLowerCase().includes(q),
    })) as (Slot & { _hidden?: boolean })[];
  }, [slots, q]);

  const n = selected.size;
  const canFinish = n >= min && n <= max;

  const refreshAround = useCallback(
    (anchorIndex: number, seedBrand: string) => {
      setLastAnchor(anchorIndex);
      setSlots((prev) => {
        const exclude = new Set<string>();
        prev.forEach((s, i) => {
          if (i !== anchorIndex) exclude.add(s.brand);
        });
        exclude.add(seedBrand);

        const similar = similarPool(seedBrand);
        const diverse = diversePool(seedBrand, similar);
        const need = SLOT_COUNT - 1;
        // 70% related + 30% diverse — see pickMixedBrands docs for rationale.
        const picked = pickMixedBrands({
          count: need,
          similar,
          diverse,
          exclude,
          fallback: FALLBACK_BRANDS,
          similarRatio: 0.7,
        });

        let k = 0;
        return prev.map((slot, i) => {
          if (i === anchorIndex) return { ...slot, wave: slot.wave };
          const nextBrand = picked[k] ?? FALLBACK_BRANDS[k % FALLBACK_BRANDS.length];
          k += 1;
          return { ...slot, brand: nextBrand, wave: slot.wave + 1 };
        });
      });
    },
    []
  );

  const onTileActivate = useCallback(
    (index: number) => {
      const brand = slots[index]?.brand;
      if (!brand) return;

      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(brand)) next.delete(brand);
        else if (next.size < max) next.add(brand);
        return next;
      });

      refreshAround(index, brand);
    },
    [slots, refreshAround, max]
  );

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label="Brand selection"
    >
      <h1 className="mt-4 font-display text-[1.6rem] font-bold leading-snug tracking-tight text-ink md:text-[1.8rem]">
        Tell us which brands you love.
      </h1>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
        Pick {min}–{max} brands • {n} selected
      </p>

      <label className="group relative mt-8 block">
        <span className="sr-only">Search brands</span>
        <svg
          className="pointer-events-none absolute bottom-[7px] left-0 h-3.5 w-3.5 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input
          type="search"
          autoComplete="off"
          placeholder="Search brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-0 border-b border-neutral-200 bg-transparent py-2 pl-7 text-[13px] text-ink placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0"
        />
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-neutral-200 transition-colors group-focus-within:bg-neutral-900"
          aria-hidden
        />
      </label>

      <div className="relative mt-6 min-h-0 flex-1">
        <motion.div
          layout
          className="grid grid-cols-4 gap-3 pb-36"
          role="list"
          style={{ perspective: 1200 }}
        >
          {filteredSlots.map((slot, index) => {
            const hidden = "_hidden" in slot && slot._hidden;
            const stagger =
              lastAnchor === null ? 0 : staggerDelayForIndex(lastAnchor, index);

            return (
              <motion.div
                key={slot.id}
                layout
                role="listitem"
                className="aspect-square"
                initial={false}
                animate={{
                  opacity: hidden ? 0 : 1,
                  scale: hidden ? 0.96 : 1,
                  filter: hidden ? "blur(2px)" : "blur(0px)",
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ pointerEvents: hidden ? "none" : "auto" }}
              >
                <button
                  type="button"
                  aria-pressed={selected.has(slot.brand)}
                  disabled={Boolean(hidden)}
                  onClick={() => onTileActivate(index)}
                  className="relative h-full w-full text-left outline-none transition-transform active:scale-[0.98] disabled:pointer-events-none"
                >
                  <div
                    className="h-full w-full [perspective:1000px]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <BrandFace
                        key={`${slot.id}-${slot.brand}-${slot.wave}`}
                        brand={slot.brand}
                        stagger={stagger}
                        selected={selected.has(slot.brand)}
                      />
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div
        className="fixed left-0 right-0 z-[90] bg-gradient-to-t from-paper via-paper to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10"
        style={{ bottom: "var(--dev-nav-h, 0px)" }}
      >
        <button
          type="button"
          disabled={!canFinish}
          onClick={() => onFinish([...selected])}
          className={`w-full rounded-sm py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition-colors ${
            canFinish ? "bg-finish hover:bg-finish/90" : "bg-finish-muted"
          }`}
        >
          Finish
        </button>
      </div>
    </section>
  );
}
