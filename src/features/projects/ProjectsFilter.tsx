'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { projects } from '@/content/projects';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const allTechs = Array.from(
  new Set(projects.flatMap((project) => project.technologies)),
).sort((a, b) => a.localeCompare(b));

export type ProjectsFilterProps = {
  activeTech?: string | undefined;
};

export function ProjectsFilter({ activeTech }: ProjectsFilterProps) {
  const router = useRouter();

  return (
    <div>
      <p className="font-mono-label mb-3 text-[var(--color-text-subtle)]">Filter by technology</p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projects"
            className={cn(
              'inline-flex min-h-11 items-center',
              !activeTech && 'ring-2 ring-[var(--color-focus)] rounded-[var(--radius-sm)]',
            )}
          >
            <Badge tone={!activeTech ? 'brand' : 'default'}>All</Badge>
          </Link>
        </li>
        {allTechs.map((tech) => {
          const isActive = activeTech?.toLowerCase() === tech.toLowerCase();
          return (
            <li key={tech}>
              <button
                type="button"
                className={cn(
                  'inline-flex min-h-11 items-center',
                  isActive && 'ring-2 ring-[var(--color-focus)] rounded-[var(--radius-sm)]',
                )}
                onClick={() => router.push(`/projects?tech=${encodeURIComponent(tech)}`)}
                aria-pressed={isActive}
              >
                <Badge tone={isActive ? 'brand' : 'default'}>{tech}</Badge>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
