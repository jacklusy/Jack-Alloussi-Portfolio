import type { ProjectStructure } from '@/content/schemas';

export const stockwellMobile = {
  slug: 'stockwell-mobile',
  year: 2026,
  status: 'in-progress',
  technologies: [
    'React Native 0.86',
    'TypeScript',
    'SQLite',
    'Drizzle ORM',
    'op-sqlite',
    'Vision Camera',
    'FlashList',
    'Sentry',
    'Jest',
  ],
  categories: ['Mobile', 'Architecture'],
  cover: {
    hue: 32,
    pattern: 'arcs',
  },
  group: {
    id: 'stockwell',
  },
  links: {
    caseStudy: '/projects/stockwell-mobile',
  },
  featured: true,
  kind: 'personal',
  confidential: false,
  sortWeight: 90,
  diagramId: 'stockwell-mobile-sync',
} satisfies ProjectStructure;
