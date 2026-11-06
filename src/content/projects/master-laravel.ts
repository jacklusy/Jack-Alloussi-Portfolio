import type { ProjectStructure } from '@/content/schemas';

export const masterLaravel = {
  slug: 'master-laravel',
  year: 2023,
  status: 'shipped',
  technologies: [
    'PHP 8.1',
    'Laravel 10',
    'MySQL',
    'Eloquent ORM',
    'Blade',
    'Laravel Breeze',
    'DomPDF',
    'Bootstrap',
    'Vite',
  ],
  categories: ['Backend', 'Full-stack'],
  cover: {
    hue: 12,
    pattern: 'grid',
  },
  links: {
    caseStudy: '/projects/master-laravel',
  },
  featured: false,
  kind: 'personal',
  confidential: false,
  sortWeight: 30,
  diagramId: 'master-laravel-layers',
} satisfies ProjectStructure;
