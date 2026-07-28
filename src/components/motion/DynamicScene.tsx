'use client';

import { useEffect, useState } from 'react';
import { FluidAmbientGlow } from '@/components/motion/FluidAmbientGlow';
import { ParallaxTilt } from '@/components/motion/ParallaxTilt';
import { ParticleMesh } from '@/components/motion/ParticleMesh';
import { cn } from '@/lib/utils';

export type DynamicSceneProps = {
  className?: string;
  variant?: 'hero' | 'section' | 'page';
};

/**
 * Ambient glow always; particles/parallax only on fine pointers (desktop).
 */
export function DynamicScene({ className, variant = 'hero' }: DynamicSceneProps) {
  const [richMotion, setRichMotion] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setRichMotion(fine && !reduce);
  }, []);

  const meshClass =
    variant === 'hero' ? 'bg-hero-mesh' : variant === 'page' ? 'bg-page-mesh' : 'bg-section-mesh';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-[var(--z-ambient)] overflow-hidden',
        className,
      )}
      aria-hidden
    >
      <div className={cn('absolute inset-0', meshClass)} />
      <FluidAmbientGlow />
      {richMotion && variant === 'hero' ? (
        <>
          <ParallaxTilt />
          <div className="absolute inset-0">
            <ParticleMesh density={48} />
          </div>
        </>
      ) : null}
      {richMotion && (variant === 'section' || variant === 'page') ? (
        <div className={cn('absolute inset-0', variant === 'page' ? 'opacity-35' : 'opacity-40')}>
          <ParticleMesh density={variant === 'page' ? 36 : 24} />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-spec-grid opacity-40" />
    </div>
  );
}
