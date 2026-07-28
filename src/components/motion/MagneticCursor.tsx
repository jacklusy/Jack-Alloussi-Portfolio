'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Soft magnetic cursor for fine pointers only. Hidden on touch devices.
 */
export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let frame = 0;
    let current = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    function tick() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      setPos({ x: current.x, y: current.y });
      frame = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      target = { x: event.clientX, y: event.clientY };
      setHidden(false);

      const el = document.elementFromPoint(event.clientX, event.clientY);
      const magnet = el?.closest('a, button, [data-magnetic]') as HTMLElement | null;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        target = {
          x: event.clientX + (cx - event.clientX) * 0.22,
          y: event.clientY + (cy - event.clientY) * 0.22,
        };
        setActive(true);
      } else {
        setActive(false);
      }
    }

    function onLeave() {
      setHidden(true);
      setActive(false);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(tick);
    document.documentElement.classList.add('has-magnetic-cursor');

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-magnetic-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed left-0 top-0 z-[70] hidden mix-blend-difference md:block',
        hidden && 'opacity-0',
      )}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
      aria-hidden
    >
      <span
        className={cn(
          'block -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/20 transition-[width,height,opacity] duration-[var(--duration-micro)]',
          active ? 'h-12 w-12 opacity-90' : 'h-3 w-3 opacity-70',
        )}
      />
    </div>
  );
}
