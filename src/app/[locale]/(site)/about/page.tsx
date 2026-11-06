import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/content';
import { Container } from '@/components/layout/Container';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PhotoMoments } from '@/components/sections/PhotoMoments';
import { routing } from '@/i18n/routing';
import { renderContentText } from '@/lib/content-text';
import { faqJsonLd, profilePageJsonLd } from '@/lib/schema';
import { localizedAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('pages.about.title'),
    description: t('pages.about.description'),
    alternates: localizedAlternates(locale, '/about'),
  };
}

type Faq = { question: string; answer: string };

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tLabels, format, { profile, education, certifications, experience, projects }] =
    await Promise.all([
      getTranslations({ locale, namespace: 'aboutPage' }),
      getTranslations({ locale, namespace: 'labels' }),
      getFormatter({ locale }),
      getContent(locale),
    ]);
  const faqs = t.raw('faq') as Faq[];
  const month = (value: string) =>
    value === 'present'
      ? tLabels('present')
      : format.dateTime(new Date(`${value}-01T00:00:00`), 'monthYear');
  const spoken = profile.spokenLanguages.map((l) => `${l.language} (${l.level})`);

  return (
    <div className="py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">{t('eyebrow')}</p>
        <h1 className="mt-3 max-w-[20ch] text-[length:var(--text-h1)] tracking-[var(--tracking-display)]">
          {t('title')}
        </h1>
        <p className="mt-5 max-w-[var(--prose-max)] text-[length:var(--text-lead)] leading-relaxed text-[var(--color-text-muted)]">
          {t('lead', { count: projects.length })}
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="prose-width space-y-5 text-[var(--color-text-muted)] lg:col-span-7">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <h2 className="pt-4 text-[length:var(--text-h2)] text-[var(--color-text)]">
              {t('howIWork')}
            </h2>
            <p>{t('howIWorkBody')}</p>
            <p>{t('spokenLanguages', { languages: format.list(spoken, { type: 'unit' }) })}</p>
            <ButtonLink href={profile.cv.href} variant="primary" download={profile.cv.filename}>
              {profile.cv.label}
            </ButtonLink>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            </div>
          </div>
        </div>

        <PhotoMoments />

        <section className="mt-20" aria-labelledby="about-experience">
          <h2 id="about-experience" className="text-[length:var(--text-h2)]">
            {t('experienceTimeline')}
          </h2>
          <div className="mt-8">
            <ExperienceTimeline roles={experience} />
          </div>
        </section>

        <section className="mt-20" aria-labelledby="about-education">
          <h2 id="about-education" className="text-[length:var(--text-h2)]">
            {t('educationCertifications')}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {education.map((item) => (
              <li key={item.id}>
                <Card variant="panel" interactive>
                  <p className="font-mono-label text-[var(--color-text-subtle)]">
                    {tLabels('dateRange', {
                      start: month(item.startDate),
                      end: month(item.endDate),
                    })}
                  </p>
                  <h3 className="mt-2 text-[length:var(--text-h3)]">
                    {[item.degree, item.field].filter(Boolean).join(' ')}
                  </h3>
                  <p className="mt-1 text-[var(--color-text-muted)]">{item.institution}</p>
                  {item.note ? (
                    <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                      {renderContentText(item.note)}
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
            {certifications.map((cert) => (
              <li key={cert.id}>
                <Card variant="panel" interactive>
                  <Badge tone={cert.status === 'in-progress' ? 'muted' : 'brand'}>
                    {cert.status === 'in-progress' ? tLabels('inProgress') : tLabels('earned')}
                  </Badge>
                  <h3 className="mt-3 text-[length:var(--text-h3)]">{cert.name}</h3>
                  <p className="mt-1 text-[var(--color-text-muted)]">{cert.issuer}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-20 scroll-mt-28" aria-labelledby="faq-title">
          <p className="font-mono-label text-[var(--color-brand)]">{t('faqEyebrow')}</p>
          <h2
            id="faq-title"
            className="mt-3 text-[length:var(--text-h2)] tracking-[var(--tracking-heading)]"
          >
            {t('faqTitle')}
          </h2>
          <dl className="mt-8 max-w-[var(--prose-max)] divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <dt className="font-[family-name:var(--font-syne)] text-[length:var(--text-h3)] font-semibold text-[var(--color-text)]">
                  {faq.question}
                </dt>
                <dd className="mt-3 leading-relaxed text-[var(--color-text-muted)]">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageJsonLd(locale, `${t('eyebrow')} ${profile.name}`)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale, faqs)) }}
      />
    </div>
  );
}
