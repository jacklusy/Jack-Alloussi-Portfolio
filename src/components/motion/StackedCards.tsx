'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type StackContext = {
  progress: MotionValue<number>;
  count: number;
  active: boolean;
};

const Ctx = createContext<StackContext | null>(null);

export type StackedCardsProps = {
  /** Number of `StackedCard` children (needed to space the scroll ranges). */
  count: number;
  children: ReactNode;
  className?: string;
};

/**
 * Cards that pin to the top of the viewport one after another. As the next card
 * slides over, the ones beneath shrink and dim slightly, giving a "deck of
 * cases" feel. On narrow screens, touch layouts and under reduced motion the
 * cards are an ordinary vertical list: the scale/dim only runs when `active`.
 */
export function StackedCards({ count, children, className }: StackedCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 768px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <Ctx.Provider value={{ progress: scrollYProgress, count, active: isWide && !prefersReducedMotion }}>
      <div ref={ref} className={cn('relative', className)}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export type StackedCardProps = {
  index: number;
  children: ReactNode;
  className?: string;
};

export function StackedCard({ index, children, className }: StackedCardProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('StackedCard must be rendered inside StackedCards');
  const { progress, count, active } = ctx;

  const behind = count - 1 - index; // how many cards will end up on top of this one
  const start = index / count;
  const scale = useTransform(progress, [start, 1], [1, 1 - 0.045 * behind]);
  const dim = useTransform(progress, [start, 1], [0, count > 1 ? 0.5 * (behind / (count - 1)) : 0]);

  return (
    <div
      // Sticky is pure CSS, so the layout is identical before and after
      // hydration; only the scale/dim below depends on `active`.
      className={cn('mb-6 md:sticky md:mb-[14vh] last:mb-0', className)}
      style={{ top: `calc(var(--header-height) + 1.25rem + ${index * 0.75}rem)` }}
    >
      <motion.div
        className="relative origin-top"
        style={active ? { scale } : {}}
      >
        {children}
        {active ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-[var(--color-bg)]"
            style={{ opacity: dim }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
