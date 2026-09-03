'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  /** Opt out on dense grids where N listeners are not worth the effect. */
  enabled?: boolean;
};

/**
 * Desktop-only 3D tilt toward pointer. Disabled on touch / reduced motion.
 *
 * The element rect is measured once per hover rather than per pointer move, so
 * moving across a grid of cards does not thrash layout.
 */
export function TiltCard({ children, className, maxTilt = 8, enabled = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let frame = 0;
    let rect: DOMRect | null = null;
    let pendingX = 0;
    let pendingY = 0;

    function write() {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      el.style.setProperty('--tilt-rx', `${pendingX.toFixed(2)}deg`);
      el.style.setProperty('--tilt-ry', `${pendingY.toFixed(2)}deg`);
      el.style.setProperty('--tilt-scale', '1.01');
    }

    function onEnter() {
      const el = ref.current;
      if (!el) return;
      // Single layout read per hover, reused by every subsequent move.
      rect = el.getBoundingClientRect();
      el.style.setProperty('will-change', 'transform');
    }

    function onMove(event: PointerEvent) {
      if (!rect) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pendingY = (x - 0.5) * (maxTilt * 2);
      pendingX = (0.5 - y) * (maxTilt * 2);
      if (frame === 0) frame = requestAnimationFrame(write);
    }

    function onLeave() {
      const el = ref.current;
      if (!el) return;
      rect = null;
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      el.style.setProperty('--tilt-rx', '0deg');
      el.style.setProperty('--tilt-ry', '0deg');
      el.style.setProperty('--tilt-scale', '1');
      el.style.removeProperty('will-change');
    }

    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [maxTilt, enabled]);

  if (!enabled) {
    return <div className={cn('h-full', className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn('tilt-card h-full', className)}>
      {children}
    </div>
  );
}
