import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'li';
  children: ReactNode;
};

export function Card({ as: Comp = 'div', className, children, ...props }: CardProps) {
  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-[var(--ease-out)]',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
