import { env } from '@/lib/env';

export const siteConfig = {
  name: 'Jack Alloussi',
  title: 'Jack Alloussi — Software Engineer',
  description:
    'Software engineer in Amman, Jordan. TypeScript, Node.js, NestJS, React, React Native. Open to relocation; EU Blue Card eligible. Graduating October 2026.',
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: 'en',
  ogImage: '/og/default.png',
  author: {
    name: 'Jack Alloussi',
    email: 'jackalloussi23@gmail.com',
    url: env.NEXT_PUBLIC_SITE_URL,
  },
} as const;
