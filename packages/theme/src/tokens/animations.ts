/**
 * Food Mania — Animation Design Tokens
 *
 * Micro-animation presets for a premium, modern SaaS feel.
 * Used by Framer Motion variants and Tailwind animation utilities.
 */

export const animations = {
  // ─── Duration ────────────────────────────────────────────────
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },

  // ─── Easing ──────────────────────────────────────────────────
  easing: {
    ease: [0.4, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    spring: { type: "spring", stiffness: 400, damping: 30 },
    springGentle: { type: "spring", stiffness: 200, damping: 25 },
  },

  // ─── Framer Motion Variants ───────────────────────────────────
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slideUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 16 },
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
    },
    slideDown: {
      initial: { opacity: 0, y: -16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -16 },
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
    },
  },

  // ─── Stagger (for lists) ──────────────────────────────────────
  stagger: {
    container: {
      animate: { transition: { staggerChildren: 0.08 } },
    },
    item: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
    },
  },
} as const;

export type AnimationToken = typeof animations;
