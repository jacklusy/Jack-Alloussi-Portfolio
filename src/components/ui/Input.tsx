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
        <label
          htmlFor={inputId}
          className="text-[var(--text-sm)] font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'field-control min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 text-[length:var(--text-body)] text-[var(--color-text)] caret-[var(--color-brand)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,box-shadow,background-color] duration-[var(--duration-micro)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]/35',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30',
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
