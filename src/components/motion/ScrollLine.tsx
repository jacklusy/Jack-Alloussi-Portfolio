'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Hairline rule that draws itself from the inline-start edge when it enters the
 * viewport. Used at the top of each home section so sections read as one
 * connected sequence rather than separate blocks.
 */
export function ScrollLine({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const base = cn('h-px w-full bg-[var(--color-border-strong)]', className);

  if (prefersReducedMotion) return <div aria-hidden className={base} />;

  return (
    <motion.div
      aria-hidden
      className={cn(base, 'origin-left rtl:origin-right')}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
