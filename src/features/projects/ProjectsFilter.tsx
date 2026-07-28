'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { projects } from '@/content/projects';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const allTechs = Array.from(new Set(projects.flatMap((project) => project.technologies))).sort(
  (a, b) => a.localeCompare(b),
);

const featuredChips = ['TypeScript', 'NestJS', 'React', 'Docker', 'PostgreSQL'].filter((tech) =>
  allTechs.some((t) => t.toLowerCase() === tech.toLowerCase()),
);

export type ProjectsFilterProps = {
  activeTech?: string | undefined;
};

export function ProjectsFilter({ activeTech }: ProjectsFilterProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <label className="relative block max-w-md">
        <span className="sr-only">Filter by technology</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Filter by tech (NestJS, Docker…)"
          defaultValue={activeTech ?? ''}
          className="field-control min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] py-3 pr-4 pl-10 text-[var(--color-text)]"
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            const value = (event.target as HTMLInputElement).value.trim();
            router.push(value ? `/projects?tech=${encodeURIComponent(value)}` : '/projects');
          }}
        />
      </label>

      <label className="block md:hidden">
        <span className="sr-only">Technology filter</span>
        <select
          className="field-control min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 text-[var(--color-text)]"
          value={activeTech ?? ''}
          onChange={(event) => {
            const value = event.target.value;
            router.push(value ? `/projects?tech=${encodeURIComponent(value)}` : '/projects');
          }}
        >
          <option value="">All technologies</option>
          {allTechs.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </label>

      <ul className="hidden flex-wrap gap-2 md:flex">
        <li>
          <Link
            href="/projects"
            className={cn(
              'inline-flex min-h-10 items-center rounded-[var(--radius-sm)]',
              !activeTech && 'ring-2 ring-[var(--color-focus)]',
            )}
          >
            <Badge tone={!activeTech ? 'brand' : 'mono'}>All</Badge>
          </Link>
        </li>
        {(featuredChips.length > 0 ? featuredChips : allTechs.slice(0, 6)).map((tech) => {
          const isActive = activeTech?.toLowerCase() === tech.toLowerCase();
          return (
            <li key={tech}>
              <button
                type="button"
                className={cn(
                  'inline-flex min-h-10 items-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-micro)] hover:scale-[1.03]',
                  isActive && 'ring-2 ring-[var(--color-focus)]',
                )}
                onClick={() => router.push(`/projects?tech=${encodeURIComponent(tech)}`)}
                aria-pressed={isActive}
              >
                <Badge tone={isActive ? 'brand' : 'mono'}>{tech}</Badge>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
