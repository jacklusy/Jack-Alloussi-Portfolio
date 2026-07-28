import { cn } from '@/lib/utils';
import { DynamicScene } from '@/components/motion/DynamicScene';

export type AmbientBackdropProps = {
  className?: string;
  variant?: 'hero' | 'section';
};

/**
 * Living backdrop: mesh, ambient glow, parallax geometry, particle network.
 */
export function AmbientBackdrop({ className, variant = 'hero' }: AmbientBackdropProps) {
  return <DynamicScene className={cn(className)} variant={variant} />;
}
