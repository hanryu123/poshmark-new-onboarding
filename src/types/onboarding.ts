/** Step 2 — category & keyword selection (single source of truth for App + CategoryStep) */
export type CategoryDepartment = {
  label: string;
  size?: string;
};

export type CategorySelectionPayload = {
  departments: CategoryDepartment[];
  searchKeywords: string[];
};
