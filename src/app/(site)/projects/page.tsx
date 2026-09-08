import type { Metadata } from 'next';
import { projects, getProjectCategories, getTopTechnologies } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ProjectsFilter } from '@/features/projects/ProjectsFilter';
import { projectListJsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Engineering case studies by Jack Alloussi — a multi-tenant NestJS inventory API, an offline-first React Native client, a browser-native PDF toolkit, a university notification platform, and more.',
  alternates: { canonical: '/projects' },
};

type ProjectsPageProps = {
  searchParams: Promise<{ tech?: string; category?: string; q?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tech = params.tech?.trim();
  const category = params.category?.trim();
  const query = params.q?.trim();

  const filtered = projects.filter((project) => {
    const matchesTech = tech
      ? project.technologies.some((item) => item.toLowerCase() === tech.toLowerCase())
      : true;
    const matchesCategory = category
      ? project.categories.some((item) => item.toLowerCase() === category.toLowerCase())
      : true;
    const matchesQuery = query ? project.title.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesTech && matchesCategory && matchesQuery;
  });

  return (
    <div className="relative py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">System.resources_04</p>
        <h1 className="mt-3 max-w-[18ch] text-[length:var(--text-h1)] tracking-[var(--tracking-display)] uppercase">
          Engineering case studies
        </h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-lead)] leading-relaxed text-[var(--color-text-muted)]">
          Twelve systems, each argued in problem, architecture, decisions, and outcome — including
          the parts that did not work. Client identities stay confidential; the engineering does
          not.
        </p>

        <div className="mt-10">
          <ProjectsFilter
            categories={getProjectCategories()}
            topTechs={getTopTechnologies(8)}
            activeTech={tech}
            activeCategory={category}
            activeQuery={query}
            resultCount={filtered.length}
            totalCount={projects.length}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-[var(--color-text-muted)]" role="status">
            No projects match that filter. Clear it to see everything.
          </p>
        ) : (
          <ul className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filtered.map((project) => (
              <li key={project.slug} className="h-full min-w-0">
                <ProjectCard project={project} variant="compact" />
              </li>
            ))}
          </ul>
        )}
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectListJsonLd()) }}
      />
    </div>
  );
}
