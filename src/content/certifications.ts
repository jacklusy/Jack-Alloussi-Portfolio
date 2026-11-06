import type { Certification } from '@/content/schemas';

/** Certification names live in `src/i18n/content/<locale>/certifications.json`, keyed by `id`. */
export const certificationsStructure = [
  {
    id: 'aws-dva',
    issuer: 'Amazon Web Services',
    skills: ['AWS', 'Cloud development'],
    status: 'in-progress',
  },
  {
    id: 'ielts',
    issuer: 'British Council / IDP',
    skills: ['English'],
    status: 'in-progress',
  },
  {
    id: 'sky-backend',
    issuer: 'Sky Software',
    skills: ['.NET', 'Clean Architecture', 'DDD', 'SOLID'],
    status: 'earned',
  },
  {
    id: 'sky-frontend',
    issuer: 'Sky Software',
    issueDate: '2024-08',
    skills: ['Angular', 'TypeScript'],
    status: 'earned',
  },
  {
    id: 'github-foundations',
    issuer: 'GitHub',
    skills: ['Git', 'GitHub'],
    status: 'earned',
  },
] satisfies Omit<Certification, 'name'>[];
