'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export type TemplateProps = {
  children: ReactNode;
};

/**
 * Soft route transition — opacity + slight rise, skipped under reduced motion.
 *
 * Skipped on the homepage: this wraps the *entire* page tree (every section,
 * not just above-the-fold), and HeroMotion already runs its own staggered
 * entrance there — "the one deliberate page-load moment" per its own doc
 * comment. Stacking a full-page fade on top of that doubles the number of
 * concurrently-animating elements during the exact window Lighthouse scores
 * as Total Blocking Time, on every device regardless of pointer/hover
 * capability. Other routes have no competing entrance animation, so the
 * transition stays valuable there.
 */
export default function Template({ children }: TemplateProps) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  if (prefersReducedMotion || pathname === '/') {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
