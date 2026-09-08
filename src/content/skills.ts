import { skillGroupSchema, type SkillGroup } from '@/content/schemas';
import { z } from 'zod';

const skillsData = [
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'TypeScript', projectSlugs: ['stockwell', 'pdf-nexus', 'stockwell-mobile'] },
      { name: 'JavaScript' },
      { name: 'PHP', projectSlugs: ['usns-backend', 'master-laravel'] },
      { name: 'SQL' },
      { name: 'C#', projectSlugs: ['bidding-management-system'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', projectSlugs: ['stockwell', 'pdf-nexus'] },
      { name: 'NestJS', projectSlugs: ['stockwell', 'pdf-nexus', 'us-client-platform'] },
      { name: 'Express.js' },
      { name: 'Laravel 9–12', projectSlugs: ['usns-backend', 'master-laravel'] },
      { name: 'REST API design', projectSlugs: ['stockwell', 'usns-backend'] },
      { name: 'ASP.NET Core', projectSlugs: ['bidding-management-system'] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', projectSlugs: ['cloudix', 'ammans-treasure'] },
      { name: 'Next.js', projectSlugs: ['pdf-nexus', 'usns-dashboard'] },
      { name: 'Tailwind CSS', projectSlugs: ['cloudix', 'usns-dashboard'] },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    skills: [
      { name: 'React Native (CLI & Expo)', projectSlugs: ['stockwell-mobile', 'usns-student-app', 'us-client-platform'] },
      { name: 'App Store & Play Store release', projectSlugs: ['us-client-platform'] },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    skills: [
      { name: 'PostgreSQL', projectSlugs: ['stockwell', 'pdf-nexus'] },
      { name: 'MySQL', projectSlugs: ['usns-backend', 'master-laravel'] },
      { name: 'Redis', projectSlugs: ['stockwell', 'pdf-nexus'] },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    skills: [
      { name: 'Docker', projectSlugs: ['stockwell', 'usns-backend'] },
      { name: 'CI/CD', projectSlugs: ['stockwell', 'pdf-nexus'] },
      { name: 'GitHub Actions', projectSlugs: ['stockwell', 'pdf-nexus'] },
      { name: 'AWS', projectSlugs: ['stockwell'] },
      { name: 'Oracle Cloud Infrastructure', projectSlugs: ['usns-backend', 'usns-dashboard', 'pdf-nexus'] },
      { name: 'Caddy', projectSlugs: ['usns-backend', 'usns-dashboard', 'pdf-nexus'] },
      { name: 'DigitalOcean' },
      { name: 'Vercel' },
    ],
  },
  {
    id: 'practices',
    label: 'Practices',
    skills: [
      { name: 'Clean Architecture', projectSlugs: ['stockwell', 'bidding-management-system'] },
      { name: 'Domain-Driven Design', projectSlugs: ['bidding-management-system', 'stockwell'] },
      { name: 'SOLID' },
      { name: 'Microservices' },
      { name: 'Unit & integration testing', projectSlugs: ['stockwell', 'stockwell-mobile'] },
      { name: 'Agile / Scrum' },
      { name: 'Jira' },
      { name: 'Code review' },
    ],
  },
] satisfies SkillGroup[];

export const skillGroups = z.array(skillGroupSchema).parse(skillsData);
