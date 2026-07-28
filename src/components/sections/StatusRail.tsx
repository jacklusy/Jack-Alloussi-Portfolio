'use client';

import { motion, useReducedMotion } from 'motion/react';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

export type StatusRailProps = {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

const items = [
  { key: 'STATUS', value: 'AVAILABLE', live: true },
  { key: 'LOC', value: 'AMMAN · JO', live: false },
  { key: 'VISA', value: 'EU BLUE CARD', live: false },
  { key: 'GRAD', value: 'OCT 2026', live: false },
] as const;

/**
 * Signature element: monospace work-authorisation / availability status panel.
 */
export function StatusRail({ orientation = 'vertical', className }: StatusRailProps) {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <p className="sr-only">
        {profile.availability.status}. {profile.availability.visaNote} Graduating{' '}
        {profile.availability.graduationDate}.
      </p>
      {items.map((item, index) => (
        <motion.div
          key={item.key}
          className="flex flex-col gap-1"
          initial={prefersReducedMotion ? false : { opacity: 0, x: orientation === 'vertical' ? -8 : 0, y: orientation === 'horizontal' ? 6 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            duration: 0.35,
            delay: prefersReducedMotion ? 0 : 0.15 + index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="text-[var(--color-text-subtle)]">{item.key}</span>
          <span className="inline-flex items-center gap-2 font-medium text-[var(--color-brand)]">
            {item.live ? (
              <span className="status-pulse relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
            ) : null}
            {item.value}
          </span>
        </motion.div>
      ))}
    </>
  );

  return (
    <aside
      className={cn(
        'relative border-[var(--color-border)] font-mono text-[var(--text-xs)] tracking-[0.08em]',
        'bg-[var(--color-surface-sunken)]/90 backdrop-blur-sm',
        orientation === 'vertical' &&
          'hidden w-[var(--status-rail-width)] shrink-0 flex-col justify-center gap-7 border-r px-5 py-10 lg:flex',
        orientation === 'horizontal' &&
          'flex w-full flex-wrap items-center gap-x-7 gap-y-3 border-b px-4 py-3.5 lg:hidden',
        className,
      )}
      aria-label="Availability and work authorisation status"
    >
      {orientation === 'vertical' ? (
        <div
          className="absolute inset-y-8 left-0 w-0.5 bg-gradient-to-b from-transparent via-[var(--color-brand)] to-transparent opacity-70"
          aria-hidden
        />
      ) : null}
      {content}
    </aside>
  );
}
