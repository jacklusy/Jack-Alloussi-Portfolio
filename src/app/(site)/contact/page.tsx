import type { Metadata } from 'next';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { ContactForm } from '@/features/contact/ContactForm';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CopyEmailButton } from '@/features/contact/CopyEmailButton';
import { renderContentText } from '@/lib/content-text';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Jack Alloussi — email, phone, LinkedIn, and availability for EU Blue Card–eligible relocation to Germany.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="bg-[var(--color-surface)] py-[var(--section-y)]">
      <Container>
        <p className="font-mono-label text-[var(--color-brand)]">System.contact</p>
        <h1 className="mt-3 text-[length:var(--text-h1)] tracking-tight">Let&apos;s talk about a role</h1>
        <p className="mt-4 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          Prefer email? Use the address below — the form is optional.
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <p className="prose-width text-[var(--color-text-muted)]">
              Open to backend or full-stack roles in Germany and the wider EU. Based in{' '}
              {profile.location} ({profile.timezone}).
            </p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-[var(--shadow-md)] sm:p-6">
              <p className="font-mono-label text-[var(--color-text-subtle)]">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all text-[length:var(--text-body-lg)] text-[var(--color-brand)] hover:underline"
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
          </div>
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
