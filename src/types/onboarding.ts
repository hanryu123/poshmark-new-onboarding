/** Step 2 — legacy category step payload (CategoryStep.tsx) */
export type CategoryDepartment = {
  label: string;
  size?: string;
};

export type CategorySelectionPayload = {
  departments: CategoryDepartment[];
  searchKeywords: string[];
};

/** Global accumulated state for new user onboarding (Steps 2–10). */
export type OnboardingCategory = { name: string; size: string };

export type OnboardingState = {
  shoppingFor: string[];
  categories: OnboardingCategory[];
  brands: string[];
  occasions: string[];
  gender: string | null;
  ageRange: string | null;
  email: string | null;
};

export type OnboardingCompletePayload = OnboardingState;

export function emptyOnboardingState(): OnboardingState {
  return {
    shoppingFor: [],
    categories: [],
    brands: [],
    occasions: [],
    gender: null,
    ageRange: null,
    email: null,
  };
}
