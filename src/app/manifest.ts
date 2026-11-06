import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { defaultLocale } from '@/i18n/config';

/**
 * A web manifest has one URL for the whole site, so it is written in the
 * default language (German); the app name itself is language-neutral.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale: defaultLocale, namespace: 'meta' });

  return {
    name: t('siteTitle'),
    short_name: siteConfig.name,
    description: t('siteDescription'),
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    background_color: '#0b0d10',
    theme_color: '#0b0d10',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
