'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export type ProjectsFilterProps = {
  /**
   * Derived from the catalog server-side and passed down, rather than
   * imported here — importing `@/content/projects` from a client component
   * would pull all 13 case studies' full prose, plus the zod schemas that
   * validate them, into the browser bundle just to read off category names.
   */
  categories: string[];
  topTechs: string[];
  activeTech?: string | undefined;
  activeCategory?: string | undefined;
  activeQuery?: string | undefined;
  resultCount: number;
  totalCount: number;
};

export function ProjectsFilter({
  categories,
  topTechs,
  activeTech,
  activeCategory,
  activeQuery,
  resultCount,
  totalCount,
}: ProjectsFilterProps) {
  const router = useRouter();
  const hasFilter = Boolean(activeTech || activeCategory || activeQuery);

  /**
   * Every param defaults to its current value, so changing one filter never
   * drops the others — the name search, the discipline (category) filter,
   * and the stack (tech) filter all compose.
   */
  function go(
    next: { tech?: string | undefined; category?: string | undefined; q?: string | undefined },
    options?: { replace?: boolean },
  ) {
    const merged = {
      tech: activeTech,
      category: activeCategory,
      q: activeQuery,
      ...next,
    };
    const params = new URLSearchParams();
    if (merged.tech) params.set('tech', merged.tech);
    if (merged.category) params.set('category', merged.category);
    if (merged.q) params.set('q', merged.q);
    const query = params.toString();
    const url = query ? `/projects?${query}` : '/projects';
    if (options?.replace) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  }

  // Debounce the name search so it filters as you type instead of needing
  // Enter/submit — one navigation per pause in typing, not per keystroke.
  // Uses replace (not push) so typing doesn't fill up browser history.
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    const trimmed = value.trim();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      go({ q: trimmed || undefined }, { replace: true });
    }, 250);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Search projects by name</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search projects by name…"
            defaultValue={activeQuery ?? ''}
            className="field-control min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] py-3 pr-4 pl-10 text-[var(--color-text)]"
            onChange={(event) => handleSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
              const value = (event.target as HTMLInputElement).value.trim();
              go({ q: value || undefined }, { replace: true });
            }}
          />
        </label>
        <p
          className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-subtle)] uppercase"
          role="status"
        >
          {hasFilter ? `${resultCount} of ${totalCount}` : `${totalCount} projects`}
        </p>
      </div>

      <div>
        <p className="font-mono-label mb-2.5 text-[var(--color-text-subtle)]">Discipline</p>
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              className={cn(
                'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] [@media(hover:hover)]:hover:-translate-y-px',
                !activeCategory &&
                  'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
              )}
              onClick={() => go({ category: undefined })}
              aria-pressed={!activeCategory}
            >
              <Badge tone={!activeCategory ? 'brand' : 'mono'}>All</Badge>
            </button>
          </li>
          {categories.map((category) => {
            const isActive = activeCategory?.toLowerCase() === category.toLowerCase();
            return (
              <li key={category}>
                <button
                  type="button"
                  className={cn(
                    'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] [@media(hover:hover)]:hover:-translate-y-px',
                    isActive &&
                      'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
                  )}
                  onClick={() => go({ category: isActive ? undefined : category })}
                  aria-pressed={isActive}
                >
                  <Badge tone={isActive ? 'brand' : 'mono'}>{category}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="font-mono-label mb-2.5 text-[var(--color-text-subtle)]">Stack</p>
        <ul className="flex flex-wrap gap-2">
          {topTechs.map((tech) => {
            const isActive = activeTech?.toLowerCase() === tech.toLowerCase();
            return (
              <li key={tech}>
                <button
                  type="button"
                  className={cn(
                    'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] [@media(hover:hover)]:hover:-translate-y-px',
                    isActive &&
                      'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
                  )}
                  onClick={() => go({ tech: isActive ? undefined : tech })}
                  aria-pressed={isActive}
                >
                  <Badge tone={isActive ? 'brand' : 'mono'}>{tech}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
