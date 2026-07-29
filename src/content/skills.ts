import { skillGroupSchema, type SkillGroup } from '@/content/schemas';
import { z } from 'zod';

const skillsData = [
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'PHP' },
      { name: 'SQL' },
      { name: 'C#' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js' },
      { name: 'NestJS', projectSlugs: ['us-client-platform'] },
      { name: 'Express.js' },
      { name: 'Laravel 9–12' },
      { name: 'REST API design' },
      { name: 'ASP.NET Core' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [{ name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind CSS' }],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    skills: [
      { name: 'React Native (CLI & Expo)', projectSlugs: ['us-client-platform'] },
      { name: 'App Store & Play Store release' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    skills: [{ name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'Redis' }],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    skills: [
      { name: 'Docker' },
      { name: 'CI/CD' },
      { name: 'GitHub Actions' },
      { name: 'AWS' },
      { name: 'Google Cloud Platform' },
      { name: 'DigitalOcean' },
      { name: 'Vercel' },
    ],
  },
  {
    id: 'practices',
    label: 'Practices',
    skills: [
      { name: 'Clean Architecture' },
      { name: 'Domain-Driven Design' },
      { name: 'SOLID' },
      { name: 'Microservices' },
      { name: 'Unit & integration testing' },
      { name: 'Agile / Scrum' },
      { name: 'Jira' },
      { name: 'Code review' },
    ],
  },
] satisfies SkillGroup[];

export const skillGroups = z.array(skillGroupSchema).parse(skillsData);
