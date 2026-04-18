import { motion } from "framer-motion";

export type SafariExtensionSetupGuideProps = {
  onContinue: () => void;
  onSkip: () => void;
};

/**
 * Phia/Croissant-style Safari extension activation guide.
 * Mirrors iOS visual cues (address bar 'AA' menu, Manage Extensions row,
 * toggle switch) so users can rehearse the flow before doing it for real.
 */
export function SafariExtensionSetupGuide({
  onContinue,
  onSkip,
}: SafariExtensionSetupGuideProps) {
  return (
    <motion.section
      key="safari-setup-guide"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col"
      aria-label="Safari extension setup guide"
    >
      <header className="flex items-center justify-between pt-1">
        <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
          poshmark
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] font-semibold uppercase tracking-wide text-muted"
        >
          Skip
        </button>
      </header>

      {/* progress dots — Activate · Grant access (Phia-style) */}
      <div className="mt-6 flex items-center gap-3 text-[13px]">
        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
            1
          </span>
          <span className="font-medium text-ink">Activate Poshmark</span>
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[11px] font-semibold text-muted">
            2
          </span>
          <span className="text-muted">Grant access</span>
        </span>
      </div>

      <h1 className="mt-6 font-display text-[1.6rem] font-bold leading-tight tracking-tight text-ink">
        Enable the Poshmark Extension in Safari{" "}
        <span aria-hidden className="inline-block align-middle">
          <SafariBadge />
        </span>
      </h1>
      <p className="mt-1 text-[13.5px] text-muted">to start finding deals everywhere.</p>

      <ol className="mt-7 flex flex-col gap-5">
        <Step
          n={1}
          text={
            <>
              Tap <AddressBarIcon /> in the address bar
            </>
          }
        />
        <Step
          n={2}
          text={
            <>
              Select <ManageExtensionsPill />
            </>
          }
        />
        <Step
          n={3}
          text={
            <>
              Toggle Poshmark on <PoshmarkTogglePill />
            </>
          }
        />
      </ol>

      {/* iOS Safari address bar mockup at the bottom — like Phia's screenshot */}
      <div className="mt-8 flex flex-col items-center">
        <motion.div
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-[22px] leading-none text-ink"
        >
          ↓
        </motion.div>
        <SafariAddressBarMock />
      </div>

      <div className="mt-6 flex-1" />
      <div className="flex flex-col gap-2 pb-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-2xl bg-ink py-4 text-[15px] font-semibold text-paper transition-transform active:scale-[0.98]"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 text-[14px] font-medium text-neutral-500 transition-colors hover:text-ink"
        >
          Skip for now
        </button>
      </div>
    </motion.section>
  );
}

function Step({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-[13px] font-semibold text-muted tabular-nums">{n}.</span>
      <span className="flex flex-1 flex-wrap items-center gap-2 text-[14.5px] text-ink">
        {text}
      </span>
    </li>
  );
}

/* ───────────── inline visual primitives ───────────── */

function SafariBadge() {
  return (
    <span
      className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{
        background:
          "conic-gradient(from 270deg, #1E88E5 0%, #64B5F6 25%, #1565C0 50%, #1E88E5 100%)",
      }}
    >
      <span className="block h-2 w-px rotate-45 bg-white" />
    </span>
  );
}

function AddressBarIcon() {
  // Mimics the iOS "list/extensions" affordance shown in the screenshots
  return (
    <span className="inline-flex h-7 w-9 items-center justify-center rounded-md border border-line bg-paper">
      <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden>
        <rect x="2" y="3" width="20" height="2" rx="1" fill="#111" />
        <rect x="2" y="7.5" width="20" height="2" rx="1" fill="#111" />
        <rect x="2" y="12" width="20" height="2" rx="1" fill="#111" />
      </svg>
    </span>
  );
}

function ManageExtensionsPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 shadow-sm">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          d="M5 7h11l3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="#111"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="13" r="1.4" fill="#111" />
      </svg>
      <span className="text-[12.5px] font-medium text-ink">Manage Extensions</span>
    </span>
  );
}

function PoshmarkTogglePill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-2 py-1 shadow-sm">
      <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-ink text-[10px] font-bold text-white">
        P
      </span>
      <ToggleSwitch on />
    </span>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-[18px] w-[30px] items-center rounded-full transition-colors ${
        on ? "bg-[#34C759]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-all ${
          on ? "left-[14px]" : "left-[2px]"
        }`}
      />
    </span>
  );
}

function SafariAddressBarMock() {
  return (
    <div className="mt-2 flex w-full max-w-[320px] items-center gap-2 rounded-full bg-neutral-700/95 px-3 py-2 text-white shadow-md">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <span className="text-[14px] leading-none">‹</span>
      </span>
      <span className="flex h-7 flex-1 items-center justify-center gap-2 rounded-full bg-white/15">
        <svg viewBox="0 0 24 16" width="16" height="12" aria-hidden>
          <rect x="2" y="3" width="20" height="2" rx="1" fill="#fff" />
          <rect x="2" y="7.5" width="20" height="2" rx="1" fill="#fff" />
          <rect x="2" y="12" width="20" height="2" rx="1" fill="#fff" />
        </svg>
        <span className="text-[12px] tracking-tight">poshmark.com</span>
        <span className="text-[12px] opacity-70">↻</span>
      </span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[14px] leading-none">
        ⋯
      </span>
    </div>
  );
}
