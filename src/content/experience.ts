import type { Role } from '@/content/schemas';

/** Text fields of a role: translated per locale in `src/i18n/content/<locale>/experience.json`. */
type RoleText = 'title' | 'employmentType' | 'location' | 'summary' | 'achievements' | 'confidentialityNote';

/**
 * Single source of truth for employment dates — must match CV and LinkedIn.
 * Roles are keyed by `id` in the locale JSON.
 */
export const experienceStructure = [
  {
    id: 'csc-beyond-se',
    company: 'CSC Beyond',
    locationType: 'onsite',
    startDate: '2024-09',
    endDate: 'present',
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
      'CI/CD',
    ],
  },
  {
    id: 'csc-beyond-junior',
    company: 'CSC Beyond',
    locationType: 'onsite',
    startDate: '2023-05',
    endDate: '2023-07',
    technologies: ['PHP', 'Laravel', 'Retool', 'Shopify'],
  },
  {
    id: 'aiq-intern',
    company: 'AI Quintessential',
    locationType: 'onsite',
    startDate: '2023-03',
    endDate: '2023-05',
    technologies: ['WordPress', 'Framer'],
  },
] satisfies Omit<Role, RoleText>[];
