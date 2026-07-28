import { certificationSchema, type Certification } from '@/content/schemas';
import { z } from 'zod';

const certificationsData = [
  {
    id: 'aws-dva',
    name: 'AWS Certified Developer – Associate (DVA-C02)',
    issuer: 'Amazon Web Services',
    skills: ['AWS', 'Cloud development'],
    status: 'in-progress' as const,
  },
  {
    id: 'ielts',
    name: 'IELTS General Training',
    issuer: 'British Council / IDP',
    skills: ['English'],
    status: 'in-progress' as const,
  },
  {
    id: 'sky-backend',
    name: 'Backend Development: .NET, Clean Architecture, DDD, SOLID',
    issuer: 'Sky Software',
    issueDate: '{{NEEDS_INPUT: Sky Software backend year}}',
    skills: ['.NET', 'Clean Architecture', 'DDD', 'SOLID'],
    status: 'earned' as const,
  },
  {
    id: 'sky-frontend',
    name: 'Front-End Development: Angular and TypeScript',
    issuer: 'Sky Software',
    issueDate: '2024-08',
    skills: ['Angular', 'TypeScript'],
    status: 'earned' as const,
  },
  {
    id: 'github-foundations',
    name: 'GitHub Foundations',
    issuer: 'GitHub',
    skills: ['Git', 'GitHub'],
    status: 'earned' as const,
  },
] satisfies Certification[];

export const certifications = z.array(certificationSchema).parse(certificationsData);
