import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-[transform,opacity,background-color,color,border-color,box-shadow,border-radius] duration-[var(--duration-micro)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] min-h-11 hover:scale-[1.02]',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] hover:shadow-[var(--shadow-glow)] rounded-[var(--radius-md)] hover:rounded-[var(--radius-lg)] px-5',
        secondary:
          'border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)]/90 text-[var(--color-text)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] hover:shadow-[var(--shadow-md)] rounded-[var(--radius-md)] hover:rounded-[var(--radius-lg)] px-5 backdrop-blur-sm',
        ghost:
          'text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] rounded-[var(--radius-md)] px-4',
      },
      size: {
        sm: 'min-h-11 px-3 text-sm',
        md: 'min-h-11 text-[var(--text-body)]',
        lg: 'min-h-12 px-6 text-[var(--text-body-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
