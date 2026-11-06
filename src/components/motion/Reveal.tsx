'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { useInlineSign } from '@/hooks/useDirection';

const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

/**
 * `start` / `end` are logical: content enters from the inline-start or
 * inline-end edge, so it slides in from the left in German and from the right
 * in Arabic without any per-language code at the call site.
 */
export type RevealDirection = 'up' | 'start' | 'end';

function offsetFor(direction: RevealDirection, distance: number, sign: 1 | -1) {
  switch (direction) {
    case 'start':
      return { x: -distance * sign, y: 0 };
    case 'end':
      return { x: distance * sign, y: 0 };
    case 'up':
    default:
      return { x: 0, y: distance };
  }
}

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical distance when direction is `up` (legacy). */
  y?: number;
  direction?: RevealDirection;
  distance?: number;
};

/**
 * One-shot fade + directional enter. Content stays in the DOM for SEO / reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  direction = 'up',
  distance,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const sign = useInlineSign();
  const dist = distance ?? (direction === 'up' ? y : 32);
  const from = offsetFor(direction, dist, sign);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -64px 0px' }}
      transition={{
        duration: 0.34,
        delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.div>
  );
}

export type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className, stagger = 0.05 }: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -48px 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: Math.min(stagger, 0.08),
            delayChildren: 0.04,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
};

export function StaggerItem({
  children,
  className,
  direction = 'up',
  distance = 20,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const sign = useInlineSign();
  const from = offsetFor(direction, distance, sign);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...from },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.3, ease: EASE_OUT },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
