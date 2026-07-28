import { profileSchema, type Profile } from '@/content/schemas';

const profileData = {
  name: 'Jack Alloussi',
  role: 'Software Engineer',
  tagline:
    'TypeScript · Node.js · NestJS · React · React Native — building web, API, and mobile applications for United States clients from Amman, Jordan.',
  location: 'Amman, Jordan',
  timezone: 'Asia/Amman (UTC+3)',
  email: 'jackalloussi23@gmail.com',
  phone: '+962 77 809 6919',
  bio: [
    'I am a software engineer with two years of full-time production experience delivering web, API, and mobile applications for United States clients. My day-to-day focus is backend work in TypeScript and Node.js — especially NestJS — alongside PHP and Laravel, with PostgreSQL, Redis, Docker, and CI/CD pipelines.',
    'What sets my path apart is building to client specification across many stacks. That breadth means I onboard quickly into unfamiliar codebases and ship within existing constraints rather than rewriting for comfort. I have formal training in Clean Architecture, Domain-Driven Design, and SOLID principles, and I am currently preparing for the AWS Certified Developer – Associate exam.',
    'I graduate with a BSc in Software Engineering in October 2026 and am seeking a backend or full-stack engineering role in Germany. I am eligible for the EU Blue Card and available to relocate.',
  ],
  portrait: {
    src: '/images/jack-alloussi.jpg',
    alt: 'Jack Alloussi, software engineer, standing with arms crossed in a formal setting',
    width: 800,
    height: 1000,
  },
  availability: {
    status: 'Open to opportunities',
    visaNote:
      'Jordanian national. Eligible for the EU Blue Card under Section 18g of the Residence Act (shortage occupation and recent graduate salary threshold). Requires work authorisation in Germany.',
    graduationDate: 'October 2026',
    relocationNote:
      '{{NEEDS_INPUT: available-to-relocate-from date and notice period in weeks}}',
  },
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/{{NEEDS_INPUT: github-username}}',
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/jackalloussi',
      external: true,
    },
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:jackalloussi23@gmail.com',
      external: false,
    },
  ],
  ctas: [
    {
      id: 'projects',
      label: 'View projects',
      href: '/projects',
      variant: 'primary' as const,
    },
    {
      id: 'cv',
      label: 'Download CV (PDF)',
      href: '/documents/Jack-Alloussi-Software-Engineer-CV.pdf',
      variant: 'secondary' as const,
      download: true,
    },
  ],
  cv: {
    href: '/documents/Jack-Alloussi-Software-Engineer-CV.pdf',
    label: 'Download CV (PDF)',
    filename: 'Jack-Alloussi-Software-Engineer-CV.pdf',
  },
  spokenLanguages: [
    { language: 'Arabic', level: 'Native' },
    {
      language: 'English',
      level: 'Professional working proficiency — IELTS {{NEEDS_INPUT: band and date}}',
    },
    { language: 'German', level: 'A1, in progress' },
  ],
  highlights: [
    { label: 'Production experience', value: '2 years full-time' },
    { label: 'Graduation', value: 'October 2026' },
    { label: 'Work authorisation', value: 'EU Blue Card eligible' },
    { label: 'Focus', value: 'Backend & full stack' },
  ],
} satisfies Profile;

export const profile = profileSchema.parse(profileData);
