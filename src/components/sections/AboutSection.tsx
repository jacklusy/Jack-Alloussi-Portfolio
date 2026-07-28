import Image from 'next/image';
import { profile } from '@/content/profile';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { renderContentText } from '@/lib/content-text';

export function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Backend-leaning engineer with unusual stack breadth"
      description="Client delivery across TypeScript, Node, NestJS, Laravel, React, and React Native — with formal architecture training."
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="prose-width space-y-5 text-[var(--color-text-muted)] lg:col-span-7">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <Stagger className="grid gap-3 pt-2 sm:grid-cols-2" stagger={0.05}>
            {profile.highlights.map((item) => (
              <StaggerItem key={item.label}>
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 shadow-[var(--shadow-sm)] transition-[border-color,transform] duration-[var(--duration-standard)] hover:-translate-y-0.5 hover:border-[var(--color-brand)]/30">
                  <p className="font-mono-label text-[var(--color-text-subtle)]">{item.label}</p>
                  <p className="mt-1 font-medium text-[var(--color-text)]">{item.value}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="pt-2 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
            Relocation: {renderContentText(profile.availability.relocationNote)}
          </p>
          <ButtonLink href={profile.cv.href} variant="secondary" download={profile.cv.filename}>
            {profile.cv.label}
          </ButtonLink>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.08}>
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute -inset-3 rounded-[calc(var(--radius-xl)+0.5rem)] bg-gradient-to-br from-[var(--color-brand)]/20 via-transparent to-[var(--color-brand)]/10"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] shadow-[var(--shadow-lg)]">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-text)]/50 to-transparent p-5"
                aria-hidden
              >
                <p className="font-mono-label text-[var(--color-text-inverse)]">Amman · Jordan</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
