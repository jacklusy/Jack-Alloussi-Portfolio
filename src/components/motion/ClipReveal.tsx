'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  /** Percentage of each edge that starts hidden. */
  inset?: number;
  /** Corner radius kept while the mask opens. */
  radius?: string;
  /** Starting zoom of the content; it settles to 1 as the mask opens. */
  zoom?: number;
};

/**
 * Image reveal scrubbed by scroll: a rounded mask opens from the centre while
 * the picture inside settles from a slight zoom. Animates `clip-path` and
 * `transform` only. Under reduced motion the styles are simply not applied, so
 * the picture is shown as is. The element tree is the same either way (server
 * HTML and client render must match), and the ref is always attached, which
 * `useScroll` requires.
 */
export function ClipReveal({
  children,
  className,
  inset = 12,
  radius = '28px',
  zoom = 1.16,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 38%'] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [
      `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius})`,
      `inset(0% 0% 0% 0% round ${radius})`,
    ],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [zoom, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full"
        style={prefersReducedMotion ? {} : { clipPath }}
      >
        <motion.div className="relative h-full w-full" style={prefersReducedMotion ? {} : { scale }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
