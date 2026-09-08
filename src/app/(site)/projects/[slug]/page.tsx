import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Code2, ExternalLink } from 'lucide-react';
import { getAllProjectSlugs, getProjectBySlug, projects } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { ProjectCover } from '@/components/features/projects/ProjectCover';
import { isUsableHref, renderContentText } from '@/lib/content-text';
import { breadcrumbJsonLd, projectJsonLd } from '@/lib/schema';
import { siteConfig } from '@/config/site';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };

  const title = project.title.replace(/\{\{NEEDS_INPUT:[^}]+\}\}/g, '').trim() || 'Project';

  return {
    title,
    description: project.summary,
    keywords: project.technologies,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      title: `${title} — Jack Alloussi`,
      description: project.summary,
      url: `${siteConfig.url}/projects/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Jack Alloussi`,
      description: project.summary,
    },
  };
}

const TOC = [
  ['problem', '01', 'The problem'],
  ['approach', '02', 'Approach'],
  ['architecture', '03', 'Architecture'],
  ['decisions', '04', 'Decisions'],
  ['outcomes', '05', 'Outcome'],
  ['retrospective', '06', 'Retrospective'],
  ['stack', '07', 'Stack'],
  ['interface', '08', 'Interface'],
] as const;

function SectionHeading({ index, title, id }: { index: string; title: string; id: string }) {
  return (
    <h2
      id={`${id}-heading`}
      className="flex items-baseline gap-4 text-[length:var(--text-h2)] tracking-[var(--tracking-heading)] text-[var(--color-text)]"
    >
      <span
        className="font-mono text-[0.75em] font-normal text-[var(--color-brand)] tabular-nums"
        aria-hidden
      >
        {index}
      </span>
      <span>{title}</span>
    </h2>
  );
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined;
  const category = project.categories[0] ?? project.kind;
  const liveHref =
    project.links.live && isUsableHref(project.links.live) ? project.links.live : undefined;
  const repoHref =
    project.links.repo && isUsableHref(project.links.repo) ? project.links.repo : undefined;

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <article className="pb-[var(--section-y)]">
      <Container className="pt-10 md:pt-14">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/projects" className="transition-colors hover:text-[var(--color-brand)]">
                Projects
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[var(--color-text)]">{renderContentText(project.title)}</li>
          </ol>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="font-mono-label text-[var(--color-brand)]">
            {category} — {renderContentText(project.timeframe)}
            {project.group ? ` — ${project.group.label}` : ''}
          </p>
          <h1 className="mt-3 text-[length:var(--text-h1)] tracking-[var(--tracking-display)]">
            {renderContentText(project.title)}
          </h1>
          <p className="mt-5 max-w-[var(--prose-max)] text-[length:var(--text-lead)] leading-relaxed text-[var(--color-text-muted)]">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.confidential ? <Badge tone="muted">Confidential client work</Badge> : null}
            <Badge tone="brand">{project.status}</Badge>
            <Badge tone="mono">{project.role}</Badge>
            {project.kind === 'training' ? <Badge tone="muted">Training project</Badge> : null}
          </div>

          {/* Above the fold on purpose. These were previously the last thing on
              the page, below the whole case study, where nobody found them. */}
          {liveHref || repoHref ? (
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-3">
                {liveHref ? (
                  <ButtonLink href={liveHref} variant="primary" external>
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Visit live site
                  </ButtonLink>
                ) : null}
                {repoHref ? (
                  <ButtonLink href={repoHref} variant="secondary" external>
                    <Code2 className="h-4 w-4" aria-hidden />
                    View source
                  </ButtonLink>
                ) : null}
              </div>
              {liveHref && project.links.liveNote ? (
                <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                  {project.links.liveNote}{' '}
                  <Link href="/contact" className="text-[var(--color-brand)] hover:underline">
                    Get in touch
                  </Link>
                  .
                </p>
              ) : null}
              {liveHref && project.links.demoAccounts?.length ? (
                <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <p className="font-mono-label border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[var(--color-text-subtle)]">
                    Demo access
                  </p>
                  <ul className="divide-y divide-[var(--color-border)]">
                    {project.links.demoAccounts.map((account) => (
                      <li
                        key={account.identifier}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 text-[var(--text-sm)]"
                      >
                        <span className="font-medium text-[var(--color-text)]">
                          {account.role}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[var(--text-xs)] text-[var(--color-text-muted)]">
                          <span>{account.identifier}</span>
                          <span aria-hidden>·</span>
                          <span>{account.password}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        {project.metrics?.length ? (
          <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-[var(--color-surface)] p-5">
                <dt className="font-mono text-[10px] tracking-[var(--tracking-label)] text-[var(--color-text-subtle)] uppercase">
                  {metric.label}
                </dt>
                <dd className="mt-2 font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--color-text)]">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* A screenshot keeps its own aspect ratio so nothing is cropped out of
            the frame; the generated cover is drawn to fill whatever box it is
            given, so it takes the wider one. */}
        <figure className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail.image}
              alt={project.thumbnail.alt}
              placeholder="blur"
              className="h-auto w-full"
              sizes="(max-width: 1280px) 100vw, 1200px"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div className="aspect-[16/7] w-full">
              <ProjectCover project={project} />
            </div>
          )}
        </figure>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              {project.hasCaseStudy ? (
                <nav aria-label="On this page">
                  <p className="font-mono-label mb-3 text-[var(--color-text-subtle)]">Contents</p>
                  <ul className="space-y-2">
                    {TOC.filter(([id]) => {
                      if (id === 'stack') return Boolean(project.caseStudy.stackDetail?.length);
                      if (id === 'interface') return Boolean(project.gallery?.length);
                      return true;
                    }).map(([id, num, label]) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="group flex items-baseline gap-2 font-mono text-[11px] tracking-wide text-[var(--color-text-muted)] uppercase transition-colors hover:text-[var(--color-brand)]"
                        >
                          <span className="text-[var(--color-text-subtle)] tabular-nums group-hover:text-[var(--color-brand)]">
                            {num}
                          </span>
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <div>
                <p className="font-mono-label mb-3 text-[var(--color-text-subtle)]">Stack</p>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge tone="mono">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <ButtonLink href="/contact" variant="primary" className="w-full">
                Discuss this work
              </ButtonLink>
            </div>
          </aside>

          <div className="space-y-16 text-[var(--color-text-muted)] lg:col-span-9">
            <p className="prose-width text-[length:var(--text-body-lg)] leading-relaxed">
              {project.description}
            </p>

            {project.hasCaseStudy ? (
              <>
                <section id="problem" className="scroll-mt-28" aria-labelledby="problem-heading">
                  <SectionHeading id="problem" index="01" title="The problem" />
                  <p className="prose-width mt-5 leading-relaxed">{project.caseStudy.context}</p>
                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    <Card variant="panel" className="border-l-2 border-l-[var(--color-danger)]">
                      <p className="font-mono-label text-[var(--color-danger)]">Challenge</p>
                      <p className="mt-3 leading-relaxed">{project.caseStudy.problem}</p>
                    </Card>
                    <Card variant="panel" className="border-l-2 border-l-[var(--color-brand)]">
                      <p className="font-mono-label text-[var(--color-brand)]">Approach</p>
                      <p className="mt-3 leading-relaxed">{project.caseStudy.approach}</p>
                    </Card>
                  </div>
                </section>

                <section id="approach" className="scroll-mt-28" aria-labelledby="approach-heading">
                  <SectionHeading id="approach" index="02" title="Technical approach" />
                  <p className="prose-width mt-5 leading-relaxed">{project.caseStudy.approach}</p>
                  <p className="font-mono-label mt-8 mb-3 text-[var(--color-text-subtle)]">
                    Hard parts
                  </p>
                  <ul className="prose-width space-y-3">
                    {project.caseStudy.challenges.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed">
                        <span
                          className="mt-2.5 h-1 w-4 shrink-0 rounded-full bg-[var(--color-accent)]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  id="architecture"
                  className="scroll-mt-28"
                  aria-labelledby="architecture-heading"
                >
                  <SectionHeading id="architecture" index="03" title="Architecture" />
                  <Card variant="panel" className="mt-5">
                    <p className="leading-relaxed">{project.caseStudy.architecture.altText}</p>
                  </Card>
                </section>

                <section id="decisions" className="scroll-mt-28" aria-labelledby="decisions-heading">
                  <SectionHeading id="decisions" index="04" title="Decisions & tradeoffs" />
                  <ul className="mt-7 space-y-5">
                    {project.caseStudy.decisions.map((decision, i) => (
                      <li key={decision.decision}>
                        <Card variant="panel" className="relative overflow-hidden">
                          <span
                            className="absolute top-5 right-5 font-mono text-3xl text-[var(--color-text-subtle)] opacity-25 tabular-nums"
                            aria-hidden
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="max-w-[52ch] font-[family-name:var(--font-syne)] text-[length:var(--text-body-lg)] font-semibold text-[var(--color-text)]">
                            {decision.decision}
                          </p>
                          <dl className="mt-4 space-y-3 text-[var(--text-sm)]">
                            <div>
                              <dt className="font-mono-label text-[var(--color-text-subtle)]">
                                Instead of
                              </dt>
                              <dd className="mt-1">{decision.alternatives}</dd>
                            </div>
                            <div>
                              <dt className="font-mono-label text-[var(--color-text-subtle)]">
                                Why
                              </dt>
                              <dd className="mt-1 leading-relaxed">{decision.reasoning}</dd>
                            </div>
                            <div>
                              <dt className="font-mono-label text-[var(--color-accent)]">
                                Tradeoff
                              </dt>
                              <dd className="mt-1 leading-relaxed">
                                {renderContentText(decision.tradeoff)}
                              </dd>
                            </div>
                          </dl>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="outcomes" className="scroll-mt-28" aria-labelledby="outcomes-heading">
                  <SectionHeading id="outcomes" index="05" title="Outcome" />
                  <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                    {project.caseStudy.outcomes.map((item) => (
                      <li key={item}>
                        <Card variant="panel" className="h-full">
                          <p className="leading-relaxed text-[var(--color-text)]">
                            {renderContentText(item)}
                          </p>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  id="retrospective"
                  className="scroll-mt-28"
                  aria-labelledby="retrospective-heading"
                >
                  <SectionHeading id="retrospective" index="06" title="What I would do differently" />
                  <Card
                    variant="panel"
                    className="mt-5 border-l-2 border-l-[var(--color-accent)]"
                  >
                    <p className="prose-width leading-relaxed">{project.caseStudy.retrospective}</p>
                  </Card>
                </section>

                {project.caseStudy.stackDetail?.length ? (
                  <section id="stack" className="scroll-mt-28" aria-labelledby="stack-heading">
                    <SectionHeading id="stack" index="07" title="Stack in detail" />
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      {project.caseStudy.stackDetail.map((group) => (
                        <Card key={group.category} variant="panel" className="h-full">
                          <p className="font-mono-label text-[var(--color-brand)]">
                            {group.category}
                          </p>
                          <ul className="mt-3 space-y-1.5 text-[var(--text-sm)]">
                            {group.items.map((item) => (
                              <li key={item} className="flex gap-2.5">
                                <span
                                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-subtle)]"
                                  aria-hidden
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            ) : (
              <Card variant="panel">
                <p>Summary project — full case study pending publishable detail.</p>
              </Card>
            )}

            {project.gallery?.length ? (
              <section id="interface" className="scroll-mt-28" aria-labelledby="interface-heading">
                <SectionHeading id="interface" index="08" title="Interface" />
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  {project.gallery.map((shot) => (
                    <figure key={shot.image.src} className="min-w-0">
                      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
                        <Image
                          src={shot.image}
                          alt={shot.alt}
                          placeholder="blur"
                          className="h-auto w-full"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {shot.caption ? (
                        <figcaption className="mt-3 text-[var(--text-sm)] leading-relaxed">
                          {shot.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        <nav
          className="mt-16 grid gap-4 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2"
          aria-label="Adjacent projects"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-brand)]/40"
            >
              <p className="font-mono-label text-[var(--color-text-subtle)]">Previous</p>
              <p className="mt-2 text-[var(--color-text)]">{renderContentText(prev.title)}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-right transition-colors hover:border-[var(--color-brand)]/40 sm:col-start-2"
            >
              <p className="font-mono-label text-[var(--color-text-subtle)]">Next</p>
              <p className="mt-2 text-[var(--color-text)]">{renderContentText(next.title)}</p>
            </Link>
          ) : null}
        </nav>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </article>
  );
}
