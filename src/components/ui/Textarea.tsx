import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string | undefined;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, error, ...props }, ref) => {
    const inputId = id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'min-h-32 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-[var(--color-text)] transition-colors duration-[var(--duration-micro)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]/30',
            error && 'border-[var(--color-danger)]',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-[var(--text-sm)] text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
