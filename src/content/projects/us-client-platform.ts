import type { ProjectStructure } from '@/content/schemas';

export const usClientPlatform = {
  slug: 'us-client-platform',
  year: 2024,
  status: 'shipped',
  technologies: [
    'TypeScript',
    'NestJS',
    'Express.js',
    'Laravel',
    'PostgreSQL',
    'Redis',
    'React',
    'Next.js',
    'React Native',
    'Expo',
    'Docker',
    'GCP',
  ],
  categories: ['Backend', 'Mobile', 'DevOps'],
  cover: {
    hue: 214,
    pattern: 'nodes',
  },
  links: {
    caseStudy: '/projects/us-client-platform',
  },
  featured: true,
  kind: 'professional',
  confidential: true,
  sortWeight: 110,
  diagramId: 'client-platform-layers',
} satisfies ProjectStructure;
