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
import { formatMonthYear } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Biography, values, education, and certifications for Jack Alloussi — software engineer based in Amman, Jordan, EU Blue Card eligible.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">System.about</p>
        <h1 className="mt-3 max-w-[18ch] text-[length:var(--text-h1)] tracking-tight">
          Building production systems across stacks — with architecture discipline
        </h1>
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
      </Container>
    </div>
  );
}
