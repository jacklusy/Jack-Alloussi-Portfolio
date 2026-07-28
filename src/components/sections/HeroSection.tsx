import { ChevronDown } from 'lucide-react';
import { profile } from '@/content/profile';
import { StatusRail } from '@/components/sections/StatusRail';
import { Container } from '@/components/layout/Container';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { HeroMotion, HeroMotionItem } from '@/components/motion/HeroMotion';
import { isUsableHref } from '@/lib/content-text';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[min(92dvh,52rem)] overflow-hidden border-b border-[var(--color-border)]"
      aria-labelledby="hero-heading"
    >
      <AmbientBackdrop variant="hero" />
      <StatusRail orientation="horizontal" className="relative z-10" />
      <div className="relative z-10 flex min-h-[calc(min(92dvh,52rem)-4.5rem)]">
        <StatusRail orientation="vertical" />
        <Container className="flex flex-1 flex-col justify-center py-16 md:py-20 lg:py-24">
          <HeroMotion>
            <HeroMotionItem>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)]/80 px-3 py-1.5 shadow-[var(--shadow-sm)] backdrop-blur-sm">
                <span className="status-pulse relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                <span className="font-mono-label text-[var(--color-text-muted)]">
                  {profile.role} · Open to relocate
                </span>
              </div>
            </HeroMotionItem>

            <HeroMotionItem>
              <h1
                id="hero-heading"
                className="text-display max-w-[14ch] text-[var(--color-text)]"
              >
                {profile.name}
              </h1>
            </HeroMotionItem>

            <HeroMotionItem>
              <p className="mt-6 max-w-[38ch] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
                {profile.tagline}
              </p>
            </HeroMotionItem>

            <HeroMotionItem>
              <p className="mt-5 max-w-[var(--prose-max)] border-l-2 border-[var(--color-brand)] pl-4 text-[var(--color-text)]">
                Based in {profile.location}. EU Blue Card eligible · Graduating{' '}
                {profile.availability.graduationDate}.
              </p>
            </HeroMotionItem>

            <HeroMotionItem>
              <div className="mt-9 flex flex-wrap gap-3">
                {profile.ctas.map((cta) => (
                  <ButtonLink
                    key={cta.id}
                    href={cta.href}
                    variant={cta.variant}
                    size="lg"
                    {...(cta.download ? { download: profile.cv.filename } : {})}
                    {...(cta.external !== undefined ? { external: cta.external } : {})}
                  >
                    {cta.label}
                  </ButtonLink>
                ))}
              </div>
            </HeroMotionItem>

            <HeroMotionItem>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {profile.socials.map((social) =>
                  isUsableHref(social.href) ? (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        className="inline-flex min-h-11 items-center text-[var(--text-sm)] font-medium text-[var(--color-text-muted)] transition-colors duration-[var(--duration-micro)] hover:text-[var(--color-brand)]"
                        rel={social.external ? 'noopener noreferrer' : undefined}
                        target={social.external ? '_blank' : undefined}
                      >
                        {social.label}
                        <span className="ml-1 opacity-50" aria-hidden>
                          ↗
                        </span>
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </HeroMotionItem>
          </HeroMotion>

          <a
            href="#about"
            className="mt-14 inline-flex w-fit flex-col items-center gap-1 text-[var(--color-text-subtle)] transition-colors duration-[var(--duration-micro)] hover:text-[var(--color-brand)]"
            aria-label="Scroll to about section"
          >
            <span className="font-mono-label">Scroll</span>
            <ChevronDown className="scroll-cue-dot h-5 w-5" aria-hidden />
          </a>
        </Container>
      </div>
    </section>
  );
}
