import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_IMAGE, diversePool, imageForBrand, similarPool } from "../../brandAssets";
import { BrandChip } from "../components/BrandChip";
import { ONBOARDING_CONTINUE_BUTTON_CLASS } from "../components/continueCta";
import { useOnboarding } from "../OnboardingContext";
import { useBrandSearch, type BrandHit } from "../hooks/useBrandSearch";

const CURATED: string[] = ["Nike", "Zara", "Madewell", "Coach", "Uniqlo", "Reformation"];

function wideDiscovery(seed: string, exclude: Set<string>, take = 8): BrandHit[] {
  const sim = similarPool(seed);
  const div = diversePool(seed, sim);
  const pool = [...div, ...sim, ...Object.keys(BRAND_IMAGE).filter((k) => k !== "default")];
  const out: BrandHit[] = [];
  for (const name of pool) {
    if (exclude.has(name)) continue;
    exclude.add(name);
    out.push({ id: name, name, logoUrl: imageForBrand(name) });
    if (out.length >= take) break;
  }
  return out;
}

export function Step4_Brand() {
  const { state, patch, goNext } = useOnboarding();
  const [q, setQ] = useState("");
  const { hits } = useBrandSearch(q);

  const exclude = useMemo(() => new Set(state.selectedBrands.map((b) => b)), [state.selectedBrands]);

  const discoveryWide = useMemo(() => {
    const seed = state.selectedBrands[0] ?? hits[0]?.name ?? "Nike";
    const ex = new Set(exclude);
    hits.forEach((h) => ex.add(h.name));
    return wideDiscovery(seed, ex, 10);
  }, [state.selectedBrands, hits, exclude]);

  const add = (name: string) => {
    if (state.selectedBrands.includes(name)) return;
    patch({
      selectedBrands: [...state.selectedBrands, name],
      searchedBrand: state.searchedBrand ?? name,
    });
    setQ("");
  };

  const remove = (name: string) => {
    patch({ selectedBrands: state.selectedBrands.filter((b) => b !== name) });
  };

  const showSearch = q.trim().length >= 2;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-28 pt-2">
      <header className="shrink-0">
        <h1 className="font-display text-[1.4rem] font-bold leading-[1.2] text-ink">
          Brands you reach for
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
          Start from favorites — search opens up lower-key labels you might love.
        </p>
        <motion.input
          layout
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brands…"
          className="mt-5 w-full rounded-2xl border border-neutral-200 bg-paper px-4 py-3.5 text-[15px] text-ink shadow-sm outline-none placeholder:text-neutral-400 ring-0 transition-shadow focus:border-neutral-400 focus:shadow-md dark:border-neutral-300 dark:bg-neutral-100 dark:text-ink"
        />
      </header>

      {state.selectedBrands.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {state.selectedBrands.map((b) => (
            <BrandChip key={b} name={b} onRemove={() => remove(b)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showSearch && hits.length > 0 && (
          <motion.div
            key="hits"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Matches</p>
            <ul className="mt-1 overflow-hidden rounded-2xl border border-line bg-paper dark:border-neutral-700 dark:bg-neutral-900">
              {hits.slice(0, 5).map((h) => (
                <li key={h.id} className="border-b border-line last:border-0 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => add(h.name)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <img src={h.logoUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <span className="text-[14px] font-semibold text-ink">
                      {h.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-posh-burgundy">
            Might be new to you
          </p>
          <p className="text-[12px] text-muted">Lower radar picks — widen the discovery net.</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {discoveryWide.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => add(b.name)}
                className="w-[108px] shrink-0 overflow-hidden rounded-xl border border-line bg-paper text-left shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="relative aspect-square w-full">
                  <img src={b.logoUrl} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-2 pb-2 pt-7">
                    <p className="truncate text-center text-[11px] font-bold leading-tight text-white drop-shadow-sm">
                      {b.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Popular on Poshmark
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {CURATED.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => add(name)}
              className="overflow-hidden rounded-xl border border-line bg-paper text-left shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="relative aspect-square w-full">
                <img src={imageForBrand(name)} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-1.5 pb-1.5 pt-6">
                  <p className="truncate text-center text-[10px] font-bold leading-tight text-white drop-shadow-sm">
                    {name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={goNext}
          className={ONBOARDING_CONTINUE_BUTTON_CLASS}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
