import Link from 'next/link';
import { footerNav } from '@/config/navigation';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { isUsableHref } from '@/lib/content-text';
import { renderContentText } from '@/lib/content-text';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)] py-12 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-syne)] text-xl font-semibold">{profile.name}</p>
            <p className="mt-2 text-[var(--color-text-muted)]">{profile.role}</p>
            <p className="mt-4 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
              {profile.availability.status} · EU Blue Card eligible · Graduating{' '}
              {profile.availability.graduationDate}
            </p>
          </div>

          <div>
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">Navigate</p>
            <ul className="flex flex-col gap-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">Connect</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-11 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                >
                  {profile.email}
                </a>
              </li>
              {profile.socials
                .filter((social) => social.id !== 'email' && isUsableHref(social.href))
                .map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      className="inline-flex min-h-11 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              {profile.socials
                .filter((social) => social.id !== 'email' && !isUsableHref(social.href))
                .map((social) => (
                  <li key={social.id} className="text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                    {social.label}: {renderContentText(social.href)}
                  </li>
                ))}
              <li>
                <a
                  href={profile.cv.href}
                  download={profile.cv.filename}
                  className="inline-flex min-h-11 items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                >
                  {profile.cv.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-border)] pt-8 text-[var(--text-sm)] text-[var(--color-text-subtle)] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS — this site is a work sample.
          </p>
        </div>
      </Container>
    </footer>
  );
}
