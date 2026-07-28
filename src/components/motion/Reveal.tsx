'use client';

import { useReducedMotion } from 'motion/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * One-shot fade + slight rise on enter. Disabled under prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -80px 0px' }}
      transition={{
        duration: 0.28,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
