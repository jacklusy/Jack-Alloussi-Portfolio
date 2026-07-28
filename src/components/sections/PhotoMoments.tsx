import Image, { type StaticImageData } from 'next/image';
import orangeTeam from '@/assets/img/portfolio-professional/orange-acadimy/orange-team.jpeg';
import orange1 from '@/assets/img/portfolio-professional/orange-acadimy/1694704888550.jpeg';
import orange2 from '@/assets/img/portfolio-professional/orange-acadimy/1701198673634.jpeg';
import orange3 from '@/assets/img/portfolio-professional/orange-acadimy/1694611907194.jpeg';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

type Shot = {
  src: StaticImageData;
  alt: string;
};

const shots: Shot[] = [
  {
    src: orangeTeam,
    alt: 'Jack Alloussi with the Orange Coding Academy cohort',
  },
  {
    src: orange1,
    alt: 'Orange Coding Academy programme moment',
  },
  {
    src: orange2,
    alt: 'Jack Alloussi during the Orange Coding Academy',
  },
  {
    src: orange3,
    alt: 'Orange Coding Academy workshop session',
  },
];

export function PhotoMoments() {
  return (
    <Reveal className="mt-12">
      <p className="font-mono-label mb-4 text-[var(--color-brand)]">Moments</p>
      <p className="mb-5 max-w-[var(--prose-max)] text-[var(--color-text-muted)]">
        Orange Coding Academy — the intensive year that shaped how I ship under real delivery pressure.
      </p>
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" stagger={0.05}>
        {shots.map((shot) => (
          <StaggerItem key={shot.alt} className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-[var(--duration-large)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}
