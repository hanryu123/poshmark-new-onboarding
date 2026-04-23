import { motion } from "framer-motion";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1 w-full overflow-hidden bg-line">
      <motion.div
        className="h-full bg-posh-pink"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
      />
    </div>
  );
}
