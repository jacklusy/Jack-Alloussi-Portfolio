import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/content';
import { Container } from '@/components/layout/Container';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { routing } from '@/i18n/routing';
import { localizedAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/experience'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('pages.experience.title'),
    description: t('pages.experience.description'),
    alternates: localizedAlternates(locale, '/experience'),
  };
}

export default async function ExperiencePage({ params }: PageProps<'/[locale]/experience'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tActions, { experience, profile }] = await Promise.all([
    getTranslations({ locale, namespace: 'experiencePage' }),
    getTranslations({ locale, namespace: 'actions' }),
    getContent(locale),
  ]);

  return (
    <div className="py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">{t('eyebrow')}</p>
        <h1 className="mt-3 text-[length:var(--text-h1)] tracking-tight">{t('title')}</h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          {t('description')}
        </p>
        <div className="mt-12">
          <ExperienceTimeline roles={experience} />
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/contact" variant="primary">
            {tActions('discussRole')}
          </ButtonLink>
          <ButtonLink href={profile.cv.href} variant="secondary" download={profile.cv.filename}>
            {profile.cv.label}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
