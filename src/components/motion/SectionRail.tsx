'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const SECTIONS = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'] as const;
export type RailSection = (typeof SECTIONS)[number];

/**
 * Slim section index pinned to the inline-start edge on wide screens: shows where
 * you are on the home page and jumps to any section. Purely navigational — the
 * page works without it, so it is hidden below the `xl` breakpoint where there is
 * no spare margin to put it in.
 */
export function SectionRail() {
  const t = useTranslations('rail');
  const [active, setActive] = useState<RailSection>('hero');

  useEffect(() => {
    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    // A section is "current" while it crosses the middle band of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as RailSection);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t('label')}
      className="fixed start-5 top-1/2 z-[30] hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col items-start gap-1">
        {SECTIONS.map((id, index) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex min-h-7 items-center gap-3 focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className={cn(
                    'block w-[3px] rounded-full transition-all duration-[var(--duration-standard)] ease-[var(--ease-out)]',
                    isActive
                      ? 'h-7 bg-[var(--color-brand)]'
                      : 'h-3 bg-[var(--color-border-strong)] group-hover:h-5 group-hover:bg-[var(--color-text-subtle)] group-focus-visible:bg-[var(--color-brand)]',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase transition-opacity duration-[var(--duration-micro)]',
                    isActive
                      ? 'text-[var(--color-brand)] opacity-100'
                      : 'text-[var(--color-text-subtle)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                  )}
                >
                  <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>{' '}
                  {t(id)}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
