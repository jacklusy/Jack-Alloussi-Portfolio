import { getTranslations } from 'next-intl/server';
import { getProfile } from '@/content';
import type { Locale } from '@/i18n/config';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Reveal } from '@/components/motion/Reveal';
import { WordReveal } from '@/components/motion/WordReveal';
import { isUsableHref } from '@/lib/content-text';

/**
 * Home closing CTA — large statement + direct contact. Full form lives on /contact.
 */
export async function ContactSection({ locale }: { locale: Locale }) {
  const [t, tActions, profile] = await Promise.all([
    getTranslations({ locale, namespace: 'contactSection' }),
    getTranslations({ locale, namespace: 'actions' }),
    getProfile(locale),
  ]);

  return (
    <Section id="contact" eyebrow={t('eyebrow')} align="center">
      <div className="relative">
        {/* Soft brand glow behind the closing statement. */}
        <div
          aria-hidden
          className="pointer-events-none absolute start-1/2 top-1/2 -z-10 h-[28rem] w-[min(90vw,48rem)] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--color-brand-rgb)/0.2),transparent)]"
        />
        <div className="mx-auto max-w-3xl text-center">
          <WordReveal
            as="h2"
            text={t('title')}
            className="text-display uppercase tracking-[-0.03em] text-[var(--color-text)]"
          />
          <Reveal direction="up" distance={24} delay={0.1}>
            <p className="mx-auto mt-5 max-w-[42ch] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
              {t('description')}
            </p>
            <a
              href={`mailto:${profile.email}`}
              dir="ltr"
              className="mt-8 inline-block break-all font-[family-name:var(--font-syne)] text-[clamp(1.25rem,3vw,2rem)] font-semibold text-[var(--color-brand)] transition-opacity hover:opacity-80"
            >
              {profile.email}
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" variant="primary" size="lg">
                {tActions('contactForm')}
              </ButtonLink>
              <ButtonLink
                href={profile.cv.href}
                variant="secondary"
                size="lg"
                download={profile.cv.filename}
              >
                {tActions('downloadCv')}
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
        </div>
      </div>
    </Section>
  );
}
