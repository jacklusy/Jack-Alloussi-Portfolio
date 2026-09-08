import type { Project } from '@/content/schemas';

import dashboard from '@/assets/img/projects/usns/dash.png';
import users from '@/assets/img/projects/usns/Users.png';
import faculties from '@/assets/img/projects/usns/Faculties.png';
import departments from '@/assets/img/projects/usns/Departments.png';

export const usnsDashboard = {
  slug: 'usns-dashboard',
  title: 'USNS Administration Dashboard',
  summary:
    'A Next.js 16 administration console for university leadership: 44 authenticated routes across nine feature areas, built entirely mock-first behind a lint-enforced seam and switched to the live API module by module.',
  description:
    'The tool the President, Deans, Heads of Department and DBA actually use to run university communication day to day. It mirrors the backend’s authorization exactly — because a menu item that returns 403 on click is not access control, it is a broken app — and shipped as a complete working product on mock data from its earliest commits.',
  role: 'Frontend Engineer',
  timeframe: '2026',
  year: 2026,
  status: 'shipped' as const,
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
  cover: { hue: 250, pattern: 'grid' as const },
  group: { id: 'usns', label: 'USNS Platform' },
  metrics: [
    { label: 'Authenticated routes', value: '44' },
    { label: 'Feature areas', value: '9' },
    { label: 'Files / commits', value: '789 / 92' },
  ],
  thumbnail: {
    image: dashboard,
    alt: 'The USNS dashboard signed in as the University President: key-metric tiles, an enrolment trend chart, a users-by-role breakdown, and a system-overview panel listing the areas this role can reach.',
  },
  gallery: [
    {
      image: users,
      alt: 'The users table, listing dashboard accounts with name, e-mail, role, status and creation date, with search, column and filter controls.',
      caption:
        'Account administration across all five roles. The table is one of nine feature areas, each built against mock data first and switched to the live API only once the screen already worked.',
    },
    {
      image: faculties,
      alt: 'The faculties table, listing nine university faculties with their codes and their department and student counts.',
      caption:
        'The academic hierarchy the whole product rests on. An announcement resolves its audience by walking faculty to department to programme, so these rows are not reference data — they are the addressing scheme.',
    },
    {
      image: departments,
      alt: 'The departments table, showing each department with its code and parent faculty, filterable by faculty.',
      caption:
        'Departments hang off faculties, and a Head of Department only ever sees their own. The sidebar and the system-overview panel are generated from the same permission set the API enforces — a menu item that returns 403 on click is not access control, it is a broken app.',
    },
  ],
  links: {
    live: 'https://usns.siqva.com',
    repo: 'https://github.com/jacklusy/usns-next',
    liveNote:
      'Live and seeded with demo data. Sign in with any account below — each one forces a password change on first use, so if a login stops working, someone got there first.',
    demoAccounts: [
      { role: 'President', identifier: 'president@zuj.edu.jo', password: 'ZUJ_SecureStaging2026!' },
      {
        role: 'DBA (full permissions)',
        identifier: 'dba@zuj.edu.jo',
        password: 'ZUJ_SecureStaging2026!',
      },
      {
        role: 'Dean, Science & IT',
        identifier: 'dean.fsit@zuj.edu.jo',
        password: 'ZUJ_SecureStaging2026!',
      },
    ],
    caseStudy: '/projects/usns-dashboard',
  },
  featured: false,
  kind: 'professional' as const,
  confidential: false,
  sortWeight: 70,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'The backend enforces who can publish what to whom, and the student app puts announcements on a device students carry. Between them sits a requirement neither solves: university leadership needs a tool they will actually use. A Dean composing a faculty-wide announcement, a DBA locking a compromised account, a President reviewing an audit trail before a board meeting — none of them are debugging an API.',
    problem:
      'Four constraints the other two repositories do not face. The interface is the primary surface for non-developers in a system with real institutional consequences, so it needs correct empty states, correct error states, confirmation before anything destructive, and no screen where a mistake silently succeeds. It has to mirror backend authorization exactly, or a hidden menu item becomes a support ticket. Nine feature areas with very different data shapes and interaction patterns — a permission-matrix editor is nothing like a CSV-exportable audit log — had to ship as one coherent product rather than nine apps stapled together. And it had to be buildable against a backend contract that did not exist yet, while staying demonstrable throughout for UAT and the graduation defence.',
    approach:
      'Develop mock-first with a first-class seam enforced by lint rules rather than convention, so every feature area could be fully built, styled and interaction-complete before integration, and switching to live data became a service-file swap per module. Write the architecture and design-system standards before most of the feature work, so rules like "no direct fetch in components" and "colours from tokens only" held across 789 files. Enforce the password-change gate at both the route layer and the network layer, because route guards protect navigation but not a request already in flight.',
    architecture: {
      diagramId: 'usns-dashboard-layers',
      altText:
        'A Next.js 16 App Router dashboard: route groups behind a three-layer guard chain of authentication, role and permission checks, and forced password change; feature modules call a service layer that resolves to either mock implementations or the live Laravel API behind a lint-enforced seam, with a single interceptor owning retry, token refresh and envelope unwrapping.',
    },
    decisions: [
      {
        decision: 'Mock-first development behind a lint-enforced seam',
        alternatives: 'Waiting on backend endpoints, or mocking at the network layer',
        reasoning:
          'Three repositories were developed concurrently. Mocking at the service boundary let all nine feature areas be built and demonstrated before integration, and the lint rule kept the seam from decaying into a maintenance burden.',
        tradeoff:
          'A parallel implementation of every service to keep honest, and a gap only visible at integration time if the mock and the real contract disagree.',
      },
      {
        decision: 'RBAC duplicated on the frontend rather than fetched at runtime',
        alternatives: 'Fetching the permission matrix from the backend on login',
        reasoning:
          'Navigation and route guards need the permission set before any request completes, and a runtime fetch adds a failure mode to the thing that decides what a user can see.',
        tradeoff:
          'The same rules are encoded by hand in two languages in two repositories, with nothing checking they agree — the one decision here I would change.',
      },
      {
        decision: 'A password-change gate enforced at both route and network layers',
        alternatives: 'A route guard alone',
        reasoning:
          'Route guards protect navigation; they do not stop a request already in flight from a component that has not unmounted. Rejecting at the API-client layer closed that hole and mirrored the backend’s own layered instinct.',
        tradeoff:
          'An exempt-URL list to maintain, and an interceptor that has to know about an authentication concern.',
      },
      {
        decision: 'Selective envelope unwrapping, with auth endpoints named as the exception',
        alternatives: 'A blanket unwrap rule applied to every response',
        reasoning:
          'A blanket rule would have silently broken the forced-password-change flow the first time it ran against the live backend. Naming the exception in a predicate made the reason legible instead of hiding it inline.',
        tradeoff:
          'One more concept in the interceptor, and a rule a contributor has to know exists.',
      },
    ],
    challenges: [
      'Keeping 789 files across nine dissimilar feature areas internally consistent, achieved by writing the architecture and design-system rules early and specifically rather than relying on review.',
      'Making role-based access verifiable rather than asserted — solved with a documented mock-account matrix that turns RBAC checking into a five-minute manual pass rather than a debugging session.',
      'Meeting an enterprise quality bar rather than a prototype one: loading skeletons instead of spinners, error boundaries instead of white screens, offline and session-expiry handling, and a first-run tour.',
    ],
    outcomes: [
      '44 authenticated routes plus a full auth flow, covering every feature area the backend exposes, running mock-first from the earliest commits and switched to the live API for production.',
      'A three-layer route protection chain — authentication, then role and permission, then forced password change — with the last enforced redundantly at the network layer.',
      'Modules spanning user CRUD with optimistic bulk actions and rollback, a permission-matrix editor, academic structure with prerequisite cycle detection, audit and monitoring with CSV export, and async report analytics.',
      'A reusable UI primitive kit with a living showcase, live theme switching, and lazy-loaded charts.',
    ],
    retrospective:
      'Mock-first scaled to the whole application rather than a slice, and writing the architecture rules before the feature work is why a codebase this size stayed consistent without a schema enforcing it. The two-layer password gate caught a real gap a single-layer version would have missed. What I would change starts with RBAC: the frontend permission table and the backend matrix encode the same rules independently, by hand, in two languages. They agreed when I wrote this up, and nothing enforces that they stay agreed — a permission added to one and forgotten in the other produces exactly the failure this architecture exists to avoid. That is the same category of risk as the prose contract document between the backend and the mobile app, and the fix is the same: generate one from the other, or both from a shared schema, and fail the build on divergence. The test suite covers three files — real, well-written tests of genuinely subtle synchronisation logic, but the exception rather than the pattern. The route guards that gate every protected page have zero coverage despite being exactly the code where a silent regression has institutional consequences. A suite asserting "this role sees this route, that role gets redirected" for each of the five roles is a few hours of work protecting the property the whole project exists to get right. Two smaller lessons: delete a document and its incoming links in the same commit, because every reference left behind is a future reader’s dead end; and a no-comments style rule adopted to avoid comment staleness costs something in a different dimension — the rationale behind a deliberate exception discovered the hard way is information naming cannot recover, so the exception clause belongs in the rule from the start.',
    stackDetail: [
      {
        category: 'Framework',
        items: ['TypeScript', 'Next.js 16 (App Router)', 'React', 'Redux Toolkit'],
      },
      {
        category: 'UI',
        items: [
          'Tailwind CSS with token-only colour rule',
          'Reusable primitive kit with a living showcase',
          'Loading skeletons, error boundaries, first-run tour',
          'Live theme switching',
        ],
      },
      {
        category: 'Data & validation',
        items: [
          'Zod schemas colocated with forms',
          'Single API-client interceptor (retry, refresh, envelope)',
          'Lint-enforced mock/real service seam',
        ],
      },
      {
        category: 'Access control',
        items: [
          'Three-layer guard chain',
          'Permission-matrix editor with CSV export',
          'Documented mock-account matrix for verification',
        ],
      },
      {
        category: 'Delivery',
        items: [
          'Docker multi-stage build on Next.js standalone output',
          'Oracle Cloud (Ampere A1), behind Caddy',
          'Firebase Cloud Messaging web push',
        ],
      },
    ],
  },
} satisfies Project;
