import type { ProjectStructure } from '@/content/schemas';

import homePage from '@/assets/img/projects/pdfnexus/home_page.png';
import tools from '@/assets/img/projects/pdfnexus/tools.png';
import workspace from '@/assets/img/projects/pdfnexus/workspace.png';
import feedback from '@/assets/img/projects/pdfnexus/feedback.png';

export const pdfNexus = {
  slug: 'pdf-nexus',
  year: 2026,
  status: 'shipped',
  technologies: [
    'TypeScript',
    'Next.js 15',
    'React 19',
    'NestJS',
    'PostgreSQL',
    'Prisma',
    'Redis',
    'BullMQ',
    'WebAssembly',
    'Web Workers',
    'IndexedDB',
    'Zod',
    'Turborepo',
    'Docker',
    'Caddy',
  ],
  categories: ['Full-stack', 'Frontend', 'Backend'],
  cover: {
    hue: 158,
    pattern: 'glyphs',
  },
  links: {
    live: 'https://pdfnexus.siqva.com',
    repo: 'https://github.com/jacklusy/PDFNexus',
    caseStudy: '/projects/pdf-nexus',
  },
  featured: true,
  kind: 'personal',
  confidential: false,
  sortWeight: 95,
  diagramId: 'pdf-nexus-hybrid',
  thumbnail: {
    image: homePage,
  },
  gallery: [
    {
      image: tools,
    },
    {
      image: workspace,
    },
    {
      image: feedback,
    },
  ],
} satisfies ProjectStructure;
