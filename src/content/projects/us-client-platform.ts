import type { Project } from '@/content/schemas';

export const usClientPlatform = {
  slug: 'us-client-platform',
  title: 'Multi-stack client delivery platform',
  summary:
    'Production web, API, and mobile delivery for United States clients — NestJS, Laravel, React Native, and CI/CD across multiple cloud targets, including 15+ mobile applications released to the app stores.',
  description:
    'Ongoing full-time work designing and operating backend services, React and Next.js frontends, and React Native apps for US-based clients. Client identities and proprietary details are confidential; this case study describes architecture, decisions, and personal contribution in generalised terms.',
  role: 'Software Engineer',
  timeframe: '2024 – Present',
  year: 2024,
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
    'Expo',
    'Docker',
    'GCP',
  ],
  categories: ['Backend', 'Mobile', 'DevOps'],
  cover: { hue: 214, pattern: 'nodes' as const },
  metrics: [
    { label: 'Mobile apps released', value: '15+' },
    { label: 'Cloud targets', value: '5' },
    { label: 'Delivery cadence', value: '2-week Agile' },
  ],
  links: {
    caseStudy: '/projects/us-client-platform',
  },
  featured: true,
  kind: 'professional' as const,
  confidential: true,
  sortWeight: 110,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'A product delivery practice serving United States clients needed continuous delivery of web APIs, admin and customer-facing frontends, and cross-platform mobile apps. Work runs in two-week Agile cycles with direct English-language stakeholder communication. Client names and product brands are confidential.',
    problem:
      'Ship reliable features across heterogeneous stacks (TypeScript/NestJS and PHP/Laravel backends, React/Next.js web, React Native mobile) without destabilising production systems already in use by real users — while keeping deployment repeatable across several cloud providers.',
    approach:
      'Own vertical slices end-to-end where needed: design REST APIs, persist with PostgreSQL and Redis, containerise with Docker, and maintain CI/CD. Mobile releases include provisioning, signing, and store submission across both React Native CLI and Expo workflows. Prefer incremental change inside existing architectures over speculative rewrites.',
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
      {
        decision: 'Use both React Native CLI and Expo rather than committing to one workflow',
        alternatives: 'Standardising every mobile project on a single toolchain',
        reasoning:
          'Projects needing custom native modules justify the CLI; projects that do not ship faster on Expo with managed builds and over-the-air updates.',
        tradeoff:
          'Two mobile release pipelines to keep current, and a per-project decision that has to be made deliberately rather than by default.',
      },
    ],
    challenges: [
      'Coordinating App Store and Play Store release requirements (signing, provisioning, review) alongside API changes.',
      'Operating the same engineering practices across NestJS and Laravel codebases without diluting quality bars for reviews and testing.',
      'Keeping production behaviour predictable when requirements arrive directly from English-speaking stakeholders mid-sprint.',
    ],
    outcomes: [
      'Backend services and frontends maintained in production for United States clients across multiple applications.',
      'More than fifteen cross-platform mobile applications built and released with React Native CLI and Expo, including provisioning, signing, and store submission.',
      'Applications running across GCP, DigitalOcean, Vercel, Railway, and Render with repeatable CI/CD.',
    ],
    retrospective:
      'I would invest earlier in shared observability conventions (structured logs, correlation IDs, and health probes) across every stack we touch, so operational learning transfers faster between NestJS and Laravel services. I would also push harder for a single documented deployment playbook per environment class instead of rediscovering edge cases per host.',
  },
} satisfies Project;
