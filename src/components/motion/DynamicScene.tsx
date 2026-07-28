'use client';

import { FluidAmbientGlow } from '@/components/motion/FluidAmbientGlow';
import { ParallaxTilt } from '@/components/motion/ParallaxTilt';
import { ParticleMesh } from '@/components/motion/ParticleMesh';
import { cn } from '@/lib/utils';

export type DynamicSceneProps = {
  className?: string;
  variant?: 'hero' | 'section';
};

/**
 * Composes ambient glow, parallax geometry, and particle mesh for a living backdrop.
 */
export function DynamicScene({ className, variant = 'hero' }: DynamicSceneProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-[var(--z-ambient)] overflow-hidden',
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          'absolute inset-0',
          variant === 'hero' ? 'bg-hero-mesh' : 'bg-section-mesh',
        )}
      />
      <FluidAmbientGlow />
      {variant === 'hero' ? (
        <>
          <ParallaxTilt />
          <div className="absolute inset-0">
            <ParticleMesh density={52} />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 opacity-50">
          <ParticleMesh density={28} />
        </div>
      )}
      <div className="absolute inset-0 bg-spec-grid opacity-40" />
    </div>
  );
}
