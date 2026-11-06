/**
 * Locale registry. Everything language-specific that is *not* a translated
 * string (direction, native name, Open Graph locale) lives here so routing,
 * the layout, the switcher and the SEO helpers read from one place.
 */

export const locales = ['de', 'en', 'fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

/** German is the default for new visitors; see `routing.ts`. */
export const defaultLocale: Locale = 'de';

export type Direction = 'ltr' | 'rtl';

export type LocaleMeta = {
  /** The language's own name, always shown in that language. */
  nativeName: string;
  /** Short code for compact UI (switcher button). */
  short: string;
  dir: Direction;
  /** `og:locale` value. */
  ogLocale: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  de: { nativeName: 'Deutsch', short: 'DE', dir: 'ltr', ogLocale: 'de_DE' },
  en: { nativeName: 'English', short: 'EN', dir: 'ltr', ogLocale: 'en_GB' },
  fr: { nativeName: 'Français', short: 'FR', dir: 'ltr', ogLocale: 'fr_FR' },
  ar: { nativeName: 'العربية', short: 'AR', dir: 'rtl', ogLocale: 'ar_JO' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): Direction {
  return localeMeta[locale].dir;
}

/** Name of the cookie next-intl uses to remember an explicit language choice. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';
