import Image from 'next/image';
import { profile } from '@/content/profile';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { renderContentText } from '@/lib/content-text';

export function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Backend-leaning engineer with unusual stack breadth"
      description="Client delivery across TypeScript, Node, NestJS, Laravel, React, and React Native — with formal architecture training."
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="prose-width space-y-5 text-[var(--color-text-muted)] lg:col-span-7">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <ul className="grid gap-3 pt-2 sm:grid-cols-2">
            {profile.highlights.map((item) => (
              <li
                key={item.label}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3"
              >
                <p className="font-mono-label text-[var(--color-text-subtle)]">{item.label}</p>
                <p className="mt-1 text-[var(--color-text)]">{item.value}</p>
              </li>
            ))}
          </ul>
          <p className="pt-2 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
            Relocation: {renderContentText(profile.availability.relocationNote)}
          </p>
          <ButtonLink href={profile.cv.href} variant="secondary" download={profile.cv.filename}>
            {profile.cv.label}
          </ButtonLink>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] lg:col-span-5">
          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
      </div>
    </Section>
  );
}
