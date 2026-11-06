import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProfile } from '@/content';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CopyEmailButton } from '@/features/contact/CopyEmailButton';
import { routing } from '@/i18n/routing';
import { renderContentText } from '@/lib/content-text';
import { localizedAlternates } from '@/lib/seo';

/**
 * Every page links to /contact (header CV button, floating hire button,
 * footer nav), which was enough for the bundler's chunk-sharing heuristic to
 * hoist ContactForm's dependencies — zod, react-hook-form, the resolvers —
 * into a ~290KB chunk loaded and executed on every route, not just this one.
 * A genuine dynamic-import boundary keeps it scoped to /contact.
 */
const ContactForm = dynamic(() =>
  import('@/features/contact/ContactForm').then((mod) => mod.ContactForm),
);

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('pages.contact.title'),
    description: t('pages.contact.description'),
    alternates: localizedAlternates(locale, '/contact'),
  };
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, profile] = await Promise.all([
    getTranslations({ locale, namespace: 'contactPage' }),
    getProfile(locale),
  ]);

  return (
    <div className="bg-[var(--color-surface)] py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">{t('eyebrow')}</p>
        <h1 className="mt-3 text-[length:var(--text-h1)] tracking-tight">{t('title')}</h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          {t('description')}
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <p className="prose-width text-[var(--color-text-muted)]">
              {t('intro', { location: profile.location, timezone: profile.timezone })}
            </p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-[var(--shadow-md)] sm:p-6">
              <p className="font-mono-label text-[var(--color-text-subtle)]">{t('email')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  dir="ltr"
                  className="break-all text-[length:var(--text-body-lg)] text-[var(--color-brand)] hover:underline"
                >
                  {profile.email}
                </a>
                <CopyEmailButton email={profile.email} />
              </div>
              <p className="mt-6 font-mono-label text-[var(--color-text-subtle)]">{t('phone')}</p>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                dir="ltr"
                className="mt-2 inline-flex min-h-11 items-center"
              >
                {profile.phone}
              </a>
              <p className="mt-6 font-mono-label text-[var(--color-text-subtle)]">
                {t('workAuthorisation')}
              </p>
              <p className="mt-2 text-[var(--color-text-muted)]">{profile.availability.visaNote}</p>
              <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                {renderContentText(profile.availability.relocationNote)}
              </p>
              <div className="mt-6">
                <ButtonLink href={profile.cv.href} variant="secondary" download={profile.cv.filename}>
                  {profile.cv.label}
                </ButtonLink>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
