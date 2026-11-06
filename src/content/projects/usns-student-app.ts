import type { ProjectStructure } from '@/content/schemas';

export const usnsStudentApp = {
  slug: 'usns-student-app',
  year: 2026,
  status: 'shipped',
  technologies: [
    'React Native',
    'Expo',
    'TypeScript',
    'Expo Router',
    'Zod',
    'Firebase Cloud Messaging',
    'i18n / RTL',
    'EAS Build',
  ],
  categories: ['Mobile'],
  cover: {
    hue: 190,
    pattern: 'waves',
  },
  group: {
    id: 'usns',
  },
  links: {
    repo: 'https://github.com/jacklusy/usnsnative',
    caseStudy: '/projects/usns-student-app',
  },
  featured: false,
  kind: 'professional',
  confidential: false,
  sortWeight: 65,
  diagramId: 'usns-student-app-layers',
} satisfies ProjectStructure;
