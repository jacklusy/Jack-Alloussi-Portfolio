import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Project } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { DirIcon } from '@/components/ui/DirIcon';
import { ProjectCover } from '@/components/features/projects/ProjectCover';
import { ScrollParallax } from '@/components/motion/ScrollParallax';
import { renderContentText } from '@/lib/content-text';

export type FeaturedProjectPanelProps = {
  project: Project;
  /** 1-based position in the deck, shown as `01`. */
  position: number;
  total: number;
};

/**
 * Large "case file" card for the homepage deck: story on one side, the product
 * on the other. The screenshot sits in a frame and drifts slightly inside it as
 * the page scrolls.
 */
export async function FeaturedProjectPanel({ project, position, total }: FeaturedProjectPanelProps) {
  const [t, tStatus] = await Promise.all([
    getTranslations('projectCard'),
    getTranslations('labels.status'),
  ]);

  return (
    <article className="relative grid overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-lg)] md:grid-cols-12">
      <div className="flex flex-col p-6 sm:p-8 md:col-span-6 lg:p-9">
        <div className="flex items-center justify-between gap-3">
          <p dir="ltr" className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-text-subtle)] tabular-nums">
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <Badge tone="mono">{tStatus(project.status)}</Badge>
        </div>

        <h3 className="mt-5 font-[family-name:var(--font-syne)] text-[length:var(--text-h2)] leading-[1.1] tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            <span className="relative z-10">{renderContentText(project.title)}</span>
          </Link>
        </h3>

        <p className="mt-4 line-clamp-4 text-[var(--color-text-muted)]">{project.summary}</p>

        {project.metrics?.length ? (
          <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-5 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            {project.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} className="min-w-0">
                <dd className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">
                  <bdi>{metric.value}</bdi>
                </dd>
                <dt className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[var(--color-text-subtle)] uppercase">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Badge tone="mono">{tech}</Badge>
            </li>
          ))}
        </ul>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[var(--text-sm)] font-medium text-[var(--color-brand)]">
          {t('caseStudy')}
          <DirIcon icon={ArrowUpRight} className="h-4 w-4" />
        </span>
      </div>

      <div className="relative order-first min-h-64 overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-sunken)] md:order-none md:col-span-6 md:min-h-[26rem] md:border-b-0 md:border-s">
        <ScrollParallax distance={28} className="absolute inset-x-0 -inset-y-8">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail.image}
              alt={project.thumbnail.alt}
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 55vw"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <ProjectCover project={project} />
          )}
        </ScrollParallax>
      </div>
    </article>
  );
}
