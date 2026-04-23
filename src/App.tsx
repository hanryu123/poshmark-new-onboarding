import { useMemo } from "react";
import { LiveOnboardingFlow } from "./liveOnboarding/LiveOnboardingFlow";
import { OnboardingShell } from "./onboarding/OnboardingShell";

/** Open `?live=1` (refresh after changing the query) to run Posh Live onboarding. */
function useLiveOnboardingFromUrl(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("live") === "1";
  }, []);
}

export default function App() {
  const live = useLiveOnboardingFromUrl();
  return live ? <LiveOnboardingFlow /> : <OnboardingShell />;
}
