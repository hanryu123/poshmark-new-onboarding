import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultOnboardingState,
  STORAGE_KEY,
  type OnboardingState,
} from "./types/onboarding.types";

export type Direction = 1 | -1;

export type OnboardingContextValue = {
  state: OnboardingState;
  direction: Direction;
  patch: (p: Partial<OnboardingState>) => void;
  goNext: () => void;
  goBack: () => void;
  skip: () => void;
  setStep: (step: number, dir?: Direction) => void;
  jumpToStep: (step: number) => void;
  completeToFeed: () => void;
  showFeed: boolean;
};

const MAX_STEP = 7;

const OnboardingCtx = createContext<OnboardingContextValue | null>(null);

function load(): OnboardingState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OnboardingState>;
      return { ...defaultOnboardingState, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return { ...defaultOnboardingState };
}

function persist(s: OnboardingState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => load());
  const [direction, setDirection] = useState<Direction>(1);
  const [showFeed, setShowFeed] = useState(false);

  useEffect(() => {
    persist(state);
  }, [state]);

  const patch = useCallback((p: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...p }));
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(MAX_STEP, prev.currentStep + 1),
    }));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const skip = useCallback(() => {
    setDirection(1);
    setState((prev) => {
      const step = prev.currentStep;
      const skipped = prev.skippedSteps.includes(step)
        ? prev.skippedSteps
        : [...prev.skippedSteps, step];
      return {
        ...prev,
        currentStep: Math.min(MAX_STEP, step + 1),
        skippedSteps: skipped,
      };
    });
  }, []);

  const setStep = useCallback((step: number, dir: Direction = 1) => {
    setDirection(dir);
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const completeToFeed = useCallback(() => {
    setShowFeed(true);
  }, []);

  const jumpToStep = useCallback((s: number) => {
    setShowFeed(false);
    setDirection(1);
    setState((prev) => ({ ...prev, currentStep: s }));
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      state,
      direction,
      patch,
      goNext,
      goBack,
      skip,
      setStep,
      jumpToStep,
      completeToFeed,
      showFeed,
    }),
    [state, direction, patch, goNext, goBack, skip, setStep, jumpToStep, completeToFeed, showFeed]
  );

  return <OnboardingCtx.Provider value={value}>{children}</OnboardingCtx.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const v = useContext(OnboardingCtx);
  if (!v) throw new Error("useOnboarding must be used within OnboardingProvider");
  return v;
}
