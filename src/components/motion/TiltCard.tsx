'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * Desktop-only 3D tilt toward pointer. Disabled on touch / reduced motion.
 */
export function TiltCard({ children, className, maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let frame = 0;

    function onMove(event: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      });
    }

    function onLeave() {
      const el = ref.current;
      if (!el) return;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [maxTilt]);

  return (
    <div
      ref={ref}
      className={cn(
        'h-full transform-gpu transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)] will-change-transform',
        className,
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
