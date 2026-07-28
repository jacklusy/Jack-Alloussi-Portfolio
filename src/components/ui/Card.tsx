import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'li';
  children: ReactNode;
  interactive?: boolean;
  variant?: 'default' | 'panel' | 'ghost';
};

export function Card({
  as: Comp = 'div',
  className,
  children,
  interactive = false,
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-lg)] transition-[transform,border-color,box-shadow,background-color] duration-[var(--duration-standard)] ease-[var(--ease-out)]',
        variant === 'default' &&
          'border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-sm)]',
        variant === 'panel' &&
          'border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6 backdrop-blur-sm',
        variant === 'ghost' && 'border border-transparent bg-transparent p-0',
        interactive &&
          'hover:border-[var(--color-brand)]/40 hover:shadow-[var(--shadow-glow)] [@media(hover:hover)]:hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
