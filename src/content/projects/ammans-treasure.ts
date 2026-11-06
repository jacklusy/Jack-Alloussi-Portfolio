import type { ProjectStructure } from '@/content/schemas';

import homeScreen from '@/assets/img/projects/amman-treasure/home_screen.png';
import menu from '@/assets/img/projects/amman-treasure/menu.png';
import galleryPage from '@/assets/img/projects/amman-treasure/gallery.png';
import aboutUs from '@/assets/img/projects/amman-treasure/aboutus.png';
import contactUs from '@/assets/img/projects/amman-treasure/contactus.png';

export const ammansTreasure = {
  slug: 'ammans-treasure',
  year: 2025,
  status: 'shipped',
  technologies: [
    'React 19',
    'TypeScript',
    'Vite 6',
    'Tailwind CSS v4',
    'i18next',
    'Motion',
    'RTL / i18n',
  ],
  categories: ['Frontend'],
  cover: {
    hue: 38,
    pattern: 'arcs',
  },
  links: {
    live: 'https://amman-treasure.siqva.com',
    caseStudy: '/projects/ammans-treasure',
  },
  featured: false,
  kind: 'client',
  confidential: false,
  sortWeight: 40,
  diagramId: 'ammans-treasure-spa',
  thumbnail: {
    image: homeScreen,
  },
  gallery: [
    {
      image: menu,
    },
    {
      image: galleryPage,
    },
    {
      image: aboutUs,
    },
    {
      image: contactUs,
    },
  ],
} satisfies ProjectStructure;
