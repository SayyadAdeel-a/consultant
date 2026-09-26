/**
 * Animation wrapper barrel (see docs/DESIGN_SYSTEM.md §6).
 *
 * Pages and sections should import from this module rather than from
 * "motion/react" directly, so every scroll reveal goes through the shared
 * reduced-motion contract: when the user prefers reduced motion the
 * wrappers render static markup with no transform or opacity delays.
 */
export { FadeIn } from "./FadeIn";
export { SlideUp } from "./SlideUp";
export { DEFAULT_DURATION, EASE_OUT_EXPO } from "./constants";
