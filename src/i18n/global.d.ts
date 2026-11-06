import type en from './messages/en.json';
import type { Locale } from './config';

/**
 * Types `useTranslations('ns')` / `t('key')` against the English catalogue, so
 * a misspelled or missing key is a compile error. The parity test
 * (`tests/unit/i18n.test.ts`) keeps the other languages in step with English.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
  }
}
