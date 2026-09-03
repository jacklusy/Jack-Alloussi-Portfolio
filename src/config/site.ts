import { env } from '@/lib/env';

export const siteConfig = {
  name: 'Jack Alloussi',
  title: 'Jack Alloussi — Software Engineer',
  description:
    'Software engineer in Amman, Jordan. TypeScript, Node.js, NestJS, React, React Native. Open to relocation; EU Blue Card eligible. Graduating October 2026.',
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: 'en_GB',
  ogImage: '/opengraph-image',
  /**
   * Bumped by hand when page content meaningfully changes. Stamping
   * `new Date()` on every build makes every URL look freshly modified, which
   * search engines learn to discount.
   */
  lastModified: '2026-09-03',
  keywords: [
    'Jack Alloussi',
    'Jack Alloussi software engineer',
    'Jack Alloussi portfolio',
    'Jack Alloussi developer',
    'Software Engineer Amman',
    'NestJS developer',
    'React Native developer',
    'TypeScript backend engineer',
    'EU Blue Card software engineer',
  ],
  author: {
    name: 'Jack Alloussi',
    email: 'jackalloussi23@gmail.com',
    url: env.NEXT_PUBLIC_SITE_URL,
  },
} as const;
