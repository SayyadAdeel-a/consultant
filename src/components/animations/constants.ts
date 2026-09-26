/**
 * Shared motion contract for the animation wrappers (see
 * docs/DESIGN_SYSTEM.md §6):
 *
 * - Easing: out-expo `cubic-bezier(0.16, 1, 0.3, 1)` — natural physical
 *   settling for scroll reveals and entrances.
 * - Duration: 0.3s–0.4s (fast, non-distracting; the design system allows
 *   0.2s–0.4s overall).
 *
 * Kept in one module so `FadeIn` and `SlideUp` can never drift apart.
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const DEFAULT_DURATION = 0.4;
