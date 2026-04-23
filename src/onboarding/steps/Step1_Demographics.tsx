import { motion } from "framer-motion";
import { ONBOARDING_CONTINUE_BUTTON_CLASS } from "../components/continueCta";
import { useOnboarding } from "../OnboardingContext";
import type { AgeRange, Gender } from "../types/onboarding.types";

const GENDERS: { id: Gender; label: string }[] = [
  { id: "women", label: "Women's" },
  { id: "men", label: "Men's" },
  { id: "others", label: "Others" },
];

const AGES: { id: AgeRange; label: string }[] = [
  { id: "under_18", label: "Under 18" },
  { id: "18_24", label: "18–24" },
  { id: "25_29", label: "25–29" },
  { id: "30_34", label: "30–34" },
  { id: "35_39", label: "35–39" },
  { id: "40_44", label: "40–44" },
  { id: "45_plus", label: "45+" },
];

export function Step1_Demographics() {
  const { state, patch, goNext } = useOnboarding();
  const canGo = state.gender !== null && state.ageRange !== null;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-28 pt-4">
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-[1.45rem] font-bold leading-snug tracking-tight text-ink"
      >
        A few details for your perfect recommendation?
      </motion.h1>
      <p className="mt-2 text-sm text-muted">Minimal & necessary — we&apos;ll refine the rest as you shop.</p>

      <p className="mt-8 text-[11px] font-semibold uppercase tracking-wide text-muted">
        I primarily shop for
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {GENDERS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => patch({ gender: g.id })}
            className={`w-full rounded-xl border py-3.5 text-[15px] font-semibold transition-colors ${
              state.gender === g.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink hover:border-neutral-300"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-[11px] font-semibold uppercase tracking-wide text-muted">
        My age range
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {AGES.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => patch({ ageRange: a.id })}
            className={`rounded-xl border py-3 text-[14px] font-semibold transition-colors ${
              state.ageRange === a.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink hover:border-neutral-300"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!canGo}
          onClick={goNext}
          className={ONBOARDING_CONTINUE_BUTTON_CLASS}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
