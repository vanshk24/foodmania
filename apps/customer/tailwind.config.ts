import type { Config } from "tailwindcss";

// ⚠️ MASTER UI / UX DESIGN SYSTEM VERSION 1.0 (LOCKED)
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Food Palette ─────────────────────────────────
        brand: {
          coral: "#FF6B4A",
          coralHover: "#FF5232",
          coralLight: "#FFF1EE",
          green: "#63B46C",
          greenLight: "#EFF7EE",
          golden: "#F6B73C",
          goldenLight: "#FEF9EF",
          mint: "#7DD6C4",
          lavender: "#A78BFA",
          skyBlue: "#68B8F8",
        },

        primary: {
          DEFAULT: "#FF6B4A",
          hover: "#FF5232",
          light: "#FFF1EE",
          50: "#FFF1EE",
          100: "#FFE2DC",
          500: "#FF6B4A",
          600: "#FF5232",
        },

        secondary: {
          DEFAULT: "#63B46C",
          hover: "#4B9A54",
          light: "#EFF7EE",
        },

        // ── Backgrounds ────────────────────────────────────────
        page: "#FAF9F5",      // Warm Cream / Soft Ivory
        surface: "#FFFFFF",   // Pure White
        input: "#F8F9FA",
        chip: "#EFF7EE",

        // ── Text ───────────────────────────────────────────────
        ink: "#222222",      // Primary Text
        subtext: "#666666",  // Secondary Text
        muted: "#999999",    // Placeholders & Captions
      },

      fontFamily: {
        sans: ["var(--font-inter)", "Poppins", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "Poppins", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },

      borderRadius: {
        button: "18px",
        card: "24px",
        modal: "28px",
        image: "20px",
        input: "18px",
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "24px",
        "2xl": "28px",
      },

      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.08)",
        modal: "0 12px 40px rgba(0, 0, 0, 0.12)",
        button: "0 4px 16px rgba(255, 107, 74, 0.3)",
        soft: "0 2px 10px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
