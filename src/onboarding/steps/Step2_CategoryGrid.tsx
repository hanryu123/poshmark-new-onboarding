import { AnimatePresence, motion } from "framer-motion";
import { SizeSelector } from "../components/SizeSelector";
import { DEPARTMENT_ORDER, SIZES_BY_DEPARTMENT } from "../departmentSizes";
import { useSearchListings } from "../hooks/useSearchListings";
import { ONBOARDING_CONTINUE_BUTTON_CLASS } from "../components/continueCta";
import { useOnboarding } from "../OnboardingContext";
import type { Department } from "../types/onboarding.types";

const TILE: Record<Department, { short: string; line: string }> = {
  "Women's Apparel": { short: "Women", line: "Apparel" },
  "Men's Apparel": { short: "Men", line: "Apparel" },
  "Women's Shoes": { short: "Women", line: "Shoes" },
  "Men's Shoes": { short: "Men", line: "Shoes" },
  Luxury: { short: "Luxury", line: "Bags & more" },
  Beauty: { short: "Beauty", line: "Care & makeup" },
  Kids: { short: "Kids", line: "All ages" },
  Home: { short: "Home", line: "Decor & life" },
};

export function Step2_CategoryGrid() {
  const { state, patch, goNext } = useOnboarding();
  const q = state.categorySearchQuery;
  const { listings, loading } = useSearchListings({
    query: q,
    gender: state.gender,
    ageRange: state.ageRange,
    debounceMs: 350,
  });

  const toggle = (d: Department) => {
    const set = new Set(state.selectedDepartments);
    if (set.has(d)) {
      set.delete(d);
      const sz = { ...state.sizes };
      delete sz[d];
      patch({ selectedDepartments: [...set], sizes: sz });
    } else {
      patch({ selectedDepartments: [...set, d] });
    }
  };

  const setSize = (d: Department, size: string) => {
    patch({ sizes: { ...state.sizes, [d]: size } });
  };

  const primary = state.selectedDepartments[state.selectedDepartments.length - 1] ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-28 pt-2">
      <header className="shrink-0">
        <h1 className="font-display text-[1.4rem] font-bold leading-[1.2] text-ink">
          What do you like to shop?
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
          Tap categories — see picks & sizes in one place.
        </p>
        <motion.input
          layout
          type="search"
          value={q}
          onChange={(e) => patch({ categorySearchQuery: e.target.value })}
          placeholder="Brands, styles, or categories…"
          className="mt-5 w-full rounded-2xl border border-neutral-200 bg-paper px-4 py-3.5 text-[15px] text-ink shadow-sm outline-none placeholder:text-neutral-400 transition-shadow focus:border-neutral-400 focus:shadow-md dark:border-neutral-300 dark:bg-neutral-100 dark:text-ink"
        />
      </header>
      {loading && q.trim().length >= 2 ? (
        <p className="mt-2 text-[12px] text-muted">Searching…</p>
      ) : null}
      {listings.length > 0 && q.trim().length >= 2 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {listings.slice(0, 8).map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i }}
              className="w-[100px] shrink-0 overflow-hidden rounded-xl border border-line bg-paper shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="aspect-[4/5] w-full">
                <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="truncate px-1.5 py-1 text-[9px] font-semibold text-ink">
                {l.brand}
              </p>
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {DEPARTMENT_ORDER.map((d, i) => {
          const on = state.selectedDepartments.includes(d);
          const t = TILE[d];
          return (
            <motion.button
              key={d}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.2 }}
              onClick={() => toggle(d)}
              className={`relative flex aspect-[4/5] flex-col justify-end rounded-2xl border bg-neutral-100 p-3 text-left transition-colors dark:bg-neutral-800/80 ${
                on
                  ? "border-ink bg-neutral-200 ring-2 ring-ink ring-offset-2 ring-offset-paper dark:border-neutral-100 dark:bg-neutral-700 dark:ring-offset-neutral-950"
                  : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                {t.short}
              </span>
              <span className="mt-0.5 text-[12px] font-bold leading-tight text-ink">
                {t.line}
              </span>
              {on ? (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper text-xs font-bold text-ink shadow-sm dark:border-neutral-600 dark:bg-neutral-100 dark:text-ink">
                  ✓
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {primary ? (
          <motion.div
            key={primary}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-5 overflow-hidden rounded-2xl border border-line bg-neutral-50/90 p-4 dark:border-neutral-700 dark:bg-neutral-900/50"
          >
            {SIZES_BY_DEPARTMENT[primary] ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                  Your size in {primary}
                </p>
                <div className="mt-3">
                  <SizeSelector
                    sizes={SIZES_BY_DEPARTMENT[primary]!}
                    value={state.sizes[primary]}
                    onChange={(s) => setSize(primary, s)}
                  />
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-neutral-600">No size chart for this category.</p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

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
