'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type ParticleMeshProps = {
  className?: string;
  density?: number;
};

/** Link opacity is quantised into this many tiers so each frame issues one
 *  stroke() per tier instead of one per particle pair. */
const ALPHA_TIERS = 4;
const TARGET_FPS = 30;
const FRAME_BUDGET = 1000 / TARGET_FPS;

/** Own cell, then E, SW, S, SE — the forward half of the neighbourhood, so
 *  every pair is visited exactly once. */
const NEIGHBOURS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

/**
 * Subtle interactive particle network. Pauses off-screen, on hidden tabs, and
 * under reduced motion.
 */
export function ParticleMesh({ className, density = 48 }: ParticleMeshProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let linkDist = 0;
    let frame = 0;
    let lastTime = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* Reading a custom property forces a style recalc, so it happens once per
       resize / theme change rather than once per drawn segment. */
    let tierStrokes: string[] = [];
    let particleFill = '';

    function readColors() {
      const styles = getComputedStyle(document.documentElement);
      const raw = styles.getPropertyValue('--color-brand-rgb').trim();
      tierStrokes = Array.from({ length: ALPHA_TIERS }, (_, i) => {
        const t = (i + 0.5) / ALPHA_TIERS;
        return `rgb(${raw} / ${(0.22 * t).toFixed(3)})`;
      });
      particleFill = `rgb(${raw} / 0.55)`;
    }

    /* Pointer state. The rect read is batched to at most one per frame. */
    const pointer = { x: -9999, y: -9999, clientX: -9999, clientY: -9999, active: false };
    let rect = canvas.getBoundingClientRect();
    let rectDirty = true;

    function applyPointer(clientX: number, clientY: number) {
      pointer.clientX = clientX;
      pointer.clientY = clientY;
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.active =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
    }

    function refreshRect() {
      rect = canvas!.getBoundingClientRect();
      rectDirty = false;
      applyPointer(pointer.clientX, pointer.clientY);
    }

    function onPointerMove(event: PointerEvent) {
      applyPointer(event.clientX, event.clientY);
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function markRectDirty() {
      rectDirty = true;
    }

    function resize() {
      width = parent!.clientWidth;
      height = parent!.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDist = Math.min(140, width * 0.18);
      rectDirty = true;
      readColors();

      const count = Math.min(density, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function step() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.04;
            p.vy += (dy / dist) * force * 0.04;
          }
        }

        p.vx *= 0.995;
        p.vy *= 0.995;
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > 0.64) {
          const speed = Math.sqrt(speedSq);
          p.vx = (p.vx / speed) * 0.8;
          p.vy = (p.vy / speed) * 0.8;
        }
      }
    }

    /* Uniform spatial grid with cell size == linkDist, so a particle can only
       link within its own cell and the four forward neighbours. Keeps the cost
       linear in particle count instead of quadratic. */
    function drawLinks() {
      if (linkDist <= 0) return;
      const cols = Math.max(1, Math.ceil(width / linkDist));
      const rows = Math.max(1, Math.ceil(height / linkDist));
      const cells: Particle[][] = Array.from({ length: cols * rows }, () => []);

      for (const p of particles) {
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / linkDist)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / linkDist)));
        cells[cy * cols + cx]!.push(p);
      }

      const tiers: number[][] = Array.from({ length: ALPHA_TIERS }, () => []);
      const linkDistSq = linkDist * linkDist;

      for (let cy = 0; cy < rows; cy += 1) {
        for (let cx = 0; cx < cols; cx += 1) {
          const bucket = cells[cy * cols + cx];
          if (!bucket || bucket.length === 0) continue;

          for (const [ox, oy] of NEIGHBOURS) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || nx >= cols || ny >= rows) continue;
            const other = cells[ny * cols + nx];
            if (!other || other.length === 0) continue;
            const sameCell = ox === 0 && oy === 0;

            for (let i = 0; i < bucket.length; i += 1) {
              const a = bucket[i]!;
              for (let j = sameCell ? i + 1 : 0; j < other.length; j += 1) {
                const b = other[j]!;
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;
                if (distSq >= linkDistSq) continue;
                const t = 1 - Math.sqrt(distSq) / linkDist;
                const tier = Math.min(ALPHA_TIERS - 1, Math.floor(t * ALPHA_TIERS));
                tiers[tier]!.push(a.x, a.y, b.x, b.y);
              }
            }
          }
        }
      }

      ctx!.lineWidth = 1;
      for (let tier = 0; tier < ALPHA_TIERS; tier += 1) {
        const segments = tiers[tier]!;
        if (segments.length === 0) continue;
        ctx!.strokeStyle = tierStrokes[tier]!;
        ctx!.beginPath();
        for (let i = 0; i < segments.length; i += 4) {
          ctx!.moveTo(segments[i]!, segments[i + 1]!);
          ctx!.lineTo(segments[i + 2]!, segments[i + 3]!);
        }
        ctx!.stroke();
      }
    }

    function drawParticles() {
      ctx!.fillStyle = particleFill;
      ctx!.beginPath();
      for (const p of particles) {
        ctx!.moveTo(p.x + 1.6, p.y);
        ctx!.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      }
      ctx!.fill();
    }

    function draw(time: number) {
      frame = window.requestAnimationFrame(draw);
      if (!onScreen || !pageVisible) return;
      if (time - lastTime < FRAME_BUDGET) return;
      lastTime = time;

      if (rectDirty) refreshRect();

      ctx!.clearRect(0, 0, width, height);
      step();
      drawLinks();
      drawParticles();
    }

    function onVisibility() {
      pageVisible = !document.hidden;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        if (onScreen) rectDirty = true;
      },
      { threshold: 0.05 },
    );
    observer.observe(parent);

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', markRectDirty, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', markRectDirty);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReducedMotion, density]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden
    />
  );
}
