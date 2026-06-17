"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the app so every Framer Motion animation automatically respects the
 * user's `prefers-reduced-motion` setting. With `reducedMotion="user"`, Framer
 * disables transform/layout animations (parallax, slide, scale) and keeps only
 * opacity for users who opt out of motion — no per-component guards needed.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
