import type { ProjectStructure } from '@/content/schemas';

import homeScreen from '@/assets/img/projects/cloudix/home_screen.png';
import services from '@/assets/img/projects/cloudix/sercives.png';
import ourProjects from '@/assets/img/projects/cloudix/ourprojects.png';
import about from '@/assets/img/projects/cloudix/about.png';
import contactUs from '@/assets/img/projects/cloudix/contactus.png';

export const cloudix = {
  slug: 'cloudix',
  year: 2025,
  status: 'shipped',
  technologies: [
    'React 19',
    'TypeScript',
    'Vite 6',
    'React Router 7',
    'Tailwind CSS v4',
    'i18next',
    'Motion',
    'Gemini API',
    'EmailJS',
  ],
  categories: ['Frontend'],
  cover: {
    hue: 202,
    pattern: 'nodes',
  },
  links: {
    live: 'https://cloudix.siqva.com',
    repo: 'https://github.com/jacklusy/Cloudix',
    caseStudy: '/projects/cloudix',
  },
  featured: true,
  kind: 'client',
  confidential: false,
  sortWeight: 60,
  diagramId: 'cloudix-composition',
  thumbnail: {
    image: homeScreen,
  },
  gallery: [
    {
      image: services,
    },
    {
      image: ourProjects,
    },
    {
      image: about,
    },
    {
      image: contactUs,
    },
  ],
} satisfies ProjectStructure;
