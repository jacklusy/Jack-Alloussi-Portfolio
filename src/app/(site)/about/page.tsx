import type { Metadata } from 'next';
import Image from 'next/image';
import { profile } from '@/content/profile';
import { education } from '@/content/education';
import { certifications } from '@/content/certifications';
import { experience } from '@/content/experience';
import { Container } from '@/components/layout/Container';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PhotoMoments } from '@/components/sections/PhotoMoments';
import { renderContentText } from '@/lib/content-text';
import { faqJsonLd, profilePageJsonLd } from '@/lib/schema';
import { projects } from '@/content/projects';
import { formatMonthYear } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Biography, values, education, and certifications for Jack Alloussi — software engineer based in Amman, Jordan, EU Blue Card eligible.',
  alternates: { canonical: '/about' },
};

const FAQS = [
  {
    question: 'Who is Jack Alloussi?',
    answer:
      'A software engineer based in Amman, Jordan, working as a Software Engineer at CSC Beyond on custom software delivery for United States clients across web, API, and mobile platforms. Backend-leaning full stack: TypeScript and NestJS, PHP and Laravel, React and Next.js on the web, and React Native on mobile.',
  },
  {
    question: 'What does Jack Alloussi work on?',
    answer:
      'Production backend services in TypeScript and PHP backed by PostgreSQL and Redis, React and Next.js frontends, and cross-platform mobile applications — more than fifteen released to the Apple App Store and Google Play using React Native CLI and Expo. Personal work includes a multi-tenant inventory API built around provable concurrency guarantees, an offline-first React Native client, and a browser-native PDF toolkit.',
  },
  {
    question: 'Is Jack Alloussi available for relocation to Germany or the EU?',
    answer:
      'Yes. Open to backend or full-stack roles in Germany and the wider EU, available to relocate from October 2026 after graduation, and EU Blue Card eligible.',
  },
  {
    question: 'What technologies does Jack Alloussi specialise in?',
    answer:
      'TypeScript, Node.js and NestJS, Laravel, React and Next.js, React Native and Expo, PostgreSQL, Redis, and Docker — applied with Clean Architecture and Domain-Driven Design where the problem justifies the ceremony.',
  },
] as const;

export default function AboutPage() {
  return (
    <div className="py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">System.about</p>
        <h1 className="mt-3 max-w-[20ch] text-[length:var(--text-h1)] tracking-[var(--tracking-display)]">
          Jack Alloussi — building production systems across stacks
        </h1>
        <p className="mt-5 max-w-[var(--prose-max)] text-[length:var(--text-lead)] leading-relaxed text-[var(--color-text-muted)]">
          Software engineer in Amman, Jordan. Backend-leaning full stack across TypeScript, NestJS,
          Laravel, React, and React Native — with {projects.length} documented case studies covering
          the architecture, the tradeoffs, and the parts that did not work.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="prose-width space-y-5 text-[var(--color-text-muted)] lg:col-span-7">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <h2 className="pt-4 text-[length:var(--text-h2)] text-[var(--color-text)]">How I work</h2>
            <p>
              I favour clear boundaries, typed contracts, and reversible decisions. Formal training
              in Clean Architecture, DDD, and SOLID shapes how I structure NestJS and Laravel
              services — without ceremony for its own sake.
            </p>
            <p>
              Spoken languages:{' '}
              {profile.spokenLanguages.map((l) => `${l.language} (${l.level})`).join('; ')}.
            </p>
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
            Experience timeline
          </h2>
          <div className="mt-8">
            <ExperienceTimeline roles={experience} />
          </div>
        </section>

        <section className="mt-20" aria-labelledby="about-education">
          <h2 id="about-education" className="text-[length:var(--text-h2)]">
            Education & certifications
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {education.map((item) => (
              <li key={item.id}>
                <Card variant="panel" interactive>
                  <p className="font-mono-label text-[var(--color-text-subtle)]">
                    {formatMonthYear(item.startDate)} — {formatMonthYear(item.endDate)}
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
                    {cert.status === 'in-progress' ? 'In progress' : 'Earned'}
                  </Badge>
                  <h3 className="mt-3 text-[length:var(--text-h3)]">{cert.name}</h3>
                  <p className="mt-1 text-[var(--color-text-muted)]">{cert.issuer}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-20 scroll-mt-28" aria-labelledby="faq-title">
          <p className="font-mono-label text-[var(--color-brand)]">System.faq</p>
          <h2
            id="faq-title"
            className="mt-3 text-[length:var(--text-h2)] tracking-[var(--tracking-heading)]"
          >
            Frequently asked
          </h2>
          <dl className="mt-8 max-w-[var(--prose-max)] divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {FAQS.map((faq) => (
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
    </div>
  );
}
