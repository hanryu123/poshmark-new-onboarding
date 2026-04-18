import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const TOTAL_MS = 10_000;
const TARGET_COUNT = 13_123_123;

const STAGES: { from: number; to: number; text: string }[] = [
  { from: 0, to: 3000, text: "Analyzing your preferences..." },
  { from: 3000, to: 7000, text: "Finding pieces you'll love..." },
  { from: 7000, to: 10_000, text: "Here's everything we matched for you." },
];

export type InventoryAnalysisLoaderProps = {
  onComplete: () => void;
};

/**
 * Two-phase Aha-moment screen:
 *   1) "loading"  — bar fills 0→100% over 10s, count climbs to 13,123,123, message rotates
 *   2) "revealed" — bar/messages fade out, the giant final number lands, and the user is
 *                   invited to commit with [Start Poshmark]. We hand control back here so
 *                   the reveal isn't snatched away by an auto-advance.
 */
export function InventoryAnalysisLoader({ onComplete }: InventoryAnalysisLoaderProps) {
  const progress = useMotionValue(0);
  const count = useTransform(progress, (p) => Math.floor(p * TARGET_COUNT));
  // Hook calls MUST stay at the top level — never inside conditional/AnimatePresence
  // children, otherwise unmounting the bar would change the hook count and crash render.
  const barWidth = useTransform(progress, (p) => `${p * 100}%`);

  const [displayCount, setDisplayCount] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealed">("loading");

  // Single source of truth: drive bar + count from one motion value so they stay in sync.
  useEffect(() => {
    const startedAt = performance.now();
    const controls = animate(progress, 1, {
      duration: TOTAL_MS / 1000,
      ease: "easeInOut",
      onComplete: () => setPhase("revealed"),
    });

    const stageTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const idx = STAGES.findIndex((s) => elapsed >= s.from && elapsed < s.to);
      setStageIdx(idx === -1 ? STAGES.length - 1 : idx);
    }, 120);

    const unsub = count.on("change", (v) => setDisplayCount(v));

    return () => {
      controls.stop();
      window.clearInterval(stageTimer);
      unsub();
    };
  }, [count, progress]);

  return (
    <motion.div
      key="inventory-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-paper px-6 text-ink"
    >
      {/* very subtle vignette so the white doesn't feel flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, #FFFFFF 0%, #FAFAFA 60%, #F2F2F2 100%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[340px] flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted"
        >
          Poshmark Inventory
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: phase === "revealed" ? 1.06 : 1,
          }}
          transition={{
            opacity: { delay: 0.2, duration: 0.6 },
            scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="font-display text-[52px] font-bold leading-none tracking-tight tabular-nums text-ink"
          aria-live="polite"
        >
          {displayCount.toLocaleString()}
        </motion.div>
        <p className="mt-1 text-[12px] text-muted">items being matched for you</p>

        {/* Loading bar — always mounted, fades out on reveal so the hook tree never changes. */}
        <div className="relative mt-8 h-[6px] w-full">
          <motion.div
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 overflow-hidden rounded-full bg-line"
          >
            <motion.div
              className="h-full rounded-full bg-ink"
              style={{ width: barWidth }}
            />
          </motion.div>
        </div>

        {/* Rotating in-progress message — also always mounted; fades out on reveal */}
        <div className="relative mt-6 h-[44px] w-full">
          <motion.div
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={`msg-${stageIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center text-[14px] font-medium text-ink/80"
              >
                {STAGES[stageIdx]?.text}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Reveal headline replaces the loading message in the same vertical slot */}
          <motion.p
            initial={false}
            animate={{
              opacity: phase === "revealed" ? 1 : 0,
              y: phase === "revealed" ? 0 : 8,
            }}
            transition={{ duration: 0.45, ease: "easeOut", delay: phase === "revealed" ? 0.15 : 0 }}
            className="absolute inset-0 text-center text-[15px] font-medium text-ink"
          >
            Here&apos;s everything we matched for you.
          </motion.p>
        </div>

        {/* Reveal CTA — always mounted (so layout never jumps); fades/lifts in on reveal */}
        <motion.div
          initial={false}
          animate={{
            opacity: phase === "revealed" ? 1 : 0,
            y: phase === "revealed" ? 0 : 16,
            pointerEvents: phase === "revealed" ? "auto" : "none",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: phase === "revealed" ? 0.25 : 0 }}
          className="mt-6 w-full"
        >
          <p className="mb-5 text-center text-[13px] leading-relaxed text-muted">
            Curated from the world&apos;s largest closet. Ready when you are.
          </p>
          <button
            type="button"
            onClick={onComplete}
            disabled={phase !== "revealed"}
            className="w-full rounded-2xl bg-ink py-4 text-[15px] font-semibold text-paper transition-transform active:scale-[0.98]"
          >
            Start Poshmark
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
