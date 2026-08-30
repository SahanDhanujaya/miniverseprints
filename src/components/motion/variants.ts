/**
 * Shared Framer Motion animation variants.
 * All animations use ONLY transform + opacity for hardware acceleration.
 * No layout-triggering properties (height, margin, padding) are used.
 */

import type { Variants } from 'framer-motion';

// ─── Base easing curve — snappy but smooth ────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

// ─── Viewport options ─────────────────────────────────────────────────────────
export const VIEWPORT = { once: true, margin: '-10% 0px -10% 0px' } as const;

// ─── Single element: fade up from 20px beneath ───────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

// ─── Section glass card: deeper blur reveal ───────────────────────────────────
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
};

// ─── Stagger container: orchestrates children ─────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// ─── Stagger item: used inside staggerContainer ───────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

// ─── Scale-in: for CTA / commission blocks ────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

// ─── Header text line: eyebrow tag ────────────────────────────────────────────
export const eyebrow: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_SMOOTH },
  },
};

// ─── Slide from left ──────────────────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

// ─── Slide from right ─────────────────────────────────────────────────────────
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};
