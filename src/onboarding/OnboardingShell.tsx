import { AnimatePresence, motion } from "framer-motion";
import { MyFeed } from "../MyFeed";
import { DevNavBar, type DevNavItem } from "../DevNavBar";
import { OnboardingProvider, useOnboarding, type Direction } from "./OnboardingContext";
import { ProgressBar } from "./components/ProgressBar";
import { SkipButton } from "./components/SkipButton";
import { Step0_Landing } from "./steps/Step0_Landing";
import { Step1_Demographics } from "./steps/Step1_Demographics";
import { Step2_CategoryGrid } from "./steps/Step2_CategoryGrid";
import { Step3_Occasion } from "./steps/Step3_Occasion";
import { Step4_Brand } from "./steps/Step4_Brand";
import { Step5_AhaMoment } from "./steps/Step5_AhaMoment";
import { Step6_Signup } from "./steps/Step6_Signup";
import { Step7_Safari } from "./steps/Step7_Safari";

const DEV_STEPS: DevNavItem[] = [
  { id: 0, label: "Landing" },
  { id: 1, label: "Demo" },
  { id: 2, label: "Categories" },
  { id: 3, label: "Occasion" },
  { id: 4, label: "Brand" },
  { id: 5, label: "Aha" },
  { id: 6, label: "Sign up" },
  { id: 7, label: "Safari" },
  { id: "feed", label: "Feed" },
];

const PROGRESS_PCT: Record<number, number> = {
  1: 15,
  2: 30,
  3: 45,
  4: 60,
  6: 78,
  7: 100,
};

const slideVariants = {
  enter: (dir: Direction) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: Direction) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
  }),
};

function ShellInner() {
  const { state, direction, goBack, goNext, skip, jumpToStep, showFeed, completeToFeed } =
    useOnboarding();
  const step = state.currentStep;

  const landingLock = step === 0;
  const immersive = step === 0 || step === 5;
  const showProgress = [1, 2, 3, 4, 6, 7].includes(step);
  const progressPct = PROGRESS_PCT[step] ?? 0;
  const showBack = step >= 2 && step <= 7 && step !== 5;
  const showSkip = step === 2 || step === 3 || step === 4;

  const jumpDev = (id: number | "feed") => {
    if (id === "feed") {
      completeToFeed();
      return;
    }
    jumpToStep(id);
  };

  if (showFeed) {
    return (
      <div
        className="relative mx-auto flex min-h-[100dvh] w-full max-w-[420px] flex-col bg-paper text-ink"
        style={{ paddingBottom: "var(--dev-nav-h, 0px)" }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 pt-3">
          <MyFeed brands={state.selectedBrands} />
        </div>
        <DevNavBar steps={DEV_STEPS} currentId="feed" onJump={jumpDev} />
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[420px] flex-col overflow-x-hidden bg-paper text-ink ${
        landingLock ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
      }`}
      style={{ paddingBottom: landingLock ? 0 : "var(--dev-nav-h, 0px)" }}
    >
      {!immersive && (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-[max(0.25rem,env(safe-area-inset-top))]">
          {showProgress && (
            <div className="pointer-events-none px-0">
              <ProgressBar value={progressPct} />
            </div>
          )}
          <div className="pointer-events-auto mt-1 flex items-center justify-between px-3">
            {showBack ? (
              <button
                type="button"
                onClick={goBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/95 text-lg shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95"
                aria-label="Back"
              >
                ‹
              </button>
            ) : (
              <span className="w-10" aria-hidden />
            )}
            {showSkip ? (
              <SkipButton onClick={skip} />
            ) : (
              <span className="w-14" aria-hidden />
            )}
          </div>
        </header>
      )}

      <div
        className={
          immersive
            ? landingLock
              ? "relative flex h-full min-h-0 flex-1 flex-col"
              : "relative flex min-h-[100dvh] flex-1 flex-col"
            : "relative flex min-h-[100dvh] flex-1 flex-col pt-16"
        }
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`flex min-h-0 flex-1 flex-col ${
              landingLock ? "h-full min-h-0" : "min-h-[100dvh]"
            }`}
          >
            {step === 0 ? (
              <Step0_Landing onStart={goNext} />
            ) : step === 1 ? (
              <Step1_Demographics />
            ) : step === 2 ? (
              <Step2_CategoryGrid />
            ) : step === 3 ? (
              <Step3_Occasion />
            ) : step === 4 ? (
              <Step4_Brand />
            ) : step === 5 ? (
              <Step5_AhaMoment />
            ) : step === 6 ? (
              <Step6_Signup />
            ) : (
              <Step7_Safari />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DevNavBar steps={DEV_STEPS} currentId={step} onJump={jumpDev} />
    </div>
  );
}

export function OnboardingShell() {
  return (
    <OnboardingProvider>
      <ShellInner />
    </OnboardingProvider>
  );
}
