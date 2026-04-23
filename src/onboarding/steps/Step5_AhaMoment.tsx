import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";

export function Step5_AhaMoment() {
  const { goNext } = useOnboarding();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const c = animate(0, 80_000_000, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => c.stop();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => goNext(), 2800);
    return () => window.clearTimeout(t);
  }, [goNext]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#f5f5f7] px-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="text-center font-[system-ui] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400"
      >
        Inventory scan
      </motion.p>
      <motion.p
        layout
        className="mt-4 text-center font-[system-ui] text-[1.65rem] font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-[1.85rem]"
      >
        Searching {count.toLocaleString()}+ items for you…
      </motion.p>
      <p className="mt-4 max-w-[18rem] text-center text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Live index — tuned to your categories, occasion, and brands.
      </p>
      <motion.div
        className="mt-14 h-px w-24 origin-left bg-neutral-300 dark:bg-neutral-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
}
