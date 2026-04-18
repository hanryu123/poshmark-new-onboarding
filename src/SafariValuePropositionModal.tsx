import { motion } from "framer-motion";

export type SafariValuePropositionModalProps = {
  onEnable: () => void;
  onSkip: () => void;
};

/**
 * Apple-style sheet modal that proves Poshmark's value vs. retail
 * before asking the user to enable the Safari extension.
 * Mono palette (black / white / gray) to match the rest of onboarding.
 */
export function SafariValuePropositionModal({
  onEnable,
  onSkip,
}: SafariValuePropositionModalProps) {
  return (
    <motion.div
      key="safari-value-prop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center sm:pb-10"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px] overflow-hidden rounded-[28px] bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="safari-vp-title"
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-9 rounded-full bg-neutral-300" />
        </div>

        <div className="px-6 pb-6 pt-3">
          <h2
            id="safari-vp-title"
            className="text-center font-display text-[22px] font-bold leading-tight tracking-tight text-ink"
          >
            Never miss a deal on the web
          </h2>

          <DressComparison />

          <p className="mt-5 text-center text-[13.5px] leading-relaxed text-muted">
            Connect Safari and we&apos;ll surface the{" "}
            <span className="font-semibold text-ink">same or similar item</span>{" "}
            on Poshmark whenever you&apos;re shopping elsewhere. With our massive inventory,
            chances are we have it.
          </p>

          <div className="mt-6 flex flex-col gap-1">
            <button
              type="button"
              onClick={onEnable}
              className="w-full rounded-2xl bg-ink py-4 text-[15px] font-semibold text-paper transition-transform active:scale-[0.98]"
            >
              Enable Extension
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 text-[14px] font-medium text-muted transition-colors hover:text-ink"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DressComparison() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <PriceCard
        variant="light"
        eyebrow="Brand Site"
        host="brand.com"
        priceLabel="Retail Price"
        price="$100"
        strike
      />
      <PriceCard
        variant="dark"
        eyebrow="Poshmark"
        host="poshmark.com"
        priceLabel="Poshmark Value"
        price="$30"
        secondaryLabel="Similar Style"
        secondaryPrice="$25"
      />
    </div>
  );
}

type PriceCardProps = {
  variant: "light" | "dark";
  eyebrow: string;
  host: string;
  priceLabel: string;
  price: string;
  secondaryLabel?: string;
  secondaryPrice?: string;
  strike?: boolean;
};

function PriceCard({
  variant,
  eyebrow,
  host,
  priceLabel,
  price,
  secondaryLabel,
  secondaryPrice,
  strike,
}: PriceCardProps) {
  const dark = variant === "dark";
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border px-3 pb-3 pt-2 ${
        dark
          ? "border-ink bg-ink text-paper"
          : "border-line bg-neutral-50 text-ink"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${
            dark ? "text-paper" : "text-muted"
          }`}
        >
          {eyebrow}
        </span>
        <span
          className={`text-[10px] ${dark ? "text-paper/60" : "text-neutral-400"}`}
        >
          {host}
        </span>
      </div>

      <Dress dark={dark} className="mt-1" />

      <div className="mt-2 flex flex-col items-center">
        <span
          className={`text-[10px] uppercase tracking-wider ${
            dark ? "text-paper/70" : "text-muted"
          }`}
        >
          {priceLabel}
        </span>
        <span
          className={`font-display text-[22px] font-bold leading-none tabular-nums ${
            dark ? "text-paper" : "text-muted"
          } ${strike ? "line-through decoration-neutral-400 decoration-[1.5px]" : ""}`}
        >
          {price}
        </span>

        {secondaryLabel && secondaryPrice ? (
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-[10px] ${dark ? "text-paper/70" : "text-muted"}`}
            >
              {secondaryLabel}
            </span>
            <span
              className={`text-[13px] font-semibold tabular-nums ${
                dark ? "text-paper" : "text-ink"
              }`}
            >
              {secondaryPrice}
            </span>
          </div>
        ) : (
          <span className="mt-1 h-[14px]" />
        )}
      </div>
    </div>
  );
}

function Dress({ dark, className = "" }: { dark: boolean; className?: string }) {
  // Light card → dark dress; dark card → light dress. Same silhouette so the
  // viewer's eye snaps to the price difference, not the garment.
  const fill = dark ? "#FFFFFF" : "#1F1F1F";
  const highlight = dark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)";
  return (
    <svg
      viewBox="0 0 80 100"
      width="80"
      height="100"
      className={className}
      aria-hidden
    >
      <path
        d="M22 14 L40 6 L58 14 L66 26 L58 30 L52 22 L52 32 Q40 36 28 32 L28 22 L22 30 L14 26 Z"
        fill={fill}
      />
      <path
        d="M28 32 Q40 38 52 32 L70 92 Q40 100 10 92 Z"
        fill={fill}
        opacity="0.92"
      />
      <path
        d="M36 34 L34 90"
        stroke={highlight}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
