'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useInlineSign } from '@/hooks/useDirection';

export type TechRibbonProps = {
  items: string[];
};

/**
 * Oversized outlined technology names that drift sideways as the page scrolls —
 * a visual bridge between sections that also names the stack. Decorative
 * (`aria-hidden`); the same technologies are listed as real content in the
 * skills section. Drifts toward the inline-end in LTR and RTL alike.
 */
export function TechRibbon({ items }: TechRibbonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const sign = useInlineSign();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${-32 * sign}%`]);

  // Repeat so the strip is always wider than the viewport.
  const loop = [...items, ...items];

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative select-none overflow-hidden border-y border-[var(--color-border)] py-5 md:py-7"
    >
      <motion.div
        style={prefersReducedMotion ? {} : { x }}
        className="flex w-max items-center gap-8 whitespace-nowrap md:gap-12"
      >
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 md:gap-12">
            <span
              dir="ltr"
              className="font-[family-name:var(--font-syne)] text-[clamp(2.25rem,6.5vw,5rem)] leading-none font-extrabold text-transparent [-webkit-text-stroke:1px_var(--color-border-strong)]"
            >
              {item}
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)] opacity-70" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
