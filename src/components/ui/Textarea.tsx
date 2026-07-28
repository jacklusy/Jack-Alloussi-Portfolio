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
        <label
          htmlFor={inputId}
          className="text-[var(--text-sm)] font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'field-control min-h-36 w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 text-[length:var(--text-body)] text-[var(--color-text)] caret-[var(--color-brand)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,box-shadow,background-color] duration-[var(--duration-micro)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]/35',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30',
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
