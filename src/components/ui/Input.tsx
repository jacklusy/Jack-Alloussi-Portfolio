import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, label, error, hint, ...props }, ref) => {
    const inputId = id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const hintId = hint && inputId ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 text-[var(--color-text)] transition-colors duration-[var(--duration-micro)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]/30',
            error && 'border-[var(--color-danger)]',
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p id={hintId} className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-[var(--text-sm)] text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
