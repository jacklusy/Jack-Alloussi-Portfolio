import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from '@/i18n/config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every URL carries its language: /de, /en, /fr, /ar. Good for sharing links
  // and for search engines (one URL per language, linked with hreflang).
  localePrefix: 'always',
  // New visitors always get German. The browser's Accept-Language header must
  // not override that; only an explicit choice (the NEXT_LOCALE cookie, set by
  // the language switcher) does — see `proxy.ts`.
  localeDetection: false,
});
