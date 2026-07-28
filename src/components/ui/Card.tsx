import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'li';
  children: ReactNode;
  interactive?: boolean;
};

export function Card({
  as: Comp = 'div',
  className,
  children,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-sm)]',
        'transition-[transform,border-color,box-shadow] duration-[var(--duration-standard)] ease-[var(--ease-out)]',
        interactive &&
          'hover:-translate-y-1 hover:border-[var(--color-brand)]/35 hover:shadow-[var(--shadow-glow)]',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
