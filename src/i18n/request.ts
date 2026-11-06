import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { formats } from '@/i18n/formats';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    formats,
    // Dates are rendered for the owner's home timezone so the server render and
    // the browser always agree.
    timeZone: 'Asia/Amman',
  };
});
