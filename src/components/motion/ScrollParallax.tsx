'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRichMotionCapability } from '@/hooks/useRichMotionCapability';

export type ScrollParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * How far (px) the element drifts from its resting position as it crosses the
   * viewport. Positive moves it up the page *faster* than the scroll
   * (foreground), negative slower (background).
   */
  distance?: number;
};

/**
 * Vertical parallax, driven by scroll position and applied as a `transform`
 * only. Switched off (plain wrapper) on touch devices, low-core devices and
 * under `prefers-reduced-motion` — see `useRichMotionCapability`.
 */
export function ScrollParallax(props: ScrollParallaxProps) {
  const rich = useRichMotionCapability();
  // The animated variant is a separate component so `useScroll` is only ever
  // called with a ref that is actually attached to a rendered element.
  return rich ? (
    <ParallaxMotion {...props} />
  ) : (
    <div className={props.className}>{props.children}</div>
  );
}

function ParallaxMotion({ children, className, distance = 40 }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
