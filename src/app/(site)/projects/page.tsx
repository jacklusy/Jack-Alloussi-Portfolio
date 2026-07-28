import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ProjectsFilter } from '@/features/projects/ProjectsFilter';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected projects and case studies by Jack Alloussi — NestJS APIs, React Native, and confidential multi-stack client delivery.',
  alternates: { canonical: '/projects' },
};

type ProjectsPageProps = {
  searchParams: Promise<{ tech?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tech = params.tech?.trim();
  const filtered = tech
    ? projects.filter((project) =>
        project.technologies.some((item) => item.toLowerCase() === tech.toLowerCase()),
      )
    : projects;

  return (
    <div className="py-16 md:py-24">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">Projects</p>
        <h1 className="mt-3 text-[length:var(--text-h1)]">Work worth interviewing for</h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          Case studies carry confidential professional work in prose. Personal repos are listed once
          names and URLs are confirmed.
        </p>
        <div className="mt-8">
          <ProjectsFilter activeTech={tech} />
        </div>
        {filtered.length === 0 ? (
          <p className="mt-10 text-[var(--color-text-muted)]" role="status">
            No projects match that technology. Clear the filter to see everything.
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
