'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Thin page-progress bar fixed to the top edge. Driven by `scaleX` only
 * (compositor-friendly), grows from the inline-start edge so it reads
 * correctly in right-to-left languages too.
 *
 * Reduced motion is handled in CSS (`motion-reduce:hidden`) rather than by
 * returning `null`: the server cannot know the preference, and rendering a
 * different tree on the client than in the HTML makes React discard the
 * server markup (a hydration mismatch).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      data-testid="scroll-progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-[calc(var(--z-header)+1)] h-[2px] origin-left bg-[var(--color-brand)] motion-reduce:hidden rtl:origin-right"
      style={{ scaleX }}
    />
  );
}
