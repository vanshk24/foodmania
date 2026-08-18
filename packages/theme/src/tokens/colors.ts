/**
 * Food Mania — MASTER UI / UX DESIGN SYSTEM VERSION 1.0 (LOCKED)
 *
 * ⚠️ THIS FILE IS LOCKED.
 * Official Design Language: Modern SaaS, Premium Restaurant, Soft UI, Minimal, Subtle Glassmorphic.
 */

export const colors = {
  // ─── Core Brand Food Palette ─────────────────────────────────
  brand: {
    coral: "#FF6B4A",        // Primary Coral Orange
    coralHover: "#FF5232",   // Pressed/Hover Coral
    coralLight: "#FFF1EE",   // Soft Coral Tint
    green: "#63B46C",        // Secondary Fresh Green
    greenLight: "#EFF7EE",   // Soft Green Tint
    golden: "#F6B73C",       // Accent Golden Honey
    goldenLight: "#FEF9EF",  // Soft Golden Tint
    mint: "#7DD6C4",         // Fresh Mint
    lavender: "#A78BFA",     // Soft Lavender
    skyBlue: "#68B8F8",      // Sky Blue
    white: "#FFFFFF",
  },

  // ─── Primary Coral Scale ─────────────────────────────────────
  primary: {
    50: "#FFF1EE",
    100: "#FFE2DC",
    200: "#FFC5B9",
    300: "#FFA896",
    400: "#FF8B73",
    500: "#FF6B4A",   // ← LOCKED Main Coral Brand Accent
    600: "#FF5232",   // Hover state
    700: "#E5391A",
    800: "#B8260C",
    900: "#8B1B06",
  },

  // ─── Secondary Green Scale ───────────────────────────────────
  secondary: {
    50: "#EFF7EE",
    100: "#DDF0DB",
    200: "#BCE1B9",
    300: "#9BD297",
    400: "#7AC375",
    500: "#63B46C",   // ← LOCKED Fresh Green
    600: "#4B9A54",
    700: "#367F3F",
  },

  // ─── Background & Surface ─────────────────────────────────────
  background: {
    page: "#FAF9F5",      // Warm Cream / Soft Ivory
    pageAlt: "#F7F6F2",   // Light Sand
    card: "#FFFFFF",      // Pure White Card Surface
    sidebar: "#FFFFFF",   // Clean White Dashboard Sidebar
    input: "#F8F9FA",     // Soft Input Field BG
    chip: "#EFF7EE",      // Soft Green Tint Chip
  },

  // ─── Text Colors ──────────────────────────────────────────────
  text: {
    primary: "#222222",     // Deep Charcoal text
    secondary: "#666666",   // Warm Gray sub-headings
    muted: "#999999",       // Placeholders & metadata
    white: "#FFFFFF",       // Text on colored backgrounds
    coral: "#FF6B4A",      // Accent Coral links
    green: "#63B46C",      // Positive green text
  },

  // ─── Borders & Dividers ───────────────────────────────────────
  border: {
    subtle: "#ECECEC",      // Light border
    focus: "#FF6B4A",       // Coral focus ring
  },
} as const;

export type ColorToken = typeof colors;
