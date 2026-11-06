import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProjectCategories, getProjects, getTopTechnologies } from '@/content';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ProjectsFilter } from '@/features/projects/ProjectsFilter';
import { routing } from '@/i18n/routing';
import { projectListJsonLd } from '@/lib/schema';
import { localizedAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('pages.projects.title'),
    description: t('pages.projects.description'),
    alternates: localizedAlternates(locale, '/projects'),
  };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: PageProps<'/[locale]/projects'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const query_ = await searchParams;
  const pick = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
  const tech = pick(query_.tech);
  const category = pick(query_.category);
  const query = pick(query_.q);

  const [t, projects] = await Promise.all([
    getTranslations({ locale, namespace: 'projectsPage' }),
    getProjects(locale),
  ]);

  const filtered = projects.filter((project) => {
    const matchesTech = tech
      ? project.technologies.some((item) => item.toLowerCase() === tech.toLowerCase())
      : true;
    const matchesCategory = category
      ? project.categories.some((item) => item.toLowerCase() === category.toLowerCase())
      : true;
    // Titles are searched in the visitor's own language.
    const matchesQuery = query ? project.title.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesTech && matchesCategory && matchesQuery;
  });

  return (
    <div className="relative py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">{t('eyebrow')}</p>
        <h1 className="mt-3 max-w-[18ch] text-[length:var(--text-h1)] tracking-[var(--tracking-display)] uppercase">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-lead)] leading-relaxed text-[var(--color-text-muted)]">
          {t('description', { count: projects.length })}
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
            {t('empty')}
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectListJsonLd(locale, t('title'), projects)),
        }}
      />
    </div>
  );
}
