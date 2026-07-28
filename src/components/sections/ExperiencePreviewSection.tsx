import Link from 'next/link';
import { experience } from '@/content/experience';
import { Section } from '@/components/layout/Section';
import { ExperienceTimeline } from '@/components/features/experience/ExperienceTimeline';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Reveal } from '@/components/motion/Reveal';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';

export type ExperiencePreviewSectionProps = {
  previewCount?: number;
};

export function ExperiencePreviewSection({ previewCount = 2 }: ExperiencePreviewSectionProps) {
  const roles = experience.slice(0, previewCount);

  return (
    <Section
      id="experience"
      eyebrow="Timeline"
      title="Professional experience"
      description="Dates match the CV. Client work is described without identifying details."
      className="relative overflow-hidden"
      containerClassName="relative z-10"
    >
      <AmbientBackdrop variant="section" />
      <Reveal>
        <ExperienceTimeline roles={roles} />
      </Reveal>
      <Reveal className="mt-10" delay={0.06}>
        <ButtonLink href="/experience" variant="secondary">
          Full experience timeline
        </ButtonLink>
        <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
          Also on{' '}
          <Link href="/about" className="text-[var(--color-brand)] hover:underline">
            About
          </Link>{' '}
          and education.
        </p>
      </Reveal>
    </Section>
  );
}
