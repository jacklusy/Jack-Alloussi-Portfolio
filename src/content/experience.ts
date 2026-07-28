import { roleSchema, type Role } from '@/content/schemas';
import { z } from 'zod';

/**
 * Single source of truth for employment dates — must match CV and LinkedIn.
 */
const experienceData = [
  {
    id: 'csc-beyond-se',
    title: 'Software Engineer',
    company: 'CSC Beyond',
    employmentType: 'Full-time',
    location: 'Amman, Jordan',
    locationType: 'onsite' as const,
    startDate: '2024-09',
    endDate: 'present' as const,
    summary:
      'Custom software delivery for United States based clients across web, API, and mobile platforms.',
    achievements: [
      'Design, build, and maintain production backend services in TypeScript (NestJS, Express.js) and PHP (Laravel 9–12), backed by PostgreSQL and Redis, across {{NEEDS_INPUT: number of client applications}} client applications.',
      'Develop and release cross-platform mobile applications using React Native CLI, including provisioning, signing, and submission to the Apple App Store and Google Play Store.',
      'Build React and Next.js frontends in TypeScript, integrated with internally developed REST APIs.',
      'Containerise services with Docker and maintain CI/CD pipelines, reducing deployment time from {{NEEDS_INPUT: before minutes}} to {{NEEDS_INPUT: after minutes}} minutes.',
      'Deploy and operate applications on Google Cloud Platform, DigitalOcean, Vercel, Railway, and Render; {{NEEDS_INPUT: number of production apps}} applications currently running in production.',
      'Work in a two-week Agile cycle using Jira, participating in sprint planning, code review, and direct requirements discussions with English-speaking client stakeholders.',
      '{{NEEDS_INPUT: one measured result — e.g. p95 API latency improvement with Redis caching}}',
    ],
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
      'Docker',
      'GCP',
      'CI/CD',
    ],
    confidentialityNote:
      'Client work is confidential. Descriptions are generalised: system type, scale, technologies, and personal contribution only — no client names, schemas, or proprietary logic.',
  },
  {
    id: 'csc-beyond-junior',
    title: 'Junior Full Stack Developer',
    company: 'CSC Beyond',
    employmentType: 'Full-time',
    location: 'Amman, Jordan',
    locationType: 'onsite' as const,
    startDate: '2023-05',
    endDate: '2023-07',
    summary: 'Backend features and internal tooling for client web applications.',
    achievements: [
      'Developed backend features in PHP and Laravel for client web applications.',
      'Built internal tooling and e-commerce integrations using Retool and Shopify.',
    ],
    technologies: ['PHP', 'Laravel', 'Retool', 'Shopify'],
  },
  {
    id: 'aiq-intern',
    title: 'Web Development Intern',
    company: 'AI Quintessential',
    employmentType: 'Internship',
    location: 'Amman, Jordan',
    locationType: 'onsite' as const,
    startDate: '2023-03',
    endDate: '2023-05',
    summary:
      'Internship completed as part of the Orange Coding Academy full-stack programme.',
    achievements: [
      'Built and maintained WordPress websites; contributed to UI/UX design workflows using Framer.',
    ],
    technologies: ['WordPress', 'Framer'],
  },
] satisfies Role[];

export const experience = z.array(roleSchema).parse(experienceData);
