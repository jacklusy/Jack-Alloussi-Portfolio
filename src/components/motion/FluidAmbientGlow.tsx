'use client';

import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type FluidAmbientGlowProps = {
  className?: string;
};

/**
 * Soft oversized accent blurs that slowly morph — CSS-only, GPU-friendly.
 */
export function FluidAmbientGlow({ className }: FluidAmbientGlowProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div
        className={cn(
          'ambient-orb ambient-orb-a absolute -left-[10%] top-[8%] h-[42vmin] w-[42vmin] rounded-full',
          !prefersReducedMotion && 'animate-ambient-a',
        )}
      />
      <div
        className={cn(
          'ambient-orb ambient-orb-b absolute -right-[8%] top-[28%] h-[36vmin] w-[36vmin] rounded-full',
          !prefersReducedMotion && 'animate-ambient-b',
        )}
      />
      <div
        className={cn(
          'ambient-orb ambient-orb-c absolute bottom-[-12%] left-[28%] h-[48vmin] w-[48vmin] rounded-full',
          !prefersReducedMotion && 'animate-ambient-c',
        )}
      />
    </div>
  );
}
