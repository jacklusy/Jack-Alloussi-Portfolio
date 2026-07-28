'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type HeroMotionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Orchestrated hero entrance — the one deliberate page-load moment (≤900ms).
 */
export function HeroMotion({ children, className }: HeroMotionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.06,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export type HeroMotionItemProps = {
  children: ReactNode;
  className?: string;
};

export function HeroMotionItem({ children, className }: HeroMotionItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: EASE_OUT },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
