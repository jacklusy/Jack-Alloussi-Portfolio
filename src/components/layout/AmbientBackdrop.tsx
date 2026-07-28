import { cn } from '@/lib/utils';

export type AmbientBackdropProps = {
  className?: string;
  variant?: 'hero' | 'section';
};

/**
 * Structural atmosphere — soft teal wash + specification grid. No particles.
 */
export function AmbientBackdrop({ className, variant = 'hero' }: AmbientBackdropProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <div
        className={cn(
          'absolute inset-0',
          variant === 'hero' && 'bg-hero-mesh',
          variant === 'section' && 'bg-section-mesh',
        )}
      />
      <div className="absolute inset-0 bg-spec-grid opacity-[0.45] dark:opacity-[0.25]" />
      <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[var(--color-brand)]/10 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--color-brand)]/8 blur-3xl" />
    </div>
  );
}
