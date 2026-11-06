import type { ProjectStructure } from '@/content/schemas';

import dashboard from '@/assets/img/projects/usns/dash.png';
import users from '@/assets/img/projects/usns/Users.png';
import faculties from '@/assets/img/projects/usns/Faculties.png';
import departments from '@/assets/img/projects/usns/Departments.png';

export const usnsDashboard = {
  slug: 'usns-dashboard',
  year: 2026,
  status: 'shipped',
  technologies: [
    'TypeScript',
    'Next.js 16',
    'React',
    'Tailwind CSS',
    'Zod',
    'Redux Toolkit',
    'Firebase Cloud Messaging',
    'Docker',
    'Caddy',
  ],
  categories: ['Frontend'],
  cover: {
    hue: 250,
    pattern: 'grid',
  },
  group: {
    id: 'usns',
  },
  links: {
    live: 'https://usns.siqva.com',
    repo: 'https://github.com/jacklusy/usns-next',
    caseStudy: '/projects/usns-dashboard',
    demoAccounts: [
      {
        identifier: 'president@zuj.edu.jo',
        password: 'ZUJ_SecureStaging2026!',
      },
      {
        identifier: 'dba@zuj.edu.jo',
        password: 'ZUJ_SecureStaging2026!',
      },
      {
        identifier: 'dean.fsit@zuj.edu.jo',
        password: 'ZUJ_SecureStaging2026!',
      },
    ],
  },
  featured: false,
  kind: 'professional',
  confidential: false,
  sortWeight: 70,
  diagramId: 'usns-dashboard-layers',
  thumbnail: {
    image: dashboard,
  },
  gallery: [
    {
      image: users,
    },
    {
      image: faculties,
    },
    {
      image: departments,
    },
  ],
} satisfies ProjectStructure;
