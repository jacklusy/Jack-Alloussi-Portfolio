import type { Project } from '@/content/schemas';

export const usnsBackend = {
  slug: 'usns-backend',
  title: 'USNS Backend — university notification API',
  summary:
    'A Laravel 12 API on Cloud Run serving two clients through two contracts: 165 routes across 23 modules, with publishing authority enforced by the hierarchy and audit logging that cannot be skipped.',
  description:
    'The backend of the University Student Notification System, built for Al-Zaytoonah University of Jordan. It owns identity, the academic hierarchy, announcement lifecycle, audience resolution, notification fan-out, and audit logging — exposed as two distinct HTTP surfaces consumed by an administration dashboard and a student mobile app.',
  role: 'Backend Engineer',
  timeframe: '2026',
  year: 2026,
  status: 'shipped' as const,
  technologies: [
    'PHP 8',
    'Laravel 12',
    'MySQL',
    'Laravel Sanctum',
    'Redis',
    'Queues',
    'Docker',
    'Google Cloud Run',
    'FCM',
  ],
  categories: ['Backend', 'DevOps'],
  cover: { hue: 232, pattern: 'nodes' as const },
  group: { id: 'usns', label: 'USNS Platform' },
  metrics: [
    { label: 'Registered routes', value: '165' },
    { label: 'Feature modules', value: '23' },
    { label: 'Typed enums', value: '40' },
  ],
  links: {
    caseStudy: '/projects/usns-backend',
  },
  featured: true,
  kind: 'professional' as const,
  confidential: false,
  sortWeight: 80,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Al-Zaytoonah University of Jordan distributed announcements through WhatsApp and Telegram groups, ad-hoc email threads, and printed notices. Across nine faculties, dozens of departments and thousands of students, that produces three structural failures no amount of process discipline fixes.',
    problem:
      'Distribution lists rot faster than they are maintained — a messaging group is a snapshot of enrolment at the moment someone built it, while students graduate, transfer and change academic year every semester, so the list leaks in both directions. Authority boundaries exist on paper but not in the tooling: a President speaks for the university, a Dean for a faculty, a Head of Department for a department, and nothing in a messaging app makes an out-of-scope broadcast impossible rather than merely discouraged. And there is no defensible record of who said what to whom — a message thread is not evidence when a student disputes being informed of a schedule change, or when accreditation review asks for actor, timestamp, scope and recipient count.',
    approach:
      'Treat announcements as first-class domain objects with a lifecycle, targeting metadata, an audit trail and enforced publishing authority — the same engineering rigour the university already applies to enrolment or grading. Model the academic hierarchy explicitly so audience resolution derives from live enrolment rather than a maintained list. Serve two audiences through two deliberately different contracts rather than one compromise envelope. Implement audit logging as middleware so it is not possible to ship an endpoint without it.',
    architecture: {
      diagramId: 'usns-backend-layers',
      altText:
        'A Laravel 12 API on Cloud Run with a controller-to-service-to-repository-to-resource pipeline, exposing a 139-route dashboard surface and a 26-route mobile surface over Sanctum authentication; announcements resolve their audience from the faculty-department-program hierarchy, fan out to recipients through a queued chunked insert, and every request passes through audit-logging middleware into MySQL.',
    },
    decisions: [
      {
        decision: 'Separate users and students tables rather than one polymorphic table',
        alternatives: 'A single accounts table with a type discriminator',
        reasoning:
          'Staff and students have genuinely different lifecycles, different authentication paths and different authorisation models. Merging them means every query carries a discriminator and every column is nullable for half the rows.',
        tradeoff:
          'Two authentication flows and two identity surfaces to maintain, and anything genuinely shared has to be modelled twice or extracted.',
      },
      {
        decision: 'Audit logging as middleware rather than explicit service calls',
        alternatives: 'Calling an audit service from each mutating handler',
        reasoning:
          'It made complete coverage structural. Zero endpoints shipped without audit coverage because it was not possible to ship one that way.',
        tradeoff:
          'The middleware sees the request, not the domain change — it records who called what, but not what the value went from and to.',
      },
      {
        decision: 'Chunked insert-or-ignore fan-out offloaded to a queue',
        alternatives: 'Creating notification rows one per recipient inside the publish request',
        reasoning:
          'Fan-out to a student audience is unbounded in principle, so it cannot run inside a request, and a bulk insert with a uniqueness guard makes replay harmless.',
        tradeoff:
          'Publish becomes eventually consistent — the recipient count is not final at the moment the request returns.',
      },
      {
        decision: 'A pluggable email-verification driver',
        alternatives: 'Wiring SMTP directly into the registration flow',
        reasoning:
          'Built after being burned once rather than speculatively up front: when the host blocked SMTP, the fix was a config change plus one new driver, not a rewrite of registration.',
        tradeoff:
          'An extra abstraction layer in a flow that would otherwise be direct, justified only because the failure had already happened.',
      },
    ],
    challenges: [
      'Modelling nine faculties with uneven department distributions from real institutional data, which surfaced audience-resolution edge cases a synthetic three-faculty fixture would never have produced.',
      'Serving two clients whose needs genuinely differ — a 139-route administrative surface and a 26-route mobile surface — without letting either contract distort the other.',
      'Keeping cross-cutting contracts stable across 85 commits of churn, solved with standards tests that iterate the route table and assert envelope shape and permission-matrix consistency globally.',
    ],
    outcomes: [
      'A production Laravel 12 API on Cloud Run with 165 registered routes across 23 feature modules, serving two clients through two contracts.',
      'Complete announcement lifecycle — draft, publish, archive — with hierarchy-derived audience resolution, attachments, and recipient counts.',
      'Audit logs, login history, system events and CSV export, with coverage guaranteed structurally by middleware rather than by discipline.',
      'Forty typed enums covering roles, permissions, statuses and actions, turning value renames into compile-time cascades instead of string-literal hunts.',
    ],
    retrospective:
      'The layered pipeline held up under 85 commits, and the standards tests that iterate the route table were disproportionately valuable — they caught envelope drift and permission-matrix regressions that per-endpoint tests would have missed, at a fraction of the cost. Three things went wrong worth naming. The schema was designed before the domain was understood, and five migrations paid for it, all corrections to enum values chosen too early; the instructive one needed a three-step column dance to widen a priority set. The lesson is that database-level enum columns are a trap for any value set still being negotiated — a varchar with application-level validation would have made each of those a one-line change. Second, the dashboard fan-out path runs synchronously inside the publish request with an existence query per recipient, sitting directly beside a mobile fan-out that does it correctly with a chunked queued insert; it is fine at tens of staff accounts and it is still the wrong pattern. Third, and most important: the mobile client outran the backend contract. The app ships calling three endpoints this repository never implemented, documented in a hand-written gap list that was a genuinely good artefact and had no failure mode — nothing turns red when a document goes unimplemented. Two repositories moving at different speeds with a prose contract between them will drift; a generated OpenAPI spec with contract tests on both sides would have made that drift a failing build rather than a runtime 404. I would also add a before-and-after payload diff to the audit module, because for a system whose stated purpose includes tamper-evident accountability, recording the request but not the change is a meaningful gap.',
    stackDetail: [
      {
        category: 'Runtime & framework',
        items: ['PHP 8', 'Laravel 12', 'Controller → service → repository → resource pipeline'],
      },
      {
        category: 'Data',
        items: [
          'MySQL',
          'Faculty → department → program → course hierarchy',
          'Academic calendar with semester lifecycle',
          '40 typed enums',
        ],
      },
      {
        category: 'Auth & authorisation',
        items: [
          'Laravel Sanctum (two audiences)',
          'Configuration-as-data permission matrix',
          'Lockout, forced password change, password reset',
        ],
      },
      {
        category: 'Async & delivery',
        items: [
          'Queued chunked fan-out with insert-or-ignore',
          'Firebase Cloud Messaging',
          'Pluggable email-verification driver (OTP / link)',
          'Async report generation',
        ],
      },
      {
        category: 'Delivery & ops',
        items: [
          'Docker',
          'Google Cloud Run',
          'Liveness + readiness probes',
          'Standards tests iterating the route table',
        ],
      },
    ],
  },
} satisfies Project;
