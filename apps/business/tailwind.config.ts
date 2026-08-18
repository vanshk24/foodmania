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
        brand: {
          coral: "#FF6B4A",
          coralHover: "#FF5232",
          coralLight: "#FFF1EE",
          green: "#63B46C",
          greenLight: "#EFF7EE",
          golden: "#F6B73C",
          goldenLight: "#FEF9EF",
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

        page: "#FAF9F5",
        surface: "#FFFFFF",
        ink: "#222222",
        subtext: "#666666",
        muted: "#999999",
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
    },
  },
  plugins: [],
};

export default config;
