'use client';

import { usePathname } from 'next/navigation';
import { FluidAmbientGlow } from '@/components/motion/FluidAmbientGlow';
import { ParallaxTilt } from '@/components/motion/ParallaxTilt';
import { ParticleMesh } from '@/components/motion/ParticleMesh';
import { useRichMotionCapability } from '@/hooks/useRichMotionCapability';
import { cn } from '@/lib/utils';

export type DynamicSceneProps = {
  className?: string;
  variant?: 'hero' | 'section' | 'page';
};

/**
 * Ambient glow always; particles/parallax only on fine pointers with enough
 * CPU to spare.
 *
 * Exactly one particle canvas may run at a time. The root layout mounts a
 * `page` scene on every route, and `HeroSection` mounts a `hero` scene on `/`
 * — so the page scene yields its canvas on the home route rather than running
 * a second simulation behind the hero's.
 */
export function DynamicScene({ className, variant = 'hero' }: DynamicSceneProps) {
  const richMotion = useRichMotionCapability();
  const pathname = usePathname();

  const meshClass =
    variant === 'hero' ? 'bg-hero-mesh' : variant === 'page' ? 'bg-page-mesh' : 'bg-section-mesh';

  const heroOwnsCanvas = pathname === '/';
  const showParticles = richMotion && (variant === 'hero' || !heroOwnsCanvas);

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
      {richMotion && variant === 'hero' ? <ParallaxTilt /> : null}
      {showParticles ? (
        <div
          className={cn(
            'absolute inset-0',
            variant === 'page' && 'opacity-35',
            variant === 'section' && 'opacity-40',
          )}
        >
          <ParticleMesh density={variant === 'hero' ? 48 : variant === 'page' ? 36 : 24} />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-spec-grid opacity-40" />
    </div>
  );
}
