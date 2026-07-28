import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { renderContentText } from '@/lib/content-text';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <Card
      as="article"
      interactive
      className={cn('group relative flex h-full flex-col overflow-hidden p-0', className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-sunken)]">
        <Image
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          className="h-full w-full object-cover transition-transform duration-[var(--duration-large)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-raised)] via-transparent to-transparent opacity-80"
          aria-hidden
        />
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)]/90 text-[var(--color-brand)] opacity-0 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-[opacity,transform] duration-[var(--duration-standard)] group-hover:translate-y-0 group-hover:opacity-100 translate-y-1">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.confidential ? <Badge tone="muted">Confidential</Badge> : null}
          <Badge tone="brand">{project.status}</Badge>
        </div>
        <h3 className="text-[length:var(--text-h3)]">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            <span className="relative z-10">{renderContentText(project.title)}</span>
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[var(--color-text-muted)]">{project.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
        <p className="relative z-10 mt-5 inline-flex items-center gap-1 text-[var(--text-sm)] font-medium text-[var(--color-brand)]">
          Read case study
          <span
            className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </p>
      </div>
    </Card>
  );
}
