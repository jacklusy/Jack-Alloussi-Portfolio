import type { Metadata } from 'next';
import { experience } from '@/content/experience';
import { Container } from '@/components/layout/Container';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Professional timeline for Jack Alloussi — Software Engineer at CSC Beyond, prior roles, technologies, and confidential client delivery context.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  return (
    <div className="py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">System.timeline</p>
        <h1 className="mt-3 text-[length:var(--text-h1)] tracking-tight">Experience nodes</h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          Gapless history matching the CV. Expand a role for achievements and stack. Client work is
          generalised on purpose.
        </p>
        <div className="mt-12">
          <ExperienceTimeline roles={experience} />
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/contact" variant="primary">
            Discuss a role
          </ButtonLink>
          <ButtonLink href={profile.cv.href} variant="secondary" download={profile.cv.filename}>
            {profile.cv.label}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
