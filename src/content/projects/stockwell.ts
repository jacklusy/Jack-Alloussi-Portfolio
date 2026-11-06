import type { ProjectStructure } from '@/content/schemas';

import auth from '@/assets/img/projects/stockwell/auth.png';
import apis from '@/assets/img/projects/stockwell/apis.png';

export const stockwell = {
  slug: 'stockwell',
  year: 2026,
  status: 'shipped',
  technologies: [
    'TypeScript',
    'NestJS',
    'PostgreSQL',
    'TypeORM',
    'Redis',
    'BullMQ',
    'Docker',
    'Testcontainers',
    'Terraform',
    'AWS',
    'Oracle Cloud Infrastructure',
    'Caddy',
    'GitHub Actions',
    'Clean Architecture',
  ],
  categories: ['Backend', 'Architecture', 'DevOps'],
  cover: {
    hue: 214,
    pattern: 'planes',
  },
  group: {
    id: 'stockwell',
  },
  links: {
    live: 'https://stockwell.siqva.com/api/docs',
    repo: 'https://github.com/jacklusy/stockwell',
    caseStudy: '/projects/stockwell',
  },
  featured: true,
  kind: 'personal',
  confidential: false,
  sortWeight: 100,
  diagramId: 'stockwell-concurrency',
  thumbnail: {
    image: auth,
  },
  gallery: [
    {
      image: apis,
    },
  ],
} satisfies ProjectStructure;
