import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

export type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-[calc(var(--header-height)+1rem)] py-16 md:py-24 lg:py-28', className)}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <Container className={containerClassName}>
        {(eyebrow || title || description) && (
          <header className="mb-10 max-w-[var(--prose-max)] md:mb-12">
            {eyebrow ? (
              <p className="font-mono-label mb-3 text-[var(--color-brand)]">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 id={`${id}-title`} className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
