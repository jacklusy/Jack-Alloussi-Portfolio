import { getTranslations } from 'next-intl/server';
import { getFeaturedProjects, getTopTechnologies } from '@/content';
import type { Locale } from '@/i18n/config';
import { Section } from '@/components/layout/Section';
import { FeaturedProjectPanel } from '@/components/features/projects/FeaturedProjectPanel';
import { Reveal } from '@/components/motion/Reveal';
import { StackedCard, StackedCards } from '@/components/motion/StackedCards';

const DECK_SIZE = 4;

export async function ProjectsPreviewSection({ locale }: { locale: Locale }) {
  const [t, tActions, featuredAll] = await Promise.all([
    getTranslations({ locale, namespace: 'projectsPreview' }),
    getTranslations({ locale, namespace: 'actions' }),
    getFeaturedProjects(locale),
  ]);
  const deck = featuredAll.slice(0, DECK_SIZE);
  const topTechs = getTopTechnologies(6);

  return (
    <Section
      id="projects"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      headerAction={{ label: tActions('exploreAllProjects'), href: '/projects' }}
    >
      <StackedCards count={deck.length}>
        {deck.map((project, index) => (
          <StackedCard key={project.slug} index={index}>
            <FeaturedProjectPanel project={project} position={index + 1} total={deck.length} />
          </StackedCard>
        ))}
      </StackedCards>

      <Reveal delay={0.05}>
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-subtle)] uppercase">
          <span className="text-[var(--color-text-muted)]">{t('mostUsed')}</span>
          {topTechs.map((tech) => (
            <span key={tech} className="text-[var(--color-text-subtle)]">
              {tech}
            </span>
          ))}
        </p>
      </Reveal>
    </Section>
  );
}
