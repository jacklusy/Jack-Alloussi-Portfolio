import type { ProfileStructure } from '@/content/schemas';

/**
 * Language-neutral profile facts. The words a visitor reads (role, bio,
 * availability, labels …) live in `src/i18n/content/<locale>/profile.json`.
 */
export const profileStructure = {
  name: 'Jack Alloussi',
  email: 'jackalloussi23@gmail.com',
  phone: '+962 77 809 6919',
  timezone: 'Asia/Amman (UTC+3)',
  portrait: {
    src: '/images/jack-alloussi.jpg',
    width: 800,
    height: 1000,
  },
  socials: [
    { id: 'github', href: 'https://github.com/jacklusy', external: true },
    { id: 'linkedin', href: 'https://linkedin.com/in/jackalloussi', external: true },
    { id: 'email', href: 'mailto:jackalloussi23@gmail.com', external: false },
  ],
  ctas: [
    { id: 'projects', href: '/projects', variant: 'primary' },
    { id: 'cv', href: '/pdf/CV_Jack_Alloussi.pdf', variant: 'secondary', download: true },
  ],
  cv: {
    href: '/pdf/CV_Jack_Alloussi.pdf',
    filename: 'CV_Jack_Alloussi.pdf',
  },
  /** Same order as `spokenLanguages` in the locale JSON. */
  spokenLanguageCodes: ['ar', 'en', 'de'],
} satisfies ProfileStructure;
