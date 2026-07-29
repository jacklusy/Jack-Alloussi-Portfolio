import { projectSchema, type Project } from '@/content/schemas';

/**
 * Professional work generalised for confidentiality.
 * Personal/publishable projects are omitted until names and URLs are ready.
 */
const projectsData = [
  {
    slug: 'us-client-platform',
    title: 'Multi-stack client delivery platform',
    summary:
      'Production web, API, and mobile delivery for United States clients — NestJS, Laravel, React Native, and CI/CD across multiple cloud targets.',
    description:
      'Ongoing full-time work designing and operating backend services, React/Next.js frontends, and React Native apps for US-based clients. Client identities and proprietary details are confidential; this case study describes architecture, decisions, and personal contribution in generalised terms.',
    role: 'Software Engineer',
    timeframe: '2024 – Present',
    status: 'shipped' as const,
    technologies: [
      'TypeScript',
      'NestJS',
      'Express.js',
      'Laravel',
      'PostgreSQL',
      'Redis',
      'React',
      'Next.js',
      'React Native',
      'Docker',
      'GCP',
    ],
    categories: ['Backend', 'Mobile', 'DevOps'],
    thumbnail: {
      src: '/images/projects/client-platform.svg',
      alt: 'Abstract diagram representing layered API and mobile delivery architecture',
      width: 1200,
      height: 750,
    },
    links: {
      caseStudy: '/projects/us-client-platform',
    },
    featured: true,
    kind: 'professional' as const,
    confidential: true,
    hasCaseStudy: true as const,
    caseStudy: {
      context:
        'A product delivery practice serving United States clients needed continuous delivery of web APIs, admin/customer-facing frontends, and cross-platform mobile apps. Work runs in two-week Agile cycles with direct English-language stakeholder communication. Client names and product brands are confidential.',
      problem:
        'Ship reliable features across heterogeneous stacks (TypeScript/NestJS and PHP/Laravel backends, React/Next.js web, React Native mobile) without destabilising production systems already in use by real users — while keeping deployment repeatable across several cloud providers.',
      approach:
        'Own vertical slices end-to-end where needed: design REST APIs, persist with PostgreSQL and Redis, containerise with Docker, and maintain CI/CD. Mobile releases include provisioning, signing, and store submission. Prefer incremental change inside existing architectures over speculative rewrites.',
      architecture: {
        diagramId: 'client-platform-layers',
        altText:
          'Three-layer diagram: clients (web and mobile) call REST APIs backed by NestJS or Laravel services, with PostgreSQL and Redis below, packaged in Docker and deployed via CI/CD to cloud hosts.',
      },
      decisions: [
        {
          decision: 'Meet clients on their stack rather than standardising everything on one framework',
          alternatives: 'Rewrite all services onto a single NestJS platform',
          reasoning:
            'Client codebases and team familiarity already existed; forcing a rewrite would delay delivery and raise risk for live systems.',
          tradeoff:
            'Higher context-switching cost and broader skill surface area in exchange for faster onboarding and safer incremental delivery.',
        },
        {
          decision: 'Containerise and automate CI/CD early for services that ship frequently',
          alternatives: 'Manual SSH deploys or ad-hoc scripts per environment',
          reasoning:
            'Multiple apps across GCP, DigitalOcean, Vercel, Railway, and Render made manual process error-prone and slow.',
          tradeoff:
            'Upfront pipeline investment in exchange for faster, more consistent releases afterward.',
        },
      ],
      challenges: [
        'Coordinating App Store and Play Store release requirements (signing, provisioning, review) alongside API changes.',
        'Operating the same engineering practices across NestJS and Laravel codebases without diluting quality bars for reviews and testing.',
        'Keeping production behaviour predictable when requirements arrive directly from English-speaking stakeholders mid-sprint.',
      ],
      outcomes: [
        'Backend services and frontends maintained in production for United States clients across multiple applications.',
        'Applications running across GCP, DigitalOcean, Vercel, Railway, and Render with repeatable CI/CD.',
        'Cross-platform React Native apps released to the Apple App Store and Google Play Store.',
      ],
      retrospective:
        'I would invest earlier in shared observability conventions (structured logs, correlation IDs, and health probes) across every stack we touch, so operational learning transfers faster between NestJS and Laravel services. I would also push harder for a single documented deployment playbook per environment class instead of rediscovering edge cases per host.',
    },
  },
] satisfies Project[];

export const projects = projectsData.map((project) => projectSchema.parse(project));

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

export function getProjectsByTechnology(tech: string): Project[] {
  const normalised = tech.toLowerCase();
  return projects.filter((project) =>
    project.technologies.some((item) => item.toLowerCase() === normalised),
  );
}
