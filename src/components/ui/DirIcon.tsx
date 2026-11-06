import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A directional icon (arrow, chevron) that mirrors in right-to-left layouts.
 * Pass the lucide component itself: `<DirIcon icon={ArrowRight} className="h-4 w-4" />`.
 */
export function DirIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon className={cn('rtl:-scale-x-100', className)} aria-hidden />;
}
