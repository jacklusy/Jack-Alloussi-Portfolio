import type { Project } from '@/content/schemas';

export const stockwellMobile = {
  slug: 'stockwell-mobile',
  title: 'Stockwell Mobile — offline-first warehouse client',
  summary:
    'A React Native warehouse app with a hand-built offline sync engine: delta mutations, exactly-once replay, and manual conflict resolution — 105 tests, 90%+ coverage floor on the sync module.',
  description:
    'An Android client for warehouse operators working where connectivity is unreliable by construction — steel racking, cold rooms, loading bays. The offline write path never touches the network. Every queued mutation is a delta rather than an absolute, which is what makes retry-on-new-base a correct operation instead of a heuristic.',
  role: 'Mobile Engineer',
  timeframe: '2026',
  year: 2026,
  status: 'in-progress' as const,
  technologies: [
    'React Native 0.86',
    'TypeScript',
    'SQLite',
    'Drizzle ORM',
    'op-sqlite',
    'Vision Camera',
    'FlashList',
    'Sentry',
    'Jest',
  ],
  categories: ['Mobile', 'Architecture'],
  cover: { hue: 32, pattern: 'arcs' as const },
  group: { id: 'stockwell', label: 'Stockwell' },
  metrics: [
    { label: 'Tests passing', value: '105 / 105' },
    { label: 'Sync module coverage floor', value: '90% / 70%' },
    { label: 'Offline write latency', value: 'No network on write path' },
  ],
  links: {
    caseStudy: '/projects/stockwell-mobile',
  },
  featured: true,
  kind: 'personal' as const,
  confidential: false,
  sortWeight: 90,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Warehouse stock moves in places where connectivity fails by construction, on cheap Android handhelds, operated by people wearing gloves under glare or in dim aisles with one free hand. A conventional client that issues a request per action and shows a spinner fails expensively here: the spinner hangs because Wi-Fi reports connected while having no route out, the operator cannot tell whether the adjustment landed, and to keep working they write the count on paper and re-enter it later.',
    problem:
      'Once paper enters the loop, the system of record diverges from physical reality and every downstream number inherits the error. But offline capability alone is not sufficient — the moment a client queues writes locally, four new problems appear. Replay: the app is killed mid-push and re-sends on restart, recording the adjustment twice. Conflict: two operators count the same bin offline and one silently overwrites the other. Ordering: a pull running before a push completes lets a stale server value overwrite unsent local work. Poison messages: one malformed mutation retries forever, blocking everything queued behind it. Each produces wrong inventory numbers rather than crashes, which makes them far more dangerous — they never page anyone, they quietly corrupt the ledger.',
    approach:
      'Queue deltas, never absolutes — the highest-leverage decision in the codebase, because it makes retrying on a new base correct rather than approximate. Make push-before-pull a non-negotiable invariant: stated in a comment, encoded in the state machine, and asserted through a phase log in tests, so it survives refactors. Hand-build the sync engine rather than adopting an off-the-shelf library, because the server-side contract it negotiates against — idempotency keys, optimistic version conflicts, incremental cursors — was co-designed with it. Resolve stock conflicts manually, showing local and server values side by side, rather than picking a winner automatically.',
    architecture: {
      diagramId: 'stockwell-mobile-sync',
      altText:
        'An offline-first React Native client: UI writes land in a local SQLite mutation queue as deltas via Drizzle, a single-flight sync engine pushes queued deltas with idempotency keys before running an incremental cursor pull, version conflicts route to a manual resolution screen offering retry-on-new-base or discard, and exhausted items become inspectable dead letters in a Sync Centre.',
    },
    decisions: [
      {
        decision: 'Queue deltas rather than absolute quantities',
        alternatives: 'Storing the intended final quantity in each queued mutation',
        reasoning:
          'A delta can be replayed against a changed base and still mean the same thing, which makes retry-on-new-base correct, replay safe, and the conflict rules simple to state.',
        tradeoff:
          'The client can never express “set this to exactly N” without a separate operation, and the server contract has to accept deltas as first-class.',
      },
      {
        decision: 'Manual conflict resolution for stock, not automatic merge',
        alternatives: 'Last-write-wins, or automatic server-preference merging',
        reasoning:
          'A physical count is evidence about the real world. Automatically discarding one operator’s count in favour of another’s silently destroys that evidence.',
        tradeoff:
          'It costs operator time, and it does not scale to bulk — a day of divergence across hundreds of SKUs would need batch resolution tooling that does not exist.',
      },
      {
        decision: 'A hand-built sync engine over an off-the-shelf sync library',
        alternatives: 'WatermelonDB or a comparable batteries-included sync framework',
        reasoning:
          'The idempotency contract, optimistic version conflicts, and incremental cursors on the server were designed because a mobile client would be replaying an offline queue against them. Owning both halves made the exactly-once guarantee verifiable rather than assumed.',
        tradeoff:
          'Considerably more code to write, test and maintain than adopting a library that solves the general case.',
      },
      {
        decision: 'Background sync shipped as explicitly best-effort',
        alternatives: 'Presenting background sync as a reliable guarantee',
        reasoning:
          'Android battery optimisation will not honour a promise of timely background execution, so the app says what it actually does rather than claiming a schedule it cannot keep.',
        tradeoff:
          'It costs a confident feature bullet, in exchange for not lying to the operator about when their queue drains.',
      },
    ],
    challenges: [
      'A latent initialisation-ordering bug survived several milestones: the database handle was published before migrations finished, so the sync provider could touch tables that did not exist yet, and concurrent callers could each open the database.',
      'Tracking a recent React Native release — the camera library would not compile against 0.86 on Android, resolved with a pinned version plus a documented patch, alongside a missing Babel transform.',
      'Designing for gloves and glare rather than dashboards: a sync-state edge rail on every row that always pairs colour with an icon, so colour is never the sole carrier of meaning.',
      'Repeatedly re-making the scope cut toward depth-on-sync instead of breadth, and writing an honest rationale for each deferral so it read as a decision rather than an omission.',
    ],
    outcomes: [
      'A complete operator loop: biometric auth, warehouse selection, searchable inventory list, optimistic stock adjustment, barcode scanning with a manual SKU fallback, and a Sync Centre exposing pending, failed, conflicted and dead-lettered items.',
      '105 tests across 26 suites passing, with a 90% statement floor scoped to the sync module rather than a single global threshold that would be too low to protect it or too high to maintain elsewhere.',
      'All five mandatory offline-sync suites passing, including exactly-once delivery under replay, conflict retry on a new base, and resumption after an interrupted sync with no duplicate movement.',
      'A purpose-built design system with contrast ratios enforced by a unit test rather than by inspection, and components reading semantic tokens with zero theme conditionals.',
    ],
    retrospective:
      'Naming tests after claims turned out to be the practice worth keeping — a test called “idempotent replay: double push, one server movement” is a specification, a regression guard, and evidence at once, and a claim that maps to a test name cannot quietly become false. The initialisation bug taught the sharper lesson: it existed because the integration tests inject an already-migrated database, so tests that mock the hard part do not test the hard part. A test exercising a cold, unmigrated bootstrap would have caught it in the milestone that introduced it. Two scheduling failures I would fix: book physical device access at the start rather than the end, because performance and accessibility targets were written early and correctly and then could not be verified, leaving two unverifiable sections in the documentation. And a last-write-wins strategy sits in the codebase implemented and fully tested but used nowhere — it earns its place as an explicit contrast to the manual strategy, but a reviewer could fairly call it dead code with a rationale attached. On limits: the design assumes a single writer per area, the full pull is unpartitioned, the mutation queue has no cap or archival policy, and conflicts resolve one at a time. The pattern I would carry forward is the general one — when a system can be wrong quietly, spend the extra code to make it either right or loudly visible. Dead-lettered items showing up in the Sync Centre are worse UX than silently dropping them, and far better engineering.',
    stackDetail: [
      {
        category: 'Platform',
        items: [
          'React Native 0.86 (Android; iOS deferred)',
          'TypeScript 5.8',
          'Hermes',
        ],
      },
      {
        category: 'Local persistence',
        items: [
          'SQLite via op-sqlite',
          'Drizzle ORM with migrations',
          'Mutation queue + dead-letter store',
        ],
      },
      {
        category: 'Sync engine',
        items: [
          'Delta mutations with idempotency keys',
          'Single-flight engine, push-before-pull invariant',
          'Incremental cursor pull',
          'Manual conflict strategy (retry on new base / discard / manual quantity)',
          'WebSocket deltas behind a flag',
        ],
      },
      {
        category: 'UI & device',
        items: [
          'FlashList virtualised lists',
          'Vision Camera barcode scanning with manual fallback',
          'Biometric unlock',
          'Light/dark semantic token system',
        ],
      },
      {
        category: 'Quality',
        items: [
          'Jest — 105 tests, 26 suites',
          'Per-directory coverage floors',
          'Automated contrast-ratio test',
          'Sentry with PII scrubbing',
        ],
      },
    ],
  },
} satisfies Project;
