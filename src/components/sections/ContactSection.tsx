import { profile } from '@/content/profile';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Reveal } from '@/components/motion/Reveal';
import { isUsableHref } from '@/lib/content-text';
/**
 * Home closing CTA — large statement + direct contact. Full form lives on /contact.
 */
export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="System.contact_06"
      align="center"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-display uppercase tracking-[-0.03em] text-[var(--color-text)]">
          Let&apos;s build what&apos;s next
        </h2>
        <p className="mx-auto mt-5 max-w-[42ch] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          Open to backend or full-stack roles in Germany and the wider EU. Prefer email — forms are
          optional.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block break-all font-[family-name:var(--font-syne)] text-[clamp(1.25rem,3vw,2rem)] font-semibold text-[var(--color-brand)] transition-opacity hover:opacity-80"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/contact" variant="primary" size="lg">
            Contact form
          </ButtonLink>
          <ButtonLink href={profile.cv.href} variant="secondary" size="lg" download={profile.cv.filename}>
            Download CV
          </ButtonLink>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-6">
          {profile.socials
            .filter((s) => isUsableHref(s.href))
            .map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  className="font-mono text-[var(--text-xs)] tracking-[0.14em] text-[var(--color-text-muted)] uppercase hover:text-[var(--color-brand)]"
                  rel={social.external ? 'noopener noreferrer' : undefined}
                  target={social.external ? '_blank' : undefined}
                >
                  {social.label}
                </a>
              </li>
            ))}
        </ul>
      </Reveal>
    </Section>
  );
}
