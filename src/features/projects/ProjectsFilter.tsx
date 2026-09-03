'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getProjectCategories, getTopTechnologies } from '@/content/projects';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// Derived from the catalog rather than hardcoded, so the chips stay honest
// as projects are added.
const categories = getProjectCategories();
const topTechs = getTopTechnologies(8);

export type ProjectsFilterProps = {
  activeTech?: string | undefined;
  activeCategory?: string | undefined;
  resultCount: number;
  totalCount: number;
};

export function ProjectsFilter({
  activeTech,
  activeCategory,
  resultCount,
  totalCount,
}: ProjectsFilterProps) {
  const router = useRouter();
  const hasFilter = Boolean(activeTech || activeCategory);

  function go(next: { tech?: string; category?: string }) {
    const params = new URLSearchParams();
    if (next.tech) params.set('tech', next.tech);
    if (next.category) params.set('category', next.category);
    const query = params.toString();
    router.push(query ? `/projects?${query}` : '/projects');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Filter by technology</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Filter by tech (NestJS, React Native…)"
            defaultValue={activeTech ?? ''}
            className="field-control min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] py-3 pr-4 pl-10 text-[var(--color-text)]"
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              const value = (event.target as HTMLInputElement).value.trim();
              go(value ? { tech: value } : {});
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
            <Link
              href="/projects"
              className={cn(
                'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] [@media(hover:hover)]:hover:-translate-y-px',
                !hasFilter && 'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
              )}
            >
              <Badge tone={!hasFilter ? 'brand' : 'mono'}>All</Badge>
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = activeCategory?.toLowerCase() === category.toLowerCase();
            return (
              <li key={category}>
                <button
                  type="button"
                  className={cn(
                    'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] [@media(hover:hover)]:hover:-translate-y-px',
                    isActive && 'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
                  )}
                  onClick={() => go(isActive ? {} : { category })}
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
                    isActive && 'ring-2 ring-[var(--color-focus)] ring-offset-2 ring-offset-[var(--color-bg)]',
                  )}
                  onClick={() => go(isActive ? {} : { tech })}
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
