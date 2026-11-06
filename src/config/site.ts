import { env } from '@/lib/env';

/**
 * Language-neutral site facts. Anything a visitor or a search engine reads as
 * prose (title, description, keywords) lives in `src/i18n/messages/<locale>.json`
 * under `meta`.
 */
export const siteConfig = {
  name: 'Jack Alloussi',
  url: env.NEXT_PUBLIC_SITE_URL,
  /**
   * Bumped by hand when page content meaningfully changes. Stamping
   * `new Date()` on every build makes every URL look freshly modified, which
   * search engines learn to discount.
   */
  lastModified: '2026-09-03',
  author: {
    name: 'Jack Alloussi',
    email: 'jackalloussi23@gmail.com',
    url: env.NEXT_PUBLIC_SITE_URL,
  },
} as const;
