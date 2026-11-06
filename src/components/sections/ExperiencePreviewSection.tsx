import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getContent } from '@/content';
import type { Locale } from '@/i18n/config';
import { Section } from '@/components/layout/Section';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Reveal } from '@/components/motion/Reveal';

export type ExperiencePreviewSectionProps = {
  locale: Locale;
  previewCount?: number;
};

export async function ExperiencePreviewSection({
  locale,
  previewCount = 2,
}: ExperiencePreviewSectionProps) {
  const [t, { experience }] = await Promise.all([
    getTranslations({ locale, namespace: 'experiencePreview' }),
    getContent(locale),
  ]);
  const roles = experience.slice(0, previewCount);

  return (
    <Section id="experience" eyebrow={t('eyebrow')} title={t('title')} description={t('description')}>
      <Reveal direction="start" distance={36}>
        <ExperienceTimeline roles={roles} />
      </Reveal>
      <Reveal className="mt-10" delay={0.06} direction="end" distance={28}>
        <ButtonLink href="/experience" variant="secondary">
          {t('cta')}
        </ButtonLink>
        <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
          {t.rich('alsoOn', {
            link: (chunks) => (
              <Link href="/about" className="text-[var(--color-brand)] hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </Reveal>
    </Section>
  );
}
