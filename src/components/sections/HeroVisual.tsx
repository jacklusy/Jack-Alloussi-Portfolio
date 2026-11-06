'use client';

import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { ScrollParallax } from '@/components/motion/ScrollParallax';

export type HeroVisualProps = {
  /** Back and front screenshot, in that order. Decorative: the real, described
   *  versions live on each project page. */
  tiles: [StaticImageData, StaticImageData];
  chips: [string, string];
  /** The status panel; stays in normal flow so it is the only thing shown on small screens. */
  children: ReactNode;
};

function BrowserTile({ src, sizes }: { src: StaticImageData; sizes: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />
      </div>
      <Image
        src={src}
        alt=""
        placeholder="blur"
        sizes={sizes}
        className="block aspect-[16/10] h-auto w-full object-cover object-top"
      />
    </div>
  );
}

/**
 * Layered hero composition (large screens): two product screenshots at
 * different depths drifting against the scroll, two floating proof chips, and
 * the status panel overlapping the front tile. Everything here is decoration
 * on top of content that stays in the DOM and readable without it.
 */
export function HeroVisual({ tiles, chips, children }: HeroVisualProps) {
  const [back, front] = tiles;

  return (
    <div className="relative lg:min-h-[34rem]">
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <ScrollParallax distance={46} className="absolute -top-2 start-[8%] w-[74%] -rotate-2 rtl:rotate-2">
          <BrowserTile src={back} sizes="(min-width: 1024px) 28vw, 0px" />
        </ScrollParallax>

        <ScrollParallax distance={-30} className="absolute top-[30%] end-[-2%] w-[70%] rotate-2 rtl:-rotate-2">
          <BrowserTile src={front} sizes="(min-width: 1024px) 28vw, 0px" />
        </ScrollParallax>

        <ScrollParallax distance={-70} className="absolute top-[4%] end-[4%]">
          <span className="float-slow inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] text-[var(--color-text)] shadow-[var(--shadow-md)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
            {chips[0]}
          </span>
        </ScrollParallax>

        <ScrollParallax distance={60} className="absolute top-[17%] start-[-10%]">
          <span className="float-slower inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] text-[var(--color-text)] shadow-[var(--shadow-md)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            {chips[1]}
          </span>
        </ScrollParallax>
      </div>

      <div className="relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:ms-auto lg:w-[82%]">
        {children}
      </div>
    </div>
  );
}
