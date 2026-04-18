/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        ink: "#000000",
        paper: "#FFFFFF",
        muted: "#737373",
        line: "#E5E5E5",
        finish: "#4A2F35",
        /** Disabled primary CTA — dusty rose like reference */
        "finish-muted": "#D4B8BC",
        /** Poshmark brand palette */
        "posh-pink": "#E91E63",
        "posh-pink-dark": "#B7124C",
        "posh-burgundy": "#821E3F",
        "posh-blush": "#FCE4EC",
      },
      boxShadow: {
        bubble: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
