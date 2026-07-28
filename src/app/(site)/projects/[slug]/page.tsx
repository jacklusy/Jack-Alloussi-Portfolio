import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjectSlugs, getProjectBySlug, projects } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { ArchitectureDiagram } from '@/components/features/projects/ArchitectureDiagram';
import { isUsableHref, renderContentText } from '@/lib/content-text';
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

  return {
    title: project.title.replace(/\{\{NEEDS_INPUT:[^}]+\}\}/g, '').trim() || 'Project',
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${siteConfig.url}/projects/${slug}`,
    },
  };
}

const TOC = [
  ['problem', '01 The problem'],
  ['approach', '02 Approach'],
  ['architecture', '03 Architecture'],
  ['decisions', '04 Decisions'],
  ['outcomes', '05 Outcome'],
  ['retrospective', '06 Retrospective'],
] as const;

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined;
  const category = project.categories[0] ?? project.kind;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    author: { '@type': 'Person', name: 'Jack Alloussi' },
    keywords: project.technologies.join(', '),
  };

  return (
    <article className="pb-[var(--section-y)]">
      <Container className="pt-10 md:pt-14">
        <nav aria-label="Breadcrumb" className="font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-[var(--color-brand)]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/projects" className="hover:text-[var(--color-brand)]">
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
          </p>
          <h1 className="mt-3 text-[length:var(--text-h1)] tracking-tight">
            {renderContentText(project.title)}
          </h1>
          <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
            {project.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.confidential ? <Badge tone="muted">Confidential client work</Badge> : null}
            <Badge tone="brand">{project.status}</Badge>
            <Badge tone="mono">{project.role}</Badge>
          </div>
        </header>

        {project.hasCaseStudy ? (
          <div className="mt-10">
            <ArchitectureDiagram
              diagramId={project.caseStudy.architecture.diagramId}
              altText={project.caseStudy.architecture.altText}
            />
          </div>
        ) : null}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              {project.hasCaseStudy ? (
                <nav aria-label="On this page">
                  <p className="font-mono-label mb-3 text-[var(--color-text-subtle)]">Contents</p>
                  <ul className="space-y-2">
                    {TOC.map(([id, label]) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="font-mono text-[11px] tracking-wide text-[var(--color-text-muted)] uppercase transition-colors hover:text-[var(--color-brand)]"
                        >
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

          <div className="space-y-14 text-[var(--color-text-muted)] lg:col-span-9">
            <p className="prose-width text-[length:var(--text-body-lg)]">{project.description}</p>

            {project.hasCaseStudy ? (
              <>
                <section id="problem" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    01 · The problem
                  </h2>
                  <p className="prose-width mt-4">{project.caseStudy.context}</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Card variant="panel" className="border-l-2 border-l-[var(--color-danger)]">
                      <p className="font-mono-label text-[var(--color-danger)]">Challenge</p>
                      <p className="mt-3 text-[var(--color-text-muted)]">{project.caseStudy.problem}</p>
                    </Card>
                    <Card variant="panel" className="border-l-2 border-l-[var(--color-brand)]">
                      <p className="font-mono-label text-[var(--color-brand)]">Goal</p>
                      <p className="mt-3 text-[var(--color-text-muted)]">{project.caseStudy.approach}</p>
                    </Card>
                  </div>
                </section>

                <section id="approach" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    02 · Technical approach
                  </h2>
                  <p className="prose-width mt-4">{project.caseStudy.approach}</p>
                  <ul className="prose-width mt-4 list-disc space-y-2 pl-5">
                    {project.caseStudy.challenges.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section id="architecture" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    03 · Architecture
                  </h2>
                  <p className="prose-width mt-4">{project.caseStudy.architecture.altText}</p>
                </section>

                <section id="decisions" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    04 · Key decisions & tradeoffs
                  </h2>
                  <ul className="mt-6 space-y-5">
                    {project.caseStudy.decisions.map((decision) => (
                      <li key={decision.decision}>
                        <Card variant="panel">
                          <blockquote className="text-[length:var(--text-body-lg)] text-[var(--color-text)]">
                            Chose {decision.decision}
                          </blockquote>
                          <p className="mt-3">
                            <span className="font-medium text-[var(--color-text)]">Over:</span>{' '}
                            {decision.alternatives}
                          </p>
                          <p className="mt-2">{decision.reasoning}</p>
                          <p className="mt-2 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                            Tradeoff: {renderContentText(decision.tradeoff)}
                          </p>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="outcomes" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    05 · Outcome
                  </h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.caseStudy.outcomes.map((item) => (
                      <li key={item}>
                        <Card variant="panel" className="h-full">
                          <p className="text-[var(--color-text)]">{renderContentText(item)}</p>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="retrospective" className="scroll-mt-28">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    06 · What I would do differently
                  </h2>
                  <Card variant="panel" className="mt-4">
                    <p className="prose-width">{project.caseStudy.retrospective}</p>
                  </Card>
                </section>
              </>
            ) : (
              <Card variant="panel">
                <p>
                  Summary project — full case study pending publishable detail. Placeholders are
                  tracked in content gaps.
                </p>
              </Card>
            )}

            <section id="links" className="scroll-mt-28">
              <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Links</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {project.links.live && isUsableHref(project.links.live) ? (
                  <li>
                    <ButtonLink href={project.links.live} variant="secondary" external>
                      Live demo
                    </ButtonLink>
                  </li>
                ) : project.links.live ? (
                  <li className="text-[var(--text-sm)]">{renderContentText(project.links.live)}</li>
                ) : null}
                {project.links.repo && isUsableHref(project.links.repo) ? (
                  <li>
                    <ButtonLink href={project.links.repo} variant="secondary" external>
                      Repository
                    </ButtonLink>
                  </li>
                ) : project.links.repo ? (
                  <li className="text-[var(--text-sm)]">{renderContentText(project.links.repo)}</li>
                ) : null}
              </ul>
            </section>
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
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-right transition-colors hover:border-[var(--color-brand)]/40"
            >
              <p className="font-mono-label text-[var(--color-text-subtle)]">Next</p>
              <p className="mt-2 text-[var(--color-text)]">{renderContentText(next.title)}</p>
            </Link>
          ) : null}
        </nav>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
