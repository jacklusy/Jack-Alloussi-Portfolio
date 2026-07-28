import Image from 'next/image';
import { profile } from '@/content/profile';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { PhotoMoments } from '@/components/sections/PhotoMoments';
import { TiltCard } from '@/components/motion/TiltCard';
import { renderContentText } from '@/lib/content-text';

export function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="System.about_01"
      title="Resilient systems by design"
      description="Client delivery across stacks — with formal Clean Architecture, DDD, and SOLID training."
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute -inset-3 rounded-[calc(var(--radius-xl)+0.5rem)] bg-gradient-to-br from-[var(--color-brand)]/20 via-transparent to-[var(--color-brand)]/8"
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
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-bg)]/80 to-transparent p-5">
                <p className="font-mono-label text-[var(--color-text)]">Amman · Jordan</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 space-y-5 text-[var(--color-text-muted)] lg:order-2 lg:col-span-7" delay={0.06}>
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="prose-width">
              {paragraph}
            </p>
          ))}

          <Stagger className="grid gap-3 pt-2 sm:grid-cols-2" stagger={0.05}>
            {profile.highlights.map((item) => (
              <StaggerItem key={item.label}>
                <TiltCard>
                  <Card variant="panel" interactive className="h-full !p-4">
                    <p className="font-mono-label text-[var(--color-text-subtle)]">{item.label}</p>
                    <p className="mt-2 font-medium text-[var(--color-text)]">{item.value}</p>
                  </Card>
                </TiltCard>
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
      </div>
      <PhotoMoments />
    </Section>
  );
}
