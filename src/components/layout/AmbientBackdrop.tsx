import { cn } from '@/lib/utils';
import { DynamicScene } from '@/components/motion/DynamicScene';

export type AmbientBackdropProps = {
  className?: string;
  variant?: 'hero' | 'section' | 'page';
};

/**
 * Living backdrop: mesh, ambient glow, parallax geometry, particle network.
 * Always mount full-bleed on a relative parent (section or main) — never inside Container.
 */
export function AmbientBackdrop({ className, variant = 'hero' }: AmbientBackdropProps) {
  return <DynamicScene className={cn(className)} variant={variant} />;
}
