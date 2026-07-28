'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type ScrollDrivenPathProps = {
  className?: string;
};

/**
 * Minimalist SVG strokes that draw in as the page scrolls.
 */
export function ScrollDrivenPath({ className }: ScrollDrivenPathProps) {
  const prefersReducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll('path'));

    for (const path of paths) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = prefersReducedMotion ? '0' : `${length}`;
    }

    if (prefersReducedMotion) return;

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      for (const path of paths) {
        const length = path.getTotalLength();
        path.style.strokeDashoffset = `${length * (1 - progress)}`;
      }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-y-0 right-0 z-[1] hidden w-[min(28vw,20rem)] opacity-60 lg:block',
        className,
      )}
      aria-hidden
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 900"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M120 40 C40 160 180 240 80 360 C20 440 160 520 100 640 C60 720 140 800 90 880"
          fill="none"
          stroke="rgb(var(--color-brand-rgb) / 0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M160 80 C100 200 190 300 130 420 C70 540 170 620 120 760"
          fill="none"
          stroke="rgb(var(--color-brand-rgb) / 0.25)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
