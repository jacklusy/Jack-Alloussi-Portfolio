import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Code2, ExternalLink } from 'lucide-react';
import type { Project } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { TiltCard } from '@/components/motion/TiltCard';
import { ProjectCover } from '@/components/features/projects/ProjectCover';
import { isUsableHref, renderContentText } from '@/lib/content-text';
import { cn } from '@/lib/utils';

export type ProjectCardProps = {
  project: Project;
  className?: string;
  /**
   * `feature` is the tall homepage treatment; `compact` is for the dense
   * catalog grid, where a dozen full-height cards is a lot of scrolling.
   */
  variant?: 'feature' | 'compact';
};

export function ProjectCard({ project, className, variant = 'feature' }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const repo = project.links.repo;
  const live = project.links.live;
  const isCompact = variant === 'compact';
  const techLimit = isCompact ? 3 : 4;
  const overflow = project.technologies.length - techLimit;

  return (
    // Tilt is a per-card pointer listener; not worth it across a dense grid.
    <TiltCard className="h-full" enabled={!isCompact} maxTilt={6}>
      <Card
        as="article"
        interactive
        className={cn(
          'group relative flex h-full flex-col overflow-hidden !p-0',
          isCompact ? 'min-h-[24rem]' : 'min-h-[29rem] sm:min-h-[31rem]',
          className,
        )}
      >
        <div
          className={cn(
            'relative w-full shrink-0 overflow-hidden bg-[var(--color-surface-sunken)]',
            isCompact ? 'aspect-[16/9]' : 'aspect-[16/10]',
          )}
        >
          <div className="absolute inset-0 transition-transform duration-[var(--duration-large)] ease-[var(--ease-out)] group-hover:scale-[1.03]">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail.image}
                alt={project.thumbnail.alt}
                placeholder="blur"
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <ProjectCover project={project} />
            )}
          </div>

          {project.group ? (
            <span className="absolute top-3 left-3 z-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/85 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              {project.group.label}
            </span>
          ) : null}

          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-surface-raised)] to-transparent"
            aria-hidden
          />
        </div>

        <div className={cn('flex min-h-0 flex-1 flex-col', isCompact ? 'p-5' : 'p-5 sm:p-6')}>
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <h3
              className={cn(
                'line-clamp-2 font-[family-name:var(--font-syne)] tracking-tight',
                isCompact ? 'text-[1.0625rem]' : 'text-[length:var(--text-h3)]',
              )}
            >
              <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
                <span className="relative z-10">{renderContentText(project.title)}</span>
              </Link>
            </h3>
            <Badge tone="mono" className="relative z-10 shrink-0">
              {project.status}
            </Badge>
          </div>

          <p
            className={cn(
              'flex-1 text-[var(--text-sm)] leading-relaxed text-[var(--color-text-muted)]',
              isCompact ? 'line-clamp-3' : 'line-clamp-4',
            )}
          >
            {project.summary}
          </p>

          {!isCompact && project.metrics?.length ? (
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-4">
              {project.metrics.slice(0, 3).map((metric) => (
                <div key={metric.label} className="min-w-0">
                  <dt className="truncate font-mono text-[9px] tracking-[0.12em] text-[var(--color-text-subtle)] uppercase">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 truncate text-[var(--text-sm)] font-medium text-[var(--color-text)]">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, techLimit).map((tech) => (
              <li key={tech}>
                <Badge tone="mono">{tech}</Badge>
              </li>
            ))}
            {overflow > 0 ? (
              <li>
                <Badge tone="muted">{`+${overflow}`}</Badge>
              </li>
            ) : null}
          </ul>

          <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3.5">
            <span className="inline-flex items-center gap-1 text-[var(--text-sm)] font-medium text-[var(--color-brand)]">
              Case study
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
            <span className="flex items-center gap-1">
              {live && isUsableHref(live) ? (
                <a
                  href={live}
                  className="relative z-20 inline-flex min-h-10 min-w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-brand)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)]"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`Live site for ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
              {repo && isUsableHref(repo) ? (
                <a
                  href={repo}
                  className="relative z-20 inline-flex min-h-10 min-w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-brand)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)]"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`Repository for ${project.title}`}
                >
                  <Code2 className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </span>
          </div>
        </div>
      </Card>
    </TiltCard>
  );
}
