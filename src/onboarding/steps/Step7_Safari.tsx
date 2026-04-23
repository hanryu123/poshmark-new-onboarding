import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";

const INSTALL_STEPS = [
  { n: 1, title: "Open Settings", body: "On iPhone: Settings → Safari → Extensions." },
  { n: 2, title: "Find Poshmark", body: "Tap the Poshmark extension, then turn it on." },
  { n: 3, title: "Allow on sites", body: "Grant access so we can surface resale prices while you browse." },
];

export function Step7_Safari() {
  const { patch, completeToFeed } = useOnboarding();
  const [tipOpen, setTipOpen] = useState(true);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowBadge(true), 500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f1ec] px-4 pb-28 pt-4 text-ink dark:bg-[#1a1412] dark:text-[#f4f1ec]">
      <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-[#d4cec4] bg-[#faf8f5] shadow-lg dark:border-neutral-700 dark:bg-[#252019]">
        <div className="flex items-center gap-1 border-b border-[#e5dfd4] bg-[#ebe6dd] px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900">
          <span className="h-2 w-2 rounded-full bg-[#c94c4c]" />
          <span className="h-2 w-2 rounded-full bg-[#c9a227]" />
          <span className="h-2 w-2 rounded-full bg-[#4a8f4a]" />
          <span className="ml-2 flex-1 truncate rounded bg-white/90 px-2 py-0.5 text-[9px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            shop.example.com
          </span>
        </div>
        <div className="relative h-44 bg-gradient-to-b from-white to-[#f0ebe3] p-3 text-left dark:from-neutral-900 dark:to-neutral-950">
          <p className="text-[10px] font-semibold text-neutral-500">Product</p>
          <p className="mt-1 text-[13px] font-bold text-posh-burgundy dark:text-[#c98ba3]">Wool coat</p>
          <p className="text-[11px] text-muted">Retail $298</p>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="absolute bottom-3 right-3 max-w-[10.5rem] rounded-xl border border-posh-burgundy/25 bg-white px-2.5 py-2 shadow-xl dark:border-[#821E3F]/50 dark:bg-[#2a2220]"
            >
              <p className="text-[9px] font-bold uppercase tracking-wide text-posh-burgundy dark:text-[#e8b4c8]">
                Poshmark
              </p>
              <p className="text-[10px] font-semibold leading-snug text-ink dark:text-neutral-100">
                Same style from $89 on Poshmark
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <h1 className="mt-7 font-display text-[1.4rem] font-bold leading-snug text-posh-burgundy dark:text-[#e8c4d4]">
        Stop overpaying.
      </h1>
      <p className="mt-2 max-w-[22rem] text-[14px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        Poshmark finds the best deals for you while you shop on other sites — resale prices surfaced
        right on the product page.
      </p>

      <div className="mt-6 rounded-2xl border border-[#d4cec4] bg-white/90 p-4 dark:border-neutral-700 dark:bg-neutral-900/90">
        <button
          type="button"
          onClick={() => setTipOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[12px] font-bold uppercase tracking-wide text-posh-burgundy dark:text-[#d4a5b8]">
            How to turn it on
          </span>
          <span className="text-muted">{tipOpen ? "−" : "+"}</span>
        </button>
        {tipOpen && (
          <ol className="mt-4 space-y-3">
            {INSTALL_STEPS.map((s) => (
              <li key={s.n} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-posh-burgundy text-[11px] font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink dark:text-neutral-100">{s.title}</p>
                  <p className="text-[12px] leading-snug text-muted dark:text-neutral-400">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-auto space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => {
            patch({ extensionInstalled: true });
            window.setTimeout(() => completeToFeed(), 400);
          }}
          className="w-full rounded-xl bg-posh-burgundy py-4 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md ring-1 ring-black/5 dark:ring-white/10"
        >
          Add to Safari
        </button>
        <button
          type="button"
          onClick={() => {
            patch({ extensionInstalled: false });
            completeToFeed();
          }}
          className="w-full py-3 text-[14px] font-semibold uppercase tracking-wide text-neutral-600 underline underline-offset-2 dark:text-neutral-400"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
