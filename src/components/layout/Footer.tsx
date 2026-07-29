import Link from 'next/link';
import { footerNav } from '@/config/navigation';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { isUsableHref, renderContentText } from '@/lib/content-text';

export function Footer() {
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
              {profile.role} — Next.js, TypeScript, Tailwind.
            </p>
            <p className="mt-4 font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase">
              {profile.availability.status} · EU Blue Card eligible
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">Navigation</p>
            <ul className="flex flex-col gap-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono-label mb-4 text-[var(--color-text-subtle)]">Connect</p>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${profile.email}`}
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
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-border)] pt-8 font-mono text-[var(--text-xs)] tracking-wide text-[var(--color-text-subtle)] uppercase md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {profile.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
