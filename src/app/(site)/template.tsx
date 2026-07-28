'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export type TemplateProps = {
  children: ReactNode;
};

/**
 * Soft route transition — opacity + slight rise, skipped under reduced motion.
 */
export default function Template({ children }: TemplateProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
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
