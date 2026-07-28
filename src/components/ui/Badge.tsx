import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'brand' | 'muted' | 'mono';
};

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2 py-1 font-mono text-[var(--text-xs)] tracking-wide uppercase',
        tone === 'default' &&
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]',
        tone === 'brand' &&
          'border border-[var(--color-brand)]/30 bg-[var(--color-brand-subtle)] text-[var(--color-brand)]',
        tone === 'muted' && 'bg-[var(--color-surface-sunken)] text-[var(--color-text-subtle)]',
        tone === 'mono' &&
          'border border-[var(--color-border)] bg-transparent text-[var(--color-text-subtle)]',
        className,
      )}
      {...props}
    />
  );
}
