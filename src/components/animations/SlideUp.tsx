"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DEFAULT_DURATION, EASE_OUT_EXPO } from "./constants";

interface SlideUpProps {
  children: ReactNode;
  /** Extra classes applied to the wrapper element. */
  className?: string;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  /** Animation duration in seconds (design-system default: 0.4). */
  duration?: number;
}

/**
 * Scroll-reveal wrapper: fades and lifts its children in once they enter
 * the viewport (opacity 0 → 1, `y: 16px → 0px`; 200–400ms out-expo easing
 * per docs/DESIGN_SYSTEM.md §6.3).
 *
 * Reduced-motion compliance: when the user prefers reduced motion, renders
 * a plain, un-animated `<div>` immediately — no transform, opacity
 * transitions, or delays.
 */
export function SlideUp({
  children,
  className,
  delay = 0,
  duration = DEFAULT_DURATION,
}: SlideUpProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
