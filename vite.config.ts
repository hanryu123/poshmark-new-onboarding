import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages project URL: /<repo>/ */
const REPO = "poshmark-new-onboarding";
const base = process.env.GITHUB_ACTIONS === "true" ? `/${REPO}/` : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
