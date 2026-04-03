import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategorySelectionPayload } from "./types/onboarding";

export type { CategorySelectionPayload } from "./types/onboarding";

type SizeKind = "apparel" | "footwear";

type DeptRow = {
  id: string;
  label: string;
  sizeKind: SizeKind | null;
};

const DEPARTMENT_ROWS: DeptRow[] = [
  { id: "mens-apparel", label: "Men's apparel", sizeKind: "apparel" },
  { id: "womens-apparel", label: "Women's apparel", sizeKind: "apparel" },
  { id: "mens-shoes", label: "Men's shoes", sizeKind: "footwear" },
  { id: "womens-shoes", label: "Women's shoes", sizeKind: "footwear" },
  { id: "luxury", label: "Luxury", sizeKind: null },
  { id: "beauty", label: "Beauty", sizeKind: null },
  { id: "kids", label: "Kids", sizeKind: null },
  { id: "home", label: "Home", sizeKind: null },
];

const APPAREL_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"] as const;
const FOOTWEAR_SIZES = [
  "US 5",
  "US 6",
  "US 7",
  "US 8",
  "US 9",
  "US 10",
  "US 11",
  "US 12",
] as const;

type DrawerTarget = { row: DeptRow } | null;

export type CategoryStepProps = {
  onContinue: (data: CategorySelectionPayload) => void;
};

export function CategoryStep({ onContinue }: CategoryStepProps) {
  /** Selected department ids -> optional size */
  const [deptSelections, setDeptSelections] = useState<
    Map<string, { size?: string }>
  >(() => new Map());
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [drawer, setDrawer] = useState<DrawerTarget>(null);
  const [draftSize, setDraftSize] = useState<string | null>(null);

  const openDrawer = useCallback((row: DeptRow) => {
    if (!row.sizeKind) return;
    const existing = deptSelections.get(row.id);
    setDraftSize(existing?.size ?? null);
    setDrawer({ row });
  }, [deptSelections]);

  const closeDrawer = useCallback(() => {
    setDrawer(null);
    setDraftSize(null);
  }, []);

  const saveDrawer = useCallback(() => {
    if (!drawer?.row.sizeKind || !draftSize) return;
    const { row } = drawer;
    setDeptSelections((prev) => {
      const next = new Map(prev);
      next.set(row.id, { size: draftSize });
      return next;
    });
    closeDrawer();
  }, [drawer, draftSize, closeDrawer]);

  const toggleSimpleDept = useCallback((row: DeptRow) => {
    setDeptSelections((prev) => {
      const next = new Map(prev);
      if (next.has(row.id)) next.delete(row.id);
      else next.set(row.id, {});
      return next;
    });
  }, []);

  const removeDept = useCallback((id: string) => {
    setDeptSelections((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const addKeyword = useCallback(() => {
    const t = searchDraft.trim();
    if (!t) return;
    setKeywords((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setSearchDraft("");
  }, [searchDraft]);

  const removeKeyword = useCallback((k: string) => {
    setKeywords((prev) => prev.filter((x) => x !== k));
  }, []);

  const onSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addKeyword();
      }
    },
    [addKeyword]
  );

  const selectionCount = useMemo(() => {
    return deptSelections.size + keywords.length;
  }, [deptSelections, keywords]);

  const canContinue = selectionCount >= 1;

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    const departments: CategorySelectionPayload["departments"] = [];
    deptSelections.forEach((meta, id) => {
      const row = DEPARTMENT_ROWS.find((r) => r.id === id);
      if (!row) return;
      departments.push({
        label: row.label,
        ...(meta.size ? { size: meta.size } : {}),
      });
    });
    onContinue({ departments, searchKeywords: [...keywords] });
  }, [canContinue, deptSelections, keywords, onContinue]);

  const sizes =
    drawer?.row.sizeKind === "apparel"
      ? APPAREL_SIZES
      : drawer?.row.sizeKind === "footwear"
        ? FOOTWEAR_SIZES
        : [];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-28">
      <h1 className="mt-6 font-display text-[1.65rem] font-bold leading-snug tracking-tight text-ink md:text-[1.85rem]">
        What brings you to Poshmark?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Select categories and sizes. Add anything specific you&apos;re hunting
        for — we won&apos;t auto-suggest departments.
      </p>

      {/* Search: dedicated mode — no department autocomplete */}
      <div className="relative z-20 mt-8">
        {!searchMode ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSearchMode(true)}
              className="relative z-10 flex w-full items-center gap-3 rounded-xl border border-line bg-paper py-3.5 pl-4 pr-3 text-left transition-colors hover:border-neutral-300 active:bg-neutral-50"
            >
              <svg
                className="h-4 w-4 shrink-0 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
              <span className="text-[15px] text-neutral-500">
                Looking for a specific item?
              </span>
            </button>
            {keywords.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Saved keywords">
                {keywords.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeKeyword(k);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-ink"
                    >
                      {k}
                      <span className="text-neutral-400" aria-hidden>
                        ×
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setSearchMode(true)}
                    className="text-[12px] font-semibold text-muted underline underline-offset-2"
                  >
                    Edit
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-ink bg-paper p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Search keywords</span>
                <input
                  autoFocus
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="e.g. vintage denim jacket"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  className="w-full border-0 border-b border-line bg-transparent py-2 text-[15px] text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-0"
                />
              </label>
              <button
                type="button"
                onClick={addKeyword}
                className="shrink-0 rounded-lg bg-ink px-3 py-2 text-[13px] font-semibold text-paper"
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Type freely — we don&apos;t suggest categories here.
            </p>
            <button
              type="button"
              onClick={() => setSearchMode(false)}
              className="mt-3 text-[12px] font-semibold text-muted underline underline-offset-2"
            >
              Close search
            </button>
            {keywords.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Your keywords">
                {keywords.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-neutral-400"
                    >
                      {k}
                      <span className="text-neutral-400" aria-hidden>
                        ×
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <p className="mb-3 mt-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        Departments
      </p>
      <ul className="relative z-10 divide-y divide-line border-t border-line" role="list">
        {DEPARTMENT_ROWS.map((row) => {
          const sel = deptSelections.get(row.id);
          const isOn = Boolean(sel);
          return (
            <li key={row.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isOn}
                onClick={() => {
                  if (row.sizeKind) openDrawer(row);
                  else toggleSimpleDept(row);
                }}
                className={`flex min-h-[52px] w-full items-center justify-between gap-3 py-4 pl-1 pr-2 text-left text-[15px] font-medium transition-colors ${
                  isOn
                    ? "bg-neutral-50 text-ink ring-1 ring-inset ring-ink/15"
                    : "text-ink hover:bg-neutral-50/80"
                }`}
              >
                <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <span>{row.label}</span>
                  {isOn && row.sizeKind && sel?.size && (
                    <span className="text-[11px] font-normal text-muted">
                      My size: {sel.size}
                    </span>
                  )}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] ${
                    isOn
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-neutral-400"
                  }`}
                  aria-hidden
                >
                  {isOn ? "✓" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Sticky Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            key="category-continue-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed bottom-0 left-0 right-0 z-[100] flex justify-center px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6"
          >
            <div className="pointer-events-auto w-full max-w-[420px] bg-gradient-to-t from-paper via-paper to-transparent">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full rounded-lg bg-ink py-4 text-[15px] font-semibold text-paper shadow-lg shadow-black/10"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size drawer */}
      <AnimatePresence mode="sync">
        {drawer && (
          <>
            <motion.div
              key="category-size-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] cursor-default bg-black/35 backdrop-blur-[1px]"
              onClick={closeDrawer}
            />
            <motion.div
              key="category-size-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-sheet-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 360 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-[120] mx-auto max-h-[85vh] w-full max-w-[420px] overflow-hidden rounded-t-2xl bg-paper shadow-2xl"
            >
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line" />
              <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 pb-8 pt-4">
                <h2
                  id="size-sheet-title"
                  className="font-display text-xl font-bold text-ink"
                >
                  My size
                </h2>
                <p className="mt-1 text-[13px] text-muted">{drawer.row.label}</p>

                <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {drawer.row.sizeKind === "apparel" ? "Apparel" : "Shoes"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDraftSize(s)}
                      className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                        draftSize === s
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-paper text-ink hover:border-neutral-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex-1 rounded-lg border border-line py-3.5 text-[15px] font-semibold text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!draftSize}
                    onClick={saveDrawer}
                    className="flex-1 rounded-lg bg-ink py-3.5 text-[15px] font-semibold text-paper disabled:opacity-35"
                  >
                    Save
                  </button>
                </div>
                {deptSelections.has(drawer.row.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      removeDept(drawer.row.id);
                      closeDrawer();
                    }}
                    className="mt-5 w-full py-2 text-[13px] font-semibold text-red-600/90"
                  >
                    Remove from selection
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
