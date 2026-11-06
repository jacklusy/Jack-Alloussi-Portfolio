import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { footerNav } from '@/config/navigation';
import { getProfile } from '@/content';
import type { Locale } from '@/i18n/config';
import { Container } from '@/components/layout/Container';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { isUsableHref, renderContentText } from '@/lib/content-text';

export async function Footer({ locale }: { locale: Locale }) {
  const [t, profile] = await Promise.all([getTranslations({ locale }), getProfile(locale)]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)] py-14 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-[family-name:var(--font-syne)] text-sm font-semibold tracking-[0.1em] uppercase">
              {profile.name}
            </p>
            <p className="mt-3 max-w-sm text-[var(--color-text-muted)]">
              {t('footer.tagline', { role: profile.role })}
            </p>
            <p className="mt-4 font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase">
              {t('footer.availability', { status: profile.availability.status })}
            </p>
            <LanguageSwitcher variant="segmented" className="mt-6 max-w-sm" />
          </div>

          <div className="md:col-span-3">
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">
              {t('footer.navigation')}
            </p>
            <ul className="flex flex-col gap-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">
              {t('footer.connect')}
            </p>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  dir="ltr"
                  className="inline-flex min-h-10 items-center break-all text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                >
                  {profile.email}
                </a>
              </li>
              {profile.socials
                .filter((s) => s.id !== 'email' && isUsableHref(s.href))
                .map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      className="inline-flex min-h-10 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              {profile.socials
                .filter((s) => s.id !== 'email' && !isUsableHref(s.href))
                .map((social) => (
                  <li key={social.id} className="text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                    {social.label}: {renderContentText(social.href)}
                  </li>
                ))}
              <li>
                <a
                  href={profile.cv.href}
                  download={profile.cv.filename}
                  className="inline-flex min-h-10 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                >
                  {t('actions.downloadCv')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-border)] pt-8 font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights', { year, name: profile.name })}</p>
        </div>
      </Container>
    </footer>
  );
}
