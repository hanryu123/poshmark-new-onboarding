import { motion } from "framer-motion";

type Step0LandingProps = {
  onStart: () => void;
};

const HERO_SRC = "/onboarding-landing-hero.png";
const HERO_W = 538;
const HERO_H = 764;

export function Step0_Landing({ onStart }: Step0LandingProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-neutral-950">
      <img
        src={HERO_SRC}
        alt=""
        width={HERO_W}
        height={HERO_H}
        decoding="sync"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[center_22%] [image-rendering:auto] [transform:translateZ(0)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none max-w-[20rem] text-center"
          >
            <p className="font-display text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
              The resale marketplace built for discovery.
            </p>
            <p className="mt-3 text-[15px] font-medium leading-snug text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.5)]">
              Millions of listings—from closets like yours. Find brands you love at prices that make
              sense.
            </p>
          </motion.div>
        </div>

        <div className="shrink-0 px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom,0px))+var(--dev-nav-h,0px))] pt-2">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            onClick={onStart}
            className="w-full rounded-2xl border border-white/25 bg-white/12 py-4 text-center font-display text-[1.05rem] font-semibold uppercase tracking-[0.08em] text-paper shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[transform,background-color] active:scale-[0.99] active:bg-white/18 supports-[backdrop-filter]:bg-white/10"
          >
            Start Poshmark
          </motion.button>
        </div>
      </div>
    </div>
  );
}
