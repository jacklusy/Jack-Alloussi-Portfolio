import type { ProjectStructure } from '@/content/schemas';

export const usnsBackend = {
  slug: 'usns-backend',
  year: 2026,
  status: 'shipped',
  technologies: [
    'PHP 8',
    'Laravel 12',
    'MySQL',
    'Laravel Sanctum',
    'Redis',
    'Queues',
    'Docker',
    'Docker Compose',
    'Caddy',
    'FCM',
  ],
  categories: ['Backend', 'DevOps'],
  cover: {
    hue: 232,
    pattern: 'nodes',
  },
  group: {
    id: 'usns',
  },
  links: {
    live: 'https://usns-backend.siqva.com',
    repo: 'https://github.com/jacklusy/USNS',
    caseStudy: '/projects/usns-backend',
  },
  featured: true,
  kind: 'professional',
  confidential: false,
  sortWeight: 80,
  diagramId: 'usns-backend-layers',
} satisfies ProjectStructure;
