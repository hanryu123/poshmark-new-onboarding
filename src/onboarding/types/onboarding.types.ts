export type Gender = "women" | "men" | "others";

export type AgeRange =
  | "under_18"
  | "18_24"
  | "25_29"
  | "30_34"
  | "35_39"
  | "40_44"
  | "45_plus";

export type Department =
  | "Women's Apparel"
  | "Men's Apparel"
  | "Women's Shoes"
  | "Men's Shoes"
  | "Luxury"
  | "Beauty"
  | "Kids"
  | "Home";

export interface SelectedListing {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  brand: string;
  size: string;
  department: Department;
}

export interface OnboardingState {
  gender: Gender | null;
  ageRange: AgeRange | null;
  /** Categories step: discovery search */
  categorySearchQuery: string;
  selectedDepartments: Department[];
  sizes: Partial<Record<Department, string>>;
  /** Occasion step: e.g. beach wedding, office, date night */
  occasionSearchQuery: string;
  searchedBrand: string | null;
  selectedBrands: string[];
  currentStep: number;
  skippedSteps: number[];
  extensionInstalled: boolean | null;
  /** After signup soft push flow */
  pushNotificationsOptIn: boolean | null;
}

export const defaultOnboardingState: OnboardingState = {
  gender: null,
  ageRange: null,
  categorySearchQuery: "",
  selectedDepartments: [],
  sizes: {},
  occasionSearchQuery: "",
  searchedBrand: null,
  selectedBrands: [],
  currentStep: 0,
  skippedSteps: [],
  extensionInstalled: null,
  pushNotificationsOptIn: null,
};

export const STORAGE_KEY = "posh_onboarding_nux_v8";
