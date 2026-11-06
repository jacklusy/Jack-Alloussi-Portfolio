import type { Metadata } from 'next';
import { defaultLocale, localeMeta, locales, type Locale } from '@/i18n/config';

/** `/de` for home, `/de/projects` for a sub-page. `path` is language-neutral and starts with `/` (or is empty). */
export function localizedPath(locale: Locale, path = ''): string {
  return `/${locale}${path === '/' ? '' : path}`;
}

/**
 * Canonical + hreflang alternates for one page. Every language version points
 * at every other one (and `x-default` at German), which is what tells search
 * engines these URLs are translations of each other and not duplicates.
 */
export function localizedAlternates(locale: Locale, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedPath(l, path)])),
      'x-default': localizedPath(defaultLocale, path),
    },
  };
}

export function openGraphLocales(locale: Locale) {
  return {
    locale: localeMeta[locale].ogLocale,
    alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
  };
}
