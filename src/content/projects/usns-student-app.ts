import type { Project } from '@/content/schemas';

export const usnsStudentApp = {
  slug: 'usns-student-app',
  title: 'USNS Student App — bilingual Expo client',
  summary:
    'An Expo student app with genuine RTL architecture rather than a translation layer: 18 screens, push delivery, a three-step registration wizard, and account-state handling driven by typed problem slugs instead of status codes.',
  description:
    'The student-facing half of the University Student Notification System. The backend can resolve a perfect audience for a registration-deadline announcement and it changes nothing if delivery is a portal a student has to remember to visit — so this is the part that puts it on the device in their pocket, in the language they read.',
  role: 'Mobile Engineer',
  timeframe: '2026',
  year: 2026,
  status: 'shipped' as const,
  technologies: [
    'React Native',
    'Expo',
    'TypeScript',
    'Expo Router',
    'Zod',
    'Firebase Cloud Messaging',
    'i18n / RTL',
    'EAS Build',
  ],
  categories: ['Mobile'],
  cover: { hue: 190, pattern: 'waves' as const },
  group: { id: 'usns', label: 'USNS Platform' },
  metrics: [
    { label: 'Screens', value: '18' },
    { label: 'Languages', value: 'Arabic + English, RTL' },
    { label: 'Distribution', value: 'Android via EAS' },
  ],
  links: {
    repo: 'https://github.com/jacklusy/usnsnative',
    caseStudy: '/projects/usns-student-app',
  },
  featured: false,
  kind: 'professional' as const,
  confidential: false,
  sortWeight: 65,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Students do not check a web portal. Announcements that matter are time-sensitive — exam schedule changes, registration windows, policy updates — and reaching a student means a push notification on the device in their pocket, not a row in a database waiting to be discovered.',
    problem:
      'Four problems specific to this half of the system. The audience is bilingual and one language reads right to left, which is a layout architecture decision rather than a resource-file problem: an Arabic interface needs mirrored layout, reversed row directions, back buttons on the opposite side, and fonts that render the script properly. Registration must verify a real student without a real student-information-system integration, which did not exist during the project window. Connectivity is unreliable and account state changes underneath the app — a student opens it on campus Wi-Fi, loses signal in a lecture hall, and resumes an hour later, by which time their enrolment status may have changed or their token expired. And the backend was being built in parallel in another repository, so screens could not wait for endpoints.',
    approach:
      'Commit to bilingual support as an architectural property from the first screen: every string through a translation function and layout direction resolved through a hook, so no screen was ever written LTR-only. Mock at the service boundary rather than the network boundary, so screens, navigation, state and localisation were all built and reviewable against realistic data. Branch UI on typed problem slugs returned by the backend rather than on HTTP status codes, so account states like suspended resolve correctly by design. Centralise log sanitisation in one place so no individual call site has to remember not to log a token.',
    architecture: {
      diagramId: 'usns-student-app-layers',
      altText:
        'An Expo Router application with an authentication stack and a four-tab main stack; screens read from a service layer that resolves to either a mock implementation or the live mobile API, Zod validators sit in one directory, errors are narrowed into two types at a single boundary and branched on typed problem slugs, and Firebase Cloud Messaging delivers push while read-time sync reconciles unread state on resume.',
    },
    decisions: [
      {
        decision: 'Bilingual and RTL support built in from the first screen',
        alternatives: 'Shipping English first and retrofitting Arabic later',
        reasoning:
          'Retrofitting RTL into eighteen finished screens means auditing every flex direction, text alignment, margin and icon orientation in the codebase. Building it in cost far less than that would have.',
        tradeoff:
          'Every screen carries the indirection of translation lookups and a direction hook from its first commit, including screens that might never have needed it.',
      },
      {
        decision: 'Problem slugs, not status codes, drive UI branching',
        alternatives: 'Branching on HTTP status and message strings',
        reasoning:
          'The suspended-student case — restore the session, block the content, explain why — is easy to get wrong in a way that produces a support ticket. With typed slugs from the backend, the correct behaviour fell out of the design and worked first try.',
        tradeoff:
          'It couples the client to a backend vocabulary, so a new state on the server needs a corresponding client branch or it falls through to a generic error.',
      },
      {
        decision: 'A mock API as a first-class implementation, not a stub',
        alternatives: 'Blocking on the backend, or intercepting at the network layer',
        reasoning:
          'For the first two weeks the mobile surface barely existed. A real mock at the service boundary meant integration later was flipping a flag and fixing DTO mapping rather than rewriting screens.',
        tradeoff:
          'It is exactly what made the eventual contract gap invisible — with mocks on, the affected screens work perfectly.',
      },
      {
        decision: 'Read-time sync over background polling',
        alternatives: 'A background task polling for new announcements on a schedule',
        reasoning:
          'Push handles urgency; reconciling on resume handles correctness without spending battery on a schedule the platform may not honour anyway.',
        tradeoff:
          'Unread counts can be briefly stale between a push arriving and the app being opened.',
      },
    ],
    challenges: [
      'Verifying real enrolment without an available student-information-system integration, solved with a three-step registration wizard whose verification checkpoint can be swapped for a real call without redesigning the surrounding screens.',
      'Supporting two email-verification drivers — one-time code and link — through the same forgot-password and registration flows.',
      'A dependency that needed a vendored patch, applied through a supported package-manager mechanism with an explanatory comment rather than scattered workarounds or a pinned old version.',
    ],
    outcomes: [
      'Eighteen screens across authentication, a three-step registration wizard, announcement consumption and account management, distributed as an Android build through EAS.',
      'Full Arabic and English support with mirrored layout, delivered as an architectural property rather than a translation pass.',
      'Push delivery via Firebase Cloud Messaging, with home, history and notification surfaces reconciling unread state on resume.',
      'Centralised log sanitisation redacting credential-shaped keys at a single choke point, with deliberate exclusions so adjacent keys are not over-matched.',
    ],
    retrospective:
      'Building bilingual support in from the start and mocking at the service rather than network boundary were the two decisions that made the schedule work. The largest gap is not a matter of taste: there are no tests. The forgot-password screen is 627 lines handling two verification drivers, several error states, resend logic and countdown timers; the second registration step is 508 lines with async metadata loading, dependent dropdowns and a verification call. Neither has a single automated assertion, and the cost was felt during development — refactoring the one-time-code flow meant manually re-walking registration to confirm nothing broke, and the same was true of every subsequent auth change. The validators, the error-narrowing module and the log sanitiser are all pure functions with clear contracts; tests there would have been cheap and high value, and the sanitiser in particular is security-relevant code with zero coverage. The second failure is the contract gap: the app ships calling three endpoints the backend never implemented. A requirements document listed them with priorities, grounded in an actual reading of the backend code, and it was a good artefact that changed nothing — because a document has no failure mode. Nothing turns red when it goes unimplemented. What made this survivable is also what made it invisible: with mocks enabled, all three surfaces work perfectly, and the gap only appears against the live backend. A generated OpenAPI spec with a client generated from it, or contract tests running in CI, would have made each of those a failing build the day the code was written. Two screens are also too large to review comfortably, and the extraction into orchestration hooks is obvious in hindsight and called for by the codebase’s own standard — time pressure won.',
    stackDetail: [
      {
        category: 'Platform',
        items: [
          'React Native via Expo (managed workflow, development builds)',
          'TypeScript',
          'Expo Router',
          'EAS Build (Android APK)',
        ],
      },
      {
        category: 'Localisation',
        items: [
          'Arabic + English message catalogs',
          'Layout-direction hook applied at every screen',
          'Mirrored layout, reversed rows, script-appropriate fonts',
          'Coverage audit script',
        ],
      },
      {
        category: 'Data & errors',
        items: [
          'Zod validators in one directory',
          'Two error types narrowed at a single boundary',
          'Problem-slug driven UI branching',
          'Service-boundary mock API',
        ],
      },
      {
        category: 'Delivery & state',
        items: [
          'Firebase Cloud Messaging push',
          'Read-time sync on resume',
          'Infinite scroll with filter sheets',
          'Attachment download and sharing',
        ],
      },
      {
        category: 'Safety',
        items: [
          'Centralised log sanitisation with key-pattern redaction',
          'Distinct handling for inactive, suspended and locked accounts',
          'Vendored dependency patch with rationale',
        ],
      },
    ],
  },
} satisfies Project;
