import { educationSchema, type Education } from '@/content/schemas';
import { z } from 'zod';

const educationData = [
  {
    id: 'bsc-se',
    institution: 'Al-Zaytoonah University of Jordan',
    degree: 'BSc',
    field: 'Software Engineering',
    location: 'Amman, Jordan',
    startDate: '2021-10',
    endDate: '2026-10',
    status: 'expected' as const,
    note: 'Studies paused during 2022–2023 to complete the Orange Coding Academy full-stack programme. GPA: {{NEEDS_INPUT: GPA percentage}}.',
  },
  {
    id: 'orange-academy',
    institution: 'Orange Coding Academy',
    degree: 'Full Stack Development Programme',
    field: 'Full Stack Development',
    location: 'Amman, Jordan',
    startDate: '2022-10',
    endDate: '2023-10',
    status: 'completed' as const,
    note: 'Seven-month intensive programme in JavaScript, PHP, Laravel, React, and Redux, followed by a one-month industry internship.',
  },
] satisfies Education[];

export const education = z.array(educationSchema).parse(educationData);
