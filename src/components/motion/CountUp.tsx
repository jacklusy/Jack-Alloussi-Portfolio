'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { useLocale } from 'next-intl';

export type CountUpProps = {
  to: number;
  /** Appended after the number, e.g. `+`. */
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts up to `to` once, when scrolled into view. The final value is what the
 * server renders and what stays on screen until the animation actually starts
 * (reduced-motion users, crawlers and no-JS visitors never see anything else);
 * the count-up is a progressive enhancement. Digits are Latin in
 * every language so figures match the technical content around them.
 */
export function CountUp({ to, suffix = '', duration = 1.4, className }: CountUpProps) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const format = (value: number) =>
    `${new Intl.NumberFormat(locale, { numberingSystem: 'latn' }).format(Math.round(value))}${suffix}`;

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = format(value);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, prefersReducedMotion, to, duration]);

  return (
    // Numbers stay left-to-right even inside Arabic, so "15+" never becomes "+15".
    <span ref={ref} dir="ltr" className={className}>
      {format(to)}
    </span>
  );
}
