'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type ParallaxTiltProps = {
  className?: string;
};

/** Below this, the eased value has visually settled and the loop can stop. */
const SETTLE_EPSILON = 0.0005;

/**
 * Layered geometric mesh that tilts with pointer position (transform only).
 * The rAF loop idles once the easing settles and restarts on the next pointer
 * move, so a stationary cursor costs nothing.
 */
export function ParallaxTilt({ className }: ParallaxTiltProps) {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function tick() {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.06;
      currentY += dy * 0.06;

      root!.style.setProperty('--tilt-x', currentX.toFixed(4));
      root!.style.setProperty('--tilt-y', currentY.toFixed(4));

      if (Math.abs(dx) < SETTLE_EPSILON && Math.abs(dy) < SETTLE_EPSILON) {
        running = false;
        root!.style.removeProperty('will-change');
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function start() {
      if (running || document.hidden) return;
      running = true;
      root!.style.setProperty('will-change', 'transform');
      frame = window.requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      const { innerWidth, innerHeight } = window;
      targetX = (event.clientX / innerWidth - 0.5) * 2;
      targetY = (event.clientY / innerHeight - 0.5) * 2;
      start();
    }

    function onVisibility() {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        running = false;
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden perspective-[1200px]', className)}
      style={{ ['--tilt-x' as string]: '0', ['--tilt-y' as string]: '0' }}
      aria-hidden
    >
      <div className="parallax-layer parallax-layer-far absolute inset-[-8%]">
        <svg viewBox="0 0 800 600" className="h-full w-full opacity-[0.35]">
          <defs>
            <linearGradient id="geo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-brand-rgb) / 0.35)" />
              <stop offset="100%" stopColor="rgb(var(--color-brand-rgb) / 0.05)" />
            </linearGradient>
          </defs>
          <polygon points="80,120 220,60 300,200 140,260" fill="url(#geo-grad)" />
          <polygon points="520,40 720,100 680,280 480,220" fill="none" stroke="rgb(var(--color-brand-rgb) / 0.35)" strokeWidth="1.5" />
          <circle cx="640" cy="420" r="90" fill="none" stroke="rgb(var(--color-brand-rgb) / 0.25)" strokeWidth="1" />
          <path d="M40 480 C180 400 320 560 480 480" fill="none" stroke="rgb(var(--color-brand-rgb) / 0.3)" strokeWidth="1.25" />
        </svg>
      </div>
      <div className="parallax-layer parallax-layer-near absolute inset-0">
        <div className="absolute left-[12%] top-[18%] h-40 w-40 rotate-12 rounded-[var(--radius-xl)] border border-[rgb(var(--color-brand-rgb)/0.25)] bg-[rgb(var(--color-brand-rgb)/0.06)]" />
        <div className="absolute right-[14%] top-[42%] h-28 w-28 -rotate-6 rounded-full border border-[rgb(var(--color-brand-rgb)/0.3)]" />
        <div className="absolute bottom-[16%] left-[38%] h-2 w-48 rounded-full bg-[rgb(var(--color-brand-rgb)/0.35)]" />
        <div className="absolute right-[22%] top-[14%] h-3 w-3 rounded-full bg-[var(--color-brand)] opacity-70" />
        <div className="absolute left-[28%] bottom-[22%] h-2 w-2 rounded-full bg-[var(--color-brand)] opacity-50" />
      </div>
    </div>
  );
}
