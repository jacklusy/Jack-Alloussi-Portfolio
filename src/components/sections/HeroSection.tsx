import { ArrowRight, ChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getProfile, getProjects } from '@/content';
import type { Locale } from '@/i18n/config';
import { Container } from '@/components/layout/Container';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { DirIcon } from '@/components/ui/DirIcon';
import { HeroMotion, HeroMotionItem } from '@/components/motion/HeroMotion';
import { CountUp } from '@/components/motion/CountUp';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { isUsableHref } from '@/lib/content-text';

import stockwellApis from '@/assets/img/projects/stockwell/apis.png';
import pdfNexusHome from '@/assets/img/projects/pdfnexus/home_page.png';

const META_KEYS = ['location', 'availability', 'authorisation', 'graduation'] as const;

/** Facts that appear in the CV and in the copy ("2 years", "15+ apps"). */
const PROOF = { yearsInProduction: 2, mobileAppsReleased: 15 } as const;

export async function HeroSection({ locale }: { locale: Locale }) {
  const [t, profile, projects] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getProfile(locale),
    getProjects(locale),
  ]);
  const technologyCount = new Set(projects.flatMap((project) => project.technologies)).size;

  const proof = [
    { value: PROOF.yearsInProduction, suffix: '', label: t('proof.years') },
    { value: PROOF.mobileAppsReleased, suffix: '+', label: t('proof.apps') },
    { value: projects.length, suffix: '', label: t('proof.caseStudies') },
    { value: technologyCount, suffix: '', label: t('proof.technologies') },
  ];

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-[var(--color-border)]"
      aria-labelledby="hero-heading"
    >
      <AmbientBackdrop variant="hero" />
      <Container className="relative z-10 pt-16 pb-10 md:pt-20 lg:pt-24">
        <HeroMotion className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <HeroMotionItem>
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 py-1.5 shadow-[var(--shadow-sm)]">
                <span className="status-pulse relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                <span className="font-mono-label text-[var(--color-text-muted)]">
                  {t('available')}
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
                {t('tagline')}
              </p>
            </HeroMotionItem>

            <HeroMotionItem>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/projects" variant="primary" size="lg">
                  {profile.ctas.find((cta) => cta.id === 'projects')?.label}
                  <DirIcon icon={ArrowRight} className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href={profile.cv.href}
                  variant="secondary"
                  size="lg"
                  download={profile.cv.filename}
                >
                  {profile.cv.label}
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
            <HeroVisual tiles={[stockwellApis, pdfNexusHome]} chips={[t('chips.apps'), t('chips.locks')]}>
              <aside
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-md)] md:p-7"
                aria-label={t('statusAria')}
              >
                <p className="font-mono-label mb-5 text-[var(--color-text-subtle)]">
                  {t('statusPanel')}
                </p>
                <dl className="space-y-5">
                  {META_KEYS.map((key) => (
                    <div
                      key={key}
                      className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0"
                    >
                      <dt className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-text-subtle)] uppercase">
                        {t(`meta.${key}.label`)}
                      </dt>
                      <dd className="mt-1.5 text-[var(--color-text)]">{t(`meta.${key}.value`)}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </HeroVisual>
          </HeroMotionItem>
        </HeroMotion>

        {/* Proof strip: concrete numbers right under the headline, so the first
            screen already answers "what has this person shipped?". */}
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4 lg:mt-16">
          {proof.map((item) => (
            <div key={item.label} className="bg-[var(--color-surface)] px-5 py-5">
              <dd className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-[var(--tracking-display)] text-[var(--color-text)] tabular-nums md:text-4xl">
                <CountUp to={item.value} suffix={item.suffix} />
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] tracking-[var(--tracking-label)] text-[var(--color-text-subtle)] uppercase">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>

        <a
          href="#about"
          className="mt-8 inline-flex w-fit flex-col items-center gap-1 text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-brand)]"
          aria-label={t('scrollAria')}
        >
          <span className="font-mono-label">{t('scroll')}</span>
          <ChevronDown className="scroll-cue-dot h-5 w-5" aria-hidden />
        </a>
      </Container>
    </section>
  );
}
