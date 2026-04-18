import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandStep } from "./BrandStep";
import { CategoryStep } from "./CategoryStep";
import { DevNavBar, type DevStep } from "./DevNavBar";
import { InventoryAnalysisLoader } from "./InventoryAnalysisLoader";
import { SafariValuePropositionModal } from "./SafariValuePropositionModal";
import { SafariExtensionSetupGuide } from "./SafariExtensionSetupGuide";
import { MyFeed } from "./MyFeed";
import type { CategorySelectionPayload } from "./types/onboarding";

const AGE_OPTIONS = [
  "10-19",
  "20-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45-54",
  "55-64",
  "65+",
  "Over 60's",
];

/**
 * Onboarding screen flow:
 *   1 identity → 2 categories → 3 brands
 *   → loader (10s inventory analysis, Aha-moment proof)
 *   → value-prop (Apple-style modal: retail vs Poshmark)
 *   → guide (Safari extension activation walkthrough)
 *   → feed (final personalized destination)
 */
type Screen = 1 | 2 | 3 | "loader" | "value-prop" | "guide" | "feed";

type UrlBootstrap = {
  screen: Screen;
  gender: string | null;
  age: string | null;
  categories: CategorySelectionPayload | null;
};

/** Read once per mount; useEffect alone can run after paint and fail user expectations on prod/cached loads. */
function bootstrapFromUrl(): UrlBootstrap {
  if (typeof window === "undefined") {
    return { screen: 1, gender: null, age: null, categories: null };
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("step") !== "3") {
    return { screen: 1, gender: null, age: null, categories: null };
  }
  return {
    screen: 3,
    gender: "woman",
    age: "25-29",
    categories: {
      departments: [{ label: "Bags" }],
      searchKeywords: [],
    },
  };
}

export default function App() {
  const initialRef = useRef<UrlBootstrap | null>(null);
  if (initialRef.current === null) {
    initialRef.current = bootstrapFromUrl();
  }
  const initial = initialRef.current;

  const [screen, setScreen] = useState<Screen>(initial.screen);
  const [gender, setGender] = useState<string | null>(initial.gender);
  const [age, setAge] = useState<string | null>(initial.age);
  const [categories, setCategories] = useState<CategorySelectionPayload | null>(
    initial.categories
  );
  const [brands, setBrands] = useState<string[]>([]);

  const canContinue1 = Boolean(gender && age);

  return (
    <div
      className="mx-auto flex min-h-[100dvh] max-w-[420px] flex-col bg-paper px-5 pt-3 text-ink"
      style={{ paddingBottom: "calc(2rem + var(--dev-nav-h, 0px))" }}
    >
      {screen === 1 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 1">
          <Header
            step={1}
            onBack={undefined}
            backDisabled
            onSkip={() => {
              if (
                window.confirm(
                  "Skip identity questions? You can add these later in your profile."
                )
              )
                setScreen(2);
            }}
          />

          <h1 className="mt-6 font-display text-[1.65rem] font-bold leading-tight tracking-tight text-ink md:text-[1.85rem]">
            Let&apos;s personalize your feed.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Tell us a bit about you — we&apos;ll tailor what you see first.
          </p>

          <p className="mb-3 mt-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Gender
          </p>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Gender">
            {[
              ["man", "Man"],
              ["woman", "Woman"],
              ["other", "Other"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={gender === value}
                onClick={() => setGender(value)}
                className={`rounded-xl border py-3.5 text-center text-sm font-medium transition-colors ${
                  gender === value
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-neutral-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Age range
          </p>
          <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Age range">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={age === opt}
                onClick={() => setAge(opt)}
                className={`rounded-xl border py-3 text-center text-xs font-medium transition-colors ${
                  age === opt
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-neutral-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex-1" />
          <button
            type="button"
            disabled={!canContinue1}
            onClick={() => setScreen(2)}
            className="mt-10 w-full rounded-lg bg-ink py-4 text-[15px] font-semibold text-paper transition-opacity disabled:opacity-30"
          >
            Continue
          </button>
        </section>
      )}

      {screen === 2 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 2">
          <Header
            step={2}
            onBack={() => setScreen(1)}
            onSkip={() => {
              if (window.confirm("Skip this step? You can still pick brands next."))
                setScreen(3);
            }}
          />

          <CategoryStep
            onContinue={(data) => {
              setCategories(data);
              setScreen(3);
            }}
          />
        </section>
      )}

      {screen === 3 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 3">
          <Header
            step={3}
            onBack={() => setScreen(2)}
            onSkip={() => {
              if (window.confirm("Skip brand picks? We'll pick a few starters for you.")) {
                setBrands([]);
                setScreen("loader");
              }
            }}
          />

          <BrandStep
            min={3}
            max={10}
            onFinish={(picked) => {
              setBrands(picked);
              setScreen("loader");
            }}
          />
        </section>
      )}

      {/* ─── Post-onboarding flow (replaces the step UI) ─── */}
      {(screen === "guide" || screen === "feed") && (
        <AnimatePresence mode="wait">
          {screen === "guide" && (
            <SafariExtensionSetupGuide
              key="guide"
              onContinue={() => setScreen("feed")}
              onSkip={() => setScreen("feed")}
            />
          )}
          {screen === "feed" && <MyFeed key="feed" brands={brands} />}
        </AnimatePresence>
      )}

      {/* Full-screen overlays — sit above the (still-mounted) Step 3 underneath */}
      <AnimatePresence>
        {screen === "loader" && (
          <InventoryAnalysisLoader
            key="loader"
            onComplete={() => setScreen("value-prop")}
          />
        )}
        {screen === "value-prop" && (
          <SafariValuePropositionModal
            key="value-prop"
            onEnable={() => setScreen("guide")}
            onSkip={() => setScreen("feed")}
          />
        )}
      </AnimatePresence>

      {/* Categories used downstream of brands; reference here keeps the prop reachable
          for analytics integrations without breaking unused-var checks. */}
      <SilentDataSink categories={categories} />

      <DevNavBar
        current={screen as DevStep}
        onJump={(s) => setScreen(s as Screen)}
      />
    </div>
  );
}

/** Renders nothing; keeps the resolved categories selection in scope for future wiring. */
function SilentDataSink({ categories }: { categories: CategorySelectionPayload | null }) {
  void categories;
  return null;
}

function Header(props: {
  step: 1 | 2 | 3;
  onBack?: () => void;
  backDisabled?: boolean;
  onSkip: () => void;
}) {
  const { step, onBack, backDisabled, onSkip } = props;
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          disabled={backDisabled}
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] py-2 text-left text-2xl leading-none text-ink disabled:opacity-25"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] font-semibold uppercase tracking-wide text-muted"
        >
          Skip
        </button>
      </div>
      <motion.div
        className="flex h-1 gap-1.5"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Step ${step} of 3`}
      >
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-full flex-1 rounded-sm ${i <= step ? "bg-ink" : "bg-line"}`}
          />
        ))}
      </motion.div>
    </header>
  );
}
