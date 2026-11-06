import type { ProjectStructure } from '@/content/schemas';

export const angularSky = {
  slug: 'angular-sky',
  year: 2024,
  status: 'shipped',
  technologies: [
    'Angular 17',
    'TypeScript',
    'Angular Universal',
    'RxJS',
    'Express.js',
    'Bootstrap 5',
    'SSR',
  ],
  categories: ['Frontend'],
  cover: {
    hue: 348,
    pattern: 'planes',
  },
  group: {
    id: 'sky-academy',
  },
  links: {
    caseStudy: '/projects/angular-sky',
  },
  featured: false,
  kind: 'training',
  confidential: false,
  sortWeight: 10,
  diagramId: 'angular-sky-layers',
} satisfies ProjectStructure;
