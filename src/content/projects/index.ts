import { projectSchema, type Project } from '@/content/schemas';

/**
 * Professional work generalised for confidentiality.
 * Personal/publishable projects use {{NEEDS_INPUT}} until real names and URLs are supplied.
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
            'Upfront pipeline investment; reduced deployment time and more consistent releases afterward. Exact before/after minutes: {{NEEDS_INPUT: deployment time before and after}}.',
        },
      ],
      challenges: [
        'Coordinating App Store and Play Store release requirements (signing, provisioning, review) alongside API changes.',
        'Operating the same engineering practices across NestJS and Laravel codebases without diluting quality bars for reviews and testing.',
        'Keeping production behaviour predictable when requirements arrive directly from English-speaking stakeholders mid-sprint.',
      ],
      outcomes: [
        'Backend services and frontends maintained in production for United States clients across {{NEEDS_INPUT: number of client applications}} applications.',
        '{{NEEDS_INPUT: number of production apps}} applications currently running across GCP, DigitalOcean, Vercel, Railway, and Render.',
        'Cross-platform React Native apps released to the Apple App Store and Google Play Store.',
        '{{NEEDS_INPUT: one measured operational or performance outcome}}',
      ],
      retrospective:
        'I would invest earlier in shared observability conventions (structured logs, correlation IDs, and health probes) across every stack we touch, so operational learning transfers faster between NestJS and Laravel services. I would also push harder for a single documented deployment playbook per environment class instead of rediscovering edge cases per host.',
    },
  },
  {
    slug: 'multi-tenant-api',
    title: '{{NEEDS_INPUT: project 1 name}} — Multi-tenant REST API',
    summary:
      'NestJS multi-tenant API with Clean Architecture, Testcontainers-backed integration tests, and AWS deployment via Terraform.',
    description:
      'A personal/portfolio API demonstrating layered architecture, idempotent writes, rate limiting, BullMQ jobs, and OpenAPI documentation. Intended as a public evidence repo once named and published.',
    role: 'Sole engineer',
    timeframe: '{{NEEDS_INPUT: project 1 timeframe}}',
    status: 'in-progress' as const,
    technologies: [
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'Docker',
      'BullMQ',
      'Testcontainers',
      'AWS',
      'Terraform',
    ],
    categories: ['Backend', 'Architecture'],
    thumbnail: {
      src: '/images/projects/multi-tenant-api.svg',
      alt: 'Abstract schematic of a multi-tenant API with database and cache layers',
      width: 1200,
      height: 750,
    },
    links: {
      live: '{{NEEDS_INPUT: project 1 live URL}}',
      repo: '{{NEEDS_INPUT: project 1 GitHub URL}}',
      caseStudy: '/projects/multi-tenant-api',
    },
    featured: true,
    kind: 'personal' as const,
    confidential: false,
    hasCaseStudy: true as const,
    caseStudy: {
      context:
        'A portfolio-grade API meant to show how I design multi-tenant backends when the repository can be public — Clean Architecture boundaries, DDD-inspired modules, and CI that fails on weak tests.',
      problem:
        'Many sample APIs skip the hard parts: real database tests, idempotency, rate limits, and operable deployments. Recruiters who open the repo need those signals.',
      approach:
        'Layered NestJS modules with explicit boundaries, Testcontainers against real PostgreSQL, BullMQ for background work, structured JSON logging with correlation IDs, and infrastructure as Terraform on AWS (ECS Fargate, RDS, ElastiCache).',
      architecture: {
        diagramId: 'multi-tenant-api-layers',
        altText:
          'Request flow from API gateway into NestJS application layers (interface, application, domain, infrastructure), with PostgreSQL, Redis/BullMQ, and AWS services.',
      },
      decisions: [
        {
          decision: 'Integration tests against real PostgreSQL via Testcontainers',
          alternatives: 'Mock the repository layer only',
          reasoning:
            'Mocks hide query and transaction bugs; a real engine catches them in CI.',
          tradeoff:
            'Slower CI and more infrastructure in the pipeline in exchange for higher confidence. Coverage target: {{NEEDS_INPUT: integration test coverage percent}}.',
        },
        {
          decision: 'Publish an OpenAPI specification as part of the delivery',
          alternatives: 'Undocumented hand-written clients',
          reasoning:
            'A contract makes the API reviewable without reading every controller.',
          tradeoff: 'Spec maintenance cost; much clearer onboarding for consumers.',
        },
      ],
      challenges: [
        'Designing tenant isolation without leaking identifiers across query paths.',
        'Keeping idempotent write semantics correct under retries.',
        'Balancing Clean Architecture ceremony with a solo-maintained codebase.',
      ],
      outcomes: [
        'Idempotent write endpoints, rate limiting, health/readiness probes, and BullMQ job processing designed into the baseline.',
        'GitHub Actions pipeline intended to enforce tests on every pull request.',
        '{{NEEDS_INPUT: deployment status and any public URL once live}}',
      ],
      retrospective:
        'I would extract the tenancy and idempotency patterns into a thinner shared kit earlier, so the domain modules stay focused on business rules rather than cross-cutting transport concerns.',
    },
  },
  {
    slug: 'cross-platform-mobile',
    title: '{{NEEDS_INPUT: project 2 name}} — Cross-platform mobile app',
    summary:
      'React Native CLI app with offline-first sync, push notifications, and WebSocket updates — consuming the multi-tenant API.',
    description:
      'Companion mobile client for the multi-tenant API: offline-first synchronisation, push notifications, real-time WebSocket channel, and automated signed release builds for iOS and Android.',
    role: 'Sole engineer',
    timeframe: '{{NEEDS_INPUT: project 2 timeframe}}',
    status: 'in-progress' as const,
    technologies: ['React Native', 'TypeScript', 'WebSockets', 'CI/CD'],
    categories: ['Mobile'],
    thumbnail: {
      src: '/images/projects/mobile-app.svg',
      alt: 'Abstract representation of a cross-platform mobile application',
      width: 1200,
      height: 750,
    },
    links: {
      live: '{{NEEDS_INPUT: App Store URL}}',
      repo: '{{NEEDS_INPUT: project 2 GitHub URL}}',
      caseStudy: '/projects/cross-platform-mobile',
    },
    featured: true,
    kind: 'personal' as const,
    confidential: false,
    hasCaseStudy: false as const,
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
