import type { Project } from '@/content/schemas';

export const stockwell = {
  slug: 'stockwell',
  title: 'Stockwell — multi-tenant inventory & warehouse API',
  summary:
    'A NestJS inventory API built to prove four correctness properties under concurrency, not assert them: 50 parallel adjusts produce one winner and 49 explicit 409s, verified on every CI run.',
  description:
    'Warehouse software fails quietly — the system returns 200 OK while the data underneath goes wrong. Stockwell is a multi-tenant inventory and warehouse API built around that thesis: concurrency safety, exactly-once retries, atomic transfers, and tenant isolation are treated as provable properties, each backed by an executable test rather than a paragraph of prose.',
  role: 'Backend Engineer',
  timeframe: '2026',
  year: 2026,
  status: 'shipped' as const,
  technologies: [
    'TypeScript',
    'NestJS',
    'PostgreSQL',
    'TypeORM',
    'Redis',
    'BullMQ',
    'Docker',
    'Testcontainers',
    'Terraform',
    'AWS',
    'GitHub Actions',
    'Clean Architecture',
  ],
  categories: ['Backend', 'Architecture', 'DevOps'],
  cover: { hue: 214, pattern: 'planes' as const },
  group: { id: 'stockwell', label: 'Stockwell' },
  metrics: [
    { label: 'Parallel adjusts, one winner', value: '50 → 1 + 49×409' },
    { label: 'Test tiers', value: 'Unit · Integration · E2E' },
    { label: 'Architecture decision records', value: '8' },
  ],
  links: {
    repo: 'https://github.com/jacklusy/stockwell',
    caseStudy: '/projects/stockwell',
  },
  featured: true,
  kind: 'personal' as const,
  confidential: false,
  sortWeight: 100,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'A stock quantity is not a normal field. It is a number many actors mutate at once — a receiving clerk scanning a pallet, a picker issuing units, a cycle-count operator correcting a discrepancy, a background job reserving stock for an order — all against the same product-and-location row, in the same second. The naive read-modify-write implementation loses updates silently: nothing errors, nobody is notified, and the physical warehouse and the database quietly diverge.',
    problem:
      'Four failure modes had to become impossible rather than unlikely. Concurrent adjustments must produce exactly one winner and explicit conflicts for the losers, never a lost update or a negative quantity. Retried mutations — mobile scanners on flaky networks retry when a response times out — must produce exactly one effect. Transfers mutate two rows in one logical operation, so they must be atomic and must not deadlock when opposite-direction transfers race. And in a shared-schema multi-tenant design, a single forgotten tenant predicate is not a bug but a cross-customer data leak, invisible in local development where only one tenant exists.',
    approach:
      'Treat each property as a claim requiring an executable proof. Optimistic locking with a version column by default, pessimistic row locks with explicit lock ordering for the two-row transfer path. Idempotency keys claimed inside the same transaction as the movement, so the key and its effect commit or roll back together. Movements stored append-only with balances as a projection, so history cannot be edited away. Tenant isolation defended in four layers ending in PostgreSQL row-level security, returning 404 rather than 403 — because 403 confirms a resource exists and lets an attacker enumerate a competitor’s product IDs. Ceremony applied asymmetrically: heavy in the inventory domain, deliberately light elsewhere.',
    architecture: {
      diagramId: 'stockwell-concurrency',
      altText:
        'A NestJS API across four bounded contexts over PostgreSQL 16 and Redis: inventory writes take an optimistic version check for single-row adjusts and ordered pessimistic row locks for two-row transfers, claim an idempotency key inside the same transaction, and append immutable movement records from which stock balances are projected — with tenant isolation enforced in the application layer and backstopped by row-level security under a dedicated non-superuser database role.',
    },
    decisions: [
      {
        decision: 'Optimistic locking by default, pessimistic locking for transfers',
        alternatives: 'A single locking strategy applied uniformly across all inventory writes',
        reasoning:
          'Single-row adjusts are better served by a version check that fails loudly; two-row transfers need ordered row locks, because opposite-direction transfers acquiring locks in opposite order is exactly how PostgreSQL deadlocks.',
        tradeoff:
          'Two lock strategies inside one module, and clients must handle 409 with retry. Worth revisiting if conflict rates become operationally painful or a third multi-row operation appears.',
      },
      {
        decision: 'Movements immutable, balances a projection over them',
        alternatives: 'Mutating a balance row in place and keeping a separate audit log',
        reasoning:
          'An in-place balance update destroys the evidence needed to work out when the divergence happened. Append-only movements with a database trigger rejecting UPDATE and DELETE make the audit trail structural rather than best-effort.',
        tradeoff:
          'Storage grows with every mutation, and correcting a mistake means posting a compensating movement rather than editing a row.',
      },
      {
        decision: 'Shared-schema multi-tenancy with row-level security as a backstop',
        alternatives: 'Schema-per-tenant or database-per-tenant isolation',
        reasoning:
          'One deployment stays operationally tractable for a single engineer, and RLS changes the failure mode of a missing predicate from “another tenant’s rows” to “zero rows”.',
        tradeoff:
          'A missing tenant predicate is a data breach rather than a bug, which is why the defence is four layers deep and why the isolation test runs as the restricted application role.',
      },
      {
        decision: 'TypeORM over Prisma or Drizzle',
        alternatives: 'Prisma, for stronger end-to-end type inference',
        reasoning:
          'Explicit SELECT … FOR UPDATE with controlled lock ordering is the load-bearing mechanism of the transfer path, and TypeORM makes it first-class.',
        tradeoff:
          'Weaker generated type inference than Prisma, accepted because the locking primitive mattered more than the type ergonomics.',
      },
      {
        decision: 'Testcontainers with real PostgreSQL and Redis, not mocked repositories',
        alternatives: 'Mocked persistence for fast unit-level coverage of the same paths',
        reasoning:
          'Lock ordering, RLS binding, deferred foreign keys and append-only triggers are properties of PostgreSQL. A mocked repository cannot fail the way real Postgres fails, so those mechanisms would have been verified by tests proving nothing.',
        tradeoff:
          'Slower suites, serialised test runs, and Docker required locally — a cost repaid several times over.',
      },
    ],
    challenges: [
      'Row-level security was security theatre for its first several commits: the policies were written and forced, but nothing bound because the application connected as the table owner, and PostgreSQL exempts owners silently — no error, no warning.',
      'Constructing a deterministic race. The test asserting that parallel adjusts conflict was itself racy, occasionally seeing both requests serialise cleanly and both succeed.',
      'Lifecycle hooks firing in contexts they were never designed for — exporting the OpenAPI schema boots the Nest application to walk its decorators, which started a queue worker and tried to connect to Redis during a documentation build.',
      'Rate limiting fighting the test suite: registering many users tripped the throttler and produced flaky 429s unrelated to anything under test.',
    ],
    outcomes: [
      'Fifty concurrent adjusts to the same balance resolve to exactly one winner and forty-nine explicit 409 conflicts, with the final quantity exact and no intermediate state ever negative — captured as a JSON artefact on every CI run.',
      'A three-tier test strategy: unit tests with zero I/O for domain invariants and RBAC boundaries, Testcontainers integration tests for transactions, locks, idempotency and RLS, and end-to-end tests for HTTP contracts and tenant isolation over the wire.',
      'Cross-tenant access returns 404 rather than 403 across every resource, verified end to end, with row-level security asserted under the restricted application role rather than the owner.',
      'A CI pipeline running lint, typecheck, dependency-boundary checks, three test tiers, migrations, OpenAPI export, image build, Terraform validation and a production dependency audit — and a deploy that captures a rollback target before it changes anything.',
    ],
    retrospective:
      'Choosing one hard problem and proving it was the whole value. A version with twice the CRUD surface and no concurrency artefact would say considerably less. Two failures taught me the most. Row-level security passed every test that checked the policies existed and failed the first test that checked they worked — a security control that cannot fail visibly in a test is not a control, and the test is the feature. Separately, the deploy workflow force-restarted tasks against the existing task definition, so every deploy went green while shipping the previous release; the pipeline being green is a claim, not a fact, and you have to verify the deployed artefact rather than the exit code. What I would do differently: ship the read endpoints in the first inventory commit, because building a carefully designed audit log no HTTP client can read is a real design miss that happened because the write path held the interesting problems. Deploy earlier to something cheap, since Terraform that validates but has never been applied carries far less signal than a running URL — and observation would have caught the deploy bug that code reading did not. Build the idempotency-key expiry reaper as part of the idempotency work rather than listing it as a known negative, because a column with no reaper is a slow leak with documentation attached. And measure the conflict rate under sustained realistic contention, which is the number that would actually tell me whether the default locking strategy is right.',
    stackDetail: [
      {
        category: 'Runtime & framework',
        items: ['TypeScript (strict)', 'Node.js ≥ 20', 'NestJS', 'Clean Architecture, 4 bounded contexts'],
      },
      {
        category: 'Data',
        items: [
          'PostgreSQL 16',
          'TypeORM with 10 hand-written migrations',
          'Row-level security under a dedicated NOSUPERUSER role',
          'Append-only movement triggers + CHECK constraints',
        ],
      },
      {
        category: 'Async & caching',
        items: ['Redis 7', 'BullMQ (low-stock alerts, durable retries)', 'Throttler counters'],
      },
      {
        category: 'Testing',
        items: [
          'Jest (unit, ~60%)',
          'Testcontainers with real Postgres + Redis (~35%)',
          'supertest E2E (~5%)',
          'k6 smoke test with thresholds',
        ],
      },
      {
        category: 'Delivery',
        items: [
          'Multi-stage Docker image',
          'Terraform (ECS/ALB/ECR topology)',
          'GitHub Actions: migrate before traffic shift, rollback ARN captured first',
          'OpenAPI export + Swagger UI',
        ],
      },
    ],
  },
} satisfies Project;
