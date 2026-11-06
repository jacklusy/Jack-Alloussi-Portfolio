'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type WordRevealProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  stagger?: number;
};

/**
 * Headline that rises into place word by word when scrolled into view.
 * Splits on whole words only — never letters — so Arabic keeps its joined
 * letterforms. The full text is exposed to assistive tech through `aria-label`
 * and the split spans are hidden from it.
 *
 * The markup is identical with and without reduced motion (only the initial
 * offset differs), so server HTML and client render always agree.
 */
export function WordReveal({ text, as: Tag = 'h2', className, stagger = 0.06 }: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden className="inline">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span
              // The mask clips the rising word; padding keeps descenders visible.
              className="inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={prefersReducedMotion ? false : { y: '115%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7, delay: index * stagger, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </span>
            {/* A real space between the blocks keeps normal line wrapping. */}
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
