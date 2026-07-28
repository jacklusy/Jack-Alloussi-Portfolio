import type { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

export type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  headerAction?: { label: string; href: string };
  align?: 'start' | 'center';
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
  headerAction,
  align = 'start',
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-[calc(var(--header-height)+1rem)] py-[var(--section-y)]',
        className,
      )}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <Container className={containerClassName}>
        {(eyebrow || title || description || headerAction) && (
          <Reveal
            className={cn(
              'mb-10 md:mb-14',
              align === 'center' && 'mx-auto text-center',
              !headerAction && 'max-w-[var(--prose-max)]',
            )}
          >
            <header
              className={cn(
                headerAction && 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
              )}
            >
              <div className={cn(headerAction && 'max-w-[var(--prose-max)]')}>
                {eyebrow ? (
                  <p className="font-mono-label mb-3 text-[var(--color-brand)]">{eyebrow}</p>
                ) : null}
                {title ? (
                  <h2
                    id={`${id}-title`}
                    className="text-[length:var(--text-h2)] tracking-tight text-[var(--color-text)]"
                  >
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-4 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
                    {description}
                  </p>
                ) : null}
              </div>
              {headerAction ? (
                <Link
                  href={headerAction.href}
                  className="inline-flex min-h-11 shrink-0 items-center text-[var(--text-sm)] font-medium text-[var(--color-brand)] transition-colors hover:underline"
                >
                  {headerAction.label}
                </Link>
              ) : null}
            </header>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
