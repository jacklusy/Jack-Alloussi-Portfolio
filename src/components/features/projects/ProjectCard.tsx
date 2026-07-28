import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { renderContentText } from '@/lib/content-text';
import { cn } from '@/lib/utils';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <Card as="article" className={cn('group relative flex h-full flex-col', className)}>
      <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)]">
        <Image
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          className="h-full w-full object-cover transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {project.confidential ? <Badge tone="muted">Confidential client work</Badge> : null}
        <Badge tone="brand">{project.status}</Badge>
      </div>
      <h3 className="text-[length:var(--text-h3)]">
        <Link
          href={href}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
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
      <p className="relative z-10 mt-5 text-[var(--text-sm)] font-medium text-[var(--color-brand)]">
        Read case study →
      </p>
    </Card>
  );
}
