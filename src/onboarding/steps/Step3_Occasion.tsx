import { motion } from "framer-motion";
import { ONBOARDING_CONTINUE_BUTTON_CLASS } from "../components/continueCta";
import { useOnboarding } from "../OnboardingContext";
import { useSearchListings } from "../hooks/useSearchListings";

const OCCASION_CHIPS: { label: string; query: string; className: string }[] = [
  {
    label: "Halloween",
    query: "Halloween costume party",
    className:
      "border-orange-400/50 bg-gradient-to-br from-orange-500 via-amber-600 to-violet-700 text-white shadow-md shadow-orange-900/20",
  },
  {
    label: "Summer Holiday",
    query: "summer holiday beach resort",
    className:
      "border-cyan-400/40 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-500 text-white shadow-md shadow-cyan-900/15",
  },
  {
    label: "Wedding Party",
    query: "wedding party guest dress",
    className:
      "border-rose-300/50 bg-gradient-to-br from-rose-300 via-fuchsia-400 to-pink-600 text-white shadow-md shadow-rose-900/20",
  },
  {
    label: "Office",
    query: "office work meeting blazer",
    className:
      "border-slate-400/40 bg-gradient-to-br from-slate-500 via-slate-600 to-zinc-800 text-white shadow-md shadow-black/20",
  },
  {
    label: "Date Night",
    query: "date night dinner outfit",
    className:
      "border-red-400/30 bg-gradient-to-br from-red-500 via-rose-600 to-purple-900 text-white shadow-md shadow-red-950/25",
  },
  {
    label: "Festival",
    query: "festival concert outfit",
    className:
      "border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 text-white shadow-md shadow-purple-950/25",
  },
  {
    label: "Ski Trip",
    query: "ski trip winter layers",
    className:
      "border-sky-300/40 bg-gradient-to-br from-sky-200 via-blue-500 to-indigo-800 text-white shadow-md shadow-blue-950/20",
  },
  {
    label: "Brunch",
    query: "brunch weekend casual chic",
    className:
      "border-amber-300/40 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-800 text-white shadow-md shadow-amber-900/20",
  },
];

export function Step3_Occasion() {
  const { state, patch, goNext } = useOnboarding();
  const q = state.occasionSearchQuery;
  const { listings, loading } = useSearchListings({
    query: q,
    gender: state.gender,
    ageRange: state.ageRange,
    debounceMs: 350,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-28 pt-2">
      <header className="shrink-0">
        <h1 className="font-display text-[1.4rem] font-bold leading-[1.2] text-ink">
          What&apos;s the moment?
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
          Listings that match appear as you type — discovery first, no yes/no grid.
        </p>
        <motion.input
          layout
          type="search"
          value={q}
          onChange={(e) => patch({ occasionSearchQuery: e.target.value })}
          placeholder="e.g. beach wedding, office, date night…"
          className="mt-5 w-full rounded-2xl border border-neutral-200 bg-paper px-4 py-3.5 text-[15px] text-ink shadow-sm outline-none placeholder:text-neutral-400 ring-0 transition-shadow focus:border-neutral-400 focus:shadow-md dark:border-neutral-300 dark:bg-neutral-100 dark:text-ink"
        />
      </header>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Popular occasions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {OCCASION_CHIPS.map((c, i) => (
            <motion.button
              key={c.label}
              type="button"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i, duration: 0.22 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => patch({ occasionSearchQuery: c.query })}
              className={`rounded-full border px-4 py-2.5 text-left text-[13px] font-bold tracking-tight ${c.className}`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>
      </div>

      {loading && q.trim().length >= 2 ? (
        <p className="mt-4 text-center text-[12px] text-muted">Searching closets…</p>
      ) : null}

      {listings.length > 0 && q.trim().length >= 2 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">On Poshmark now</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {listings.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="w-[112px] shrink-0 overflow-hidden rounded-xl border border-line bg-paper shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="aspect-[4/5] w-full">
                  <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="truncate px-2 py-1 text-[9px] font-semibold text-muted">{l.brand}</p>
                <p className="line-clamp-2 px-2 pb-2 text-[10px] font-medium leading-tight text-ink">
                  {l.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

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
