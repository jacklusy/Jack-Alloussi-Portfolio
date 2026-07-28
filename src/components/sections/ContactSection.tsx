import { profile } from '@/content/profile';
import { Section } from '@/components/layout/Section';
import { ContactForm } from '@/features/contact/ContactForm';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CopyEmailButton } from '@/features/contact/CopyEmailButton';
import { Reveal } from '@/components/motion/Reveal';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { renderContentText } from '@/lib/content-text';

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s talk about a role"
      description="Prefer email? Use the address below — the form is optional."
      className="relative overflow-hidden"
      containerClassName="relative z-10"
    >
      <AmbientBackdrop variant="section" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal className="space-y-6">
          <p className="prose-width text-[var(--color-text-muted)]">
            Open to backend or full-stack roles in Germany and the wider EU. Based in{' '}
            {profile.location} ({profile.timezone}).
          </p>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]/90 p-6 shadow-[var(--shadow-md)] backdrop-blur-sm">
            <p className="font-mono-label text-[var(--color-text-subtle)]">Email</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="text-[length:var(--text-body-lg)] text-[var(--color-brand)] hover:underline"
              >
                {profile.email}
              </a>
              <CopyEmailButton email={profile.email} />
            </div>
            <p className="mt-6 font-mono-label text-[var(--color-text-subtle)]">Phone</p>
            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              className="mt-2 inline-flex min-h-11 items-center"
            >
              {profile.phone}
            </a>
            <p className="mt-6 font-mono-label text-[var(--color-text-subtle)]">Work authorisation</p>
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
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
