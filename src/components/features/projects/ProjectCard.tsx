import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import type { Project } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { TiltCard } from '@/components/motion/TiltCard';
import { isUsableHref, renderContentText } from '@/lib/content-text';
import { cn } from '@/lib/utils';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const repo = project.links.repo;

  return (
    <TiltCard className="h-full">
      <Card
        as="article"
        interactive
        className={cn(
          'group relative flex h-full min-h-[30rem] flex-col overflow-hidden !p-0 sm:min-h-[32rem]',
          className,
        )}
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-surface-sunken)]">
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            width={project.thumbnail.width}
            height={project.thumbnail.height}
            className="h-full w-full object-cover transition-transform duration-[var(--duration-large)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-raised)] via-transparent to-transparent opacity-90"
            aria-hidden
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 min-h-[2.6em] text-[length:var(--text-h3)]">
              <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
                <span className="relative z-10">{renderContentText(project.title)}</span>
              </Link>
            </h3>
            <Badge tone="mono" className="relative z-10 shrink-0">
              {project.status}
            </Badge>
          </div>

          <p className="line-clamp-3 flex-1 text-[var(--color-text-muted)]">{project.summary}</p>

          <ul className="mt-4 flex min-h-[2.25rem] flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Badge tone="mono">{tech}</Badge>
              </li>
            ))}
          </ul>

          <div className="relative z-10 mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <span className="inline-flex items-center gap-1 text-[var(--text-sm)] font-medium text-[var(--color-brand)]">
              Case study
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
            {repo && isUsableHref(repo) ? (
              <a
                href={repo}
                className="relative z-20 inline-flex min-h-10 min-w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                rel="noopener noreferrer"
                target="_blank"
                aria-label={`Repository for ${project.title}`}
              >
                <Code2 className="h-4 w-4" aria-hidden />
              </a>
            ) : (
              <span className="text-[var(--color-text-subtle)]" aria-hidden>
                <Code2 className="h-4 w-4 opacity-40" />
              </span>
            )}
          </div>
        </div>
      </Card>
    </TiltCard>
  );
}
