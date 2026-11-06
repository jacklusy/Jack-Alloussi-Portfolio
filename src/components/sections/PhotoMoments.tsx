import Image, { type StaticImageData } from 'next/image';
import { getTranslations } from 'next-intl/server';
import orangeTeam from '@/assets/img/portfolio-professional/orange-acadimy/orange-team.jpeg';
import orange1 from '@/assets/img/portfolio-professional/orange-acadimy/1694704888550.jpeg';
import orange2 from '@/assets/img/portfolio-professional/orange-acadimy/1701198673634.jpeg';
import orange3 from '@/assets/img/portfolio-professional/orange-acadimy/1694611907194.jpeg';
import { Reveal } from '@/components/motion/Reveal';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { ScrollParallax } from '@/components/motion/ScrollParallax';

const SHOTS: StaticImageData[] = [orangeTeam, orange1, orange2, orange3];
/** Per-tile parallax travel (px); alternating sign gives the collage depth. */
const DRIFT = [26, -22, 18, -30];

export async function PhotoMoments() {
  const t = await getTranslations('about.moments');
  const alts = t.raw('alts') as string[];

  return (
    <Reveal className="mt-12">
      <p className="font-mono-label mb-4 text-[var(--color-brand)]">{t('label')}</p>
      <p className="mb-5 max-w-[var(--prose-max)] text-[var(--color-text-muted)]">{t('intro')}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SHOTS.map((src, index) => (
          // Alternate columns sit lower and drift at different speeds, so the
          // row reads as a loose collage instead of a flat grid.
          <ScrollParallax
            key={src.src}
            distance={DRIFT[index] ?? 0}
            className={index % 2 === 1 ? 'md:mt-10' : ''}
          >
            <ClipReveal
              className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]"
              inset={10}
              radius="18px"
            >
              <Image
                src={src}
                alt={alts[index] ?? ''}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-[var(--duration-large)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
              />
            </ClipReveal>
          </ScrollParallax>
        ))}
      </div>
    </Reveal>
  );
}
