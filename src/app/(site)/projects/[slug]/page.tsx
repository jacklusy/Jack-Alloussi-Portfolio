import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjectSlugs, getProjectBySlug, projects } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ArchitectureDiagram } from '@/components/features/projects/ArchitectureDiagram';
import { renderContentText, isUsableHref } from '@/lib/content-text';
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

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    author: { '@type': 'Person', name: 'Jack Alloussi' },
    keywords: project.technologies.join(', '),
  };

  return (
    <article className="py-16 md:py-24">
      <Container>
        <nav aria-label="Breadcrumb" className="text-[var(--text-sm)] text-[var(--color-text-subtle)]">
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

        <header className="mt-8 max-w-[var(--prose-max)]">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.confidential ? <Badge tone="muted">Confidential client work</Badge> : null}
            <Badge tone="brand">{project.status}</Badge>
            <Badge>{project.kind}</Badge>
          </div>
          <h1 className="text-[length:var(--text-h1)]">{renderContentText(project.title)}</h1>
          <p className="mt-4 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
            {project.summary}
          </p>
          <p className="mt-3 font-mono text-[var(--text-sm)] text-[var(--color-text-subtle)]">
            {project.role} · {renderContentText(project.timeframe)}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="prose-width space-y-10 text-[var(--color-text-muted)] lg:col-span-8">
            <p>{project.description}</p>

            {project.hasCaseStudy ? (
              <>
                <section id="context" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Context</h2>
                  <p className="mt-4">{project.caseStudy.context}</p>
                </section>
                <section id="problem" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">The problem</h2>
                  <p className="mt-4">{project.caseStudy.problem}</p>
                </section>
                <section id="approach" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Approach</h2>
                  <p className="mt-4">{project.caseStudy.approach}</p>
                </section>
                <section id="architecture" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Architecture</h2>
                  <div className="mt-6">
                    <ArchitectureDiagram
                      diagramId={project.caseStudy.architecture.diagramId}
                      altText={project.caseStudy.architecture.altText}
                    />
                  </div>
                </section>
                <section id="decisions" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    Decisions & tradeoffs
                  </h2>
                  <ul className="mt-6 space-y-6">
                    {project.caseStudy.decisions.map((decision) => (
                      <li
                        key={decision.decision}
                        className="border-l-2 border-[var(--color-brand)] pl-4"
                      >
                        <blockquote className="text-[length:var(--text-body-lg)] text-[var(--color-text)]">
                          Chose {decision.decision}
                        </blockquote>
                        <p className="mt-2">
                          <span className="font-medium text-[var(--color-text)]">Over:</span>{' '}
                          {decision.alternatives}
                        </p>
                        <p className="mt-2">{decision.reasoning}</p>
                        <p className="mt-2 text-[var(--text-sm)]">
                          Tradeoff: {renderContentText(decision.tradeoff)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section id="challenges" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Challenges</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {project.caseStudy.challenges.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section id="outcomes" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">Outcome</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {project.caseStudy.outcomes.map((item) => (
                      <li key={item}>{renderContentText(item)}</li>
                    ))}
                  </ul>
                </section>
                <section id="retrospective" className="scroll-mt-24">
                  <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
                    What I would do differently
                  </h2>
                  <p className="mt-4">{project.caseStudy.retrospective}</p>
                </section>
              </>
            ) : null}

            <section id="links" className="scroll-mt-24">
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

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
              <p className="font-mono-label text-[var(--color-text-subtle)]">On this page</p>
              {project.hasCaseStudy ? (
                <ul className="mt-4 space-y-2 text-[var(--text-sm)]">
                  {[
                    ['context', 'Context'],
                    ['problem', 'Problem'],
                    ['approach', 'Approach'],
                    ['architecture', 'Architecture'],
                    ['decisions', 'Decisions'],
                    ['challenges', 'Challenges'],
                    ['outcomes', 'Outcomes'],
                    ['retrospective', 'Retrospective'],
                  ].map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                  Summary project — full case study pending publishable detail.
                </p>
              )}
              <div className="mt-6">
                <ButtonLink href="/contact" variant="primary" className="w-full">
                  Contact about this work
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>

        <nav
          className="mt-16 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:justify-between"
          aria-label="Adjacent projects"
        >
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">
              ← {renderContentText(prev.title)}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] sm:text-right">
              {renderContentText(next.title)} →
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
