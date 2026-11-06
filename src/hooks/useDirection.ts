'use client';

import { useLocale } from 'next-intl';
import { getDirection, type Direction, type Locale } from '@/i18n/config';

/** Text direction of the current language: `'ltr'` or `'rtl'`. */
export function useDirection(): Direction {
  return getDirection(useLocale() as Locale);
}

/** `1` in left-to-right languages, `-1` in right-to-left ones. Multiply physical X offsets by this. */
export function useInlineSign(): 1 | -1 {
  return useDirection() === 'rtl' ? -1 : 1;
}
