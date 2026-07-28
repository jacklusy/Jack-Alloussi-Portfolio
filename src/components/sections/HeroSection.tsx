import { profile } from '@/content/profile';
import { StatusRail } from '@/components/sections/StatusRail';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { isUsableHref } from '@/lib/content-text';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative border-b border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="hero-heading"
    >
      <StatusRail orientation="horizontal" />
      <div className="flex">
        <StatusRail orientation="vertical" />
        <Container className="flex flex-1 flex-col justify-center py-16 md:py-24 lg:py-28">
          <p className="font-mono-label mb-4 text-[var(--color-brand)]">{profile.role}</p>
          <h1 id="hero-heading" className="text-display max-w-[18ch] text-[var(--color-text)]">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-[var(--prose-max)] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
            {profile.tagline}
          </p>
          <p className="mt-4 max-w-[var(--prose-max)] text-[var(--color-text)]">
            Based in {profile.location}. Open to relocation · EU Blue Card eligible · Graduating{' '}
            {profile.availability.graduationDate}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {profile.ctas.map((cta) => (
              <ButtonLink
                key={cta.id}
                href={cta.href}
                variant={cta.variant}
                {...(cta.download ? { download: profile.cv.filename } : {})}
                {...(cta.external !== undefined ? { external: cta.external } : {})}
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-4">
            {profile.socials.map((social) =>
              isUsableHref(social.href) ? (
                <li key={social.id}>
                  <a
                    href={social.href}
                    className="inline-flex min-h-11 items-center text-[var(--text-sm)] text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-brand)] hover:underline"
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    target={social.external ? '_blank' : undefined}
                  >
                    {social.label}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </Container>
      </div>
    </section>
  );
}
