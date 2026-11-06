import type { Education } from '@/content/schemas';

type EducationText = 'degree' | 'field' | 'location' | 'note';

/** Text (degree, field, location, note) lives in `src/i18n/content/<locale>/education.json`, keyed by `id`. */
export const educationStructure = [
  {
    id: 'bsc-se',
    institution: 'Al-Zaytoonah University of Jordan',
    startDate: '2021-10',
    endDate: '2026-10',
    status: 'expected',
  },
  {
    id: 'orange-academy',
    institution: 'Orange Coding Academy',
    startDate: '2022-10',
    endDate: '2023-10',
    status: 'completed',
  },
] satisfies Omit<Education, EducationText>[];
