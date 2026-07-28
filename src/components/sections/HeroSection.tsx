import { ArrowRight, ChevronDown } from 'lucide-react';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { HeroMotion, HeroMotionItem } from '@/components/motion/HeroMotion';
import { isUsableHref } from '@/lib/content-text';

const metaItems = [
  { key: 'Location', value: 'Amman, Jordan' },
  { key: 'Availability', value: 'Open to relocate' },
  { key: 'Authorisation', value: 'EU Blue Card eligible' },
  { key: 'Graduation', value: 'October 2026' },
] as const;

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-[var(--color-border)]"
      aria-labelledby="hero-heading"
    >
      <AmbientBackdrop variant="hero" />
      <Container className="relative z-10 py-16 md:py-20 lg:py-28">
        <HeroMotion className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <HeroMotionItem>
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 py-1.5 shadow-[var(--shadow-sm)]">
                <span className="status-pulse relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                <span className="font-mono-label text-[var(--color-text-muted)]">
                  Available for relocation
                </span>
              </div>
            </HeroMotionItem>

            <HeroMotionItem>
              <p className="font-mono-label mb-3 text-[var(--color-brand)]">{profile.role}</p>
              <h1
                id="hero-heading"
                className="text-display max-w-[12ch] uppercase tracking-[-0.04em] text-[var(--color-text)]"
              >
                {profile.name}
              </h1>
            </HeroMotionItem>

            <HeroMotionItem>
              <p className="mt-6 max-w-[40ch] text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
                Backend-leaning full stack — TypeScript, NestJS, React, and React Native — shipping
                web, API, and mobile systems for United States clients from Amman.
              </p>
            </HeroMotionItem>

            <HeroMotionItem>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/projects" variant="primary" size="lg">
                  View projects
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink
                  href={profile.cv.href}
                  variant="secondary"
                  size="lg"
                  download={profile.cv.filename}
                >
                  Download CV
                </ButtonLink>
              </div>
            </HeroMotionItem>

            <HeroMotionItem>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {profile.socials.map((social) =>
                  isUsableHref(social.href) ? (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        className="inline-flex min-h-11 items-center font-mono text-[var(--text-xs)] tracking-[0.12em] text-[var(--color-text-muted)] uppercase transition-colors hover:text-[var(--color-brand)]"
                        rel={social.external ? 'noopener noreferrer' : undefined}
                        target={social.external ? '_blank' : undefined}
                      >
                        {social.label}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </HeroMotionItem>
          </div>

          <HeroMotionItem className="lg:col-span-5">
            <aside
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-md)] md:p-7"
              aria-label="Availability and work authorisation"
            >
              <p className="font-mono-label mb-5 text-[var(--color-text-subtle)]">Status.panel</p>
              <dl className="space-y-5">
                {metaItems.map((item) => (
                  <div
                    key={item.key}
                    className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0"
                  >
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-text-subtle)] uppercase">
                      {item.key}
                    </dt>
                    <dd className="mt-1.5 text-[var(--color-text)]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </HeroMotionItem>
        </HeroMotion>

        <a
          href="#about"
          className="mt-10 inline-flex w-fit flex-col items-center gap-1 text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-brand)] lg:mt-14"
          aria-label="Scroll to about section"
        >
          <span className="font-mono-label">Scroll</span>
          <ChevronDown className="scroll-cue-dot h-5 w-5" aria-hidden />
        </a>
      </Container>
    </section>
  );
}
