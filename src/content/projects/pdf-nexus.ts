import type { Project } from '@/content/schemas';

export const pdfNexus = {
  slug: 'pdf-nexus',
  title: 'PDFNexus — browser-native PDF toolkit',
  summary:
    '27 PDF tools, 25 of which never send your file anywhere: a privacy claim made structurally true by processing in the browser, with redaction that actually destroys content and marketing copy constrained by the type system.',
  description:
    'Every general-purpose PDF tool on the web makes the same unstated bargain — upload your document to a server you do not control. PDFNexus was built to remove that bargain for the operations that never needed a server: merge, split, rotate, watermark, redact, and page surgery are structural manipulations of a file format, and they run locally in a worker.',
  role: 'Full Stack Engineer',
  timeframe: '2025 – 2026',
  year: 2026,
  status: 'shipped' as const,
  technologies: [
    'TypeScript',
    'Next.js 15',
    'React 19',
    'NestJS',
    'PostgreSQL',
    'Prisma',
    'Redis',
    'BullMQ',
    'WebAssembly',
    'Web Workers',
    'IndexedDB',
    'Zod',
    'Turborepo',
  ],
  categories: ['Full-stack', 'Frontend', 'Backend'],
  cover: { hue: 158, pattern: 'glyphs' as const },
  metrics: [
    { label: 'Tools shipped', value: '27' },
    { label: 'Processed locally', value: '25 of 27' },
    { label: 'Tests passing', value: '182' },
  ],
  links: {
    caseStudy: '/projects/pdf-nexus',
  },
  featured: true,
  kind: 'personal' as const,
  confidential: false,
  sortWeight: 95,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Uploading to a third-party server is fine for a restaurant menu. It is not fine for a signed contract, a medical intake form, a deposition exhibit, or an internal financial model — which is exactly the category of document that most needs merging, redacting, and page surgery. "Files deleted after one hour" is a promise about someone else’s infrastructure, and there is no way for a user to check it.',
    problem:
      'Three failures motivated the project. The privacy claim is usually unverifiable and often false, and the server exists because it was easier to build, not because the work demands it. Redaction is routinely a lie — a large share of consumer tools draw a black rectangle over text that survives underneath, selectable and copyable, which has produced real document leaks in litigation and government publication. And capability copy is dishonest by default: tools advertise "Edit PDF" and deliver a text-box overlay, advertise "PDF to Word" and deliver a Word file containing one image per page, and users cannot tell until the output fails somewhere downstream.',
    approach:
      'Make the privacy claim structural rather than promised. Every tool declares its processing mode as a typed value, and the badge, drop hint, privacy note, and consent gate all derive from it — so adding a tool forces its author to state where the bytes go, and the interface tells the truth automatically. Implement redaction by rasterising the page, because a content-stream implementation is either complete or it is a security hole. Keep limitations as constants living inside the modules they describe, so the caveat is visible to whoever reads the implementation. Ship no user accounts for the core loop, and gate identity only behind the features that genuinely need it.',
    architecture: {
      diagramId: 'pdf-nexus-hybrid',
      altText:
        'A Turborepo monorepo: a Next.js 15 web app running PDF operations in module workers over pdf.js, pdf-lib and qpdf WebAssembly with IndexedDB session recovery, alongside a NestJS API handling only the operations that require a server — Office conversion, OCR, direct-to-storage multipart upload, HMAC download links and BullMQ email delivery — with Zod contracts shared between both sides as a workspace package.',
    },
    decisions: [
      {
        decision: 'Processing mode as a typed value that drives the entire interface',
        alternatives: 'Documenting each tool’s privacy behaviour in prose alongside it',
        reasoning:
          'It converted a documentation problem, which decays, into a type problem, which does not. A new tool cannot ship without declaring where its bytes go.',
        tradeoff:
          'Every tool must fit one of a fixed set of modes, so a genuinely novel processing shape means changing the union rather than writing a paragraph.',
      },
      {
        decision: 'Rasterising the page for redaction rather than editing content streams',
        alternatives: 'Surgically removing the text objects from the PDF content stream',
        reasoning:
          'A partial content-stream implementation is a security hole wearing the costume of a feature. Rasterising is the honest implementation of a destructive operation.',
        tradeoff:
          'A redacted document loses selectable text everywhere, grows in size, and regresses on accessibility. The trade was made deliberately and it still stings.',
      },
      {
        decision: 'Direct-to-storage multipart upload instead of proxying through the API',
        alternatives: 'Streaming large uploads through the application server',
        reasoning:
          'Keeps 500MB transfers off the API entirely, and just-in-time presigning survives a slow connection outliving a fifteen-minute URL.',
        tradeoff:
          'The client has to be treated as hostile, and part accounting, resume, presign expiry and orphaned-session cleanup all become the application’s problem.',
      },
      {
        decision: 'Zod contracts in a shared workspace package',
        alternatives: 'Independently maintained types on each side of the boundary',
        reasoning:
          'The multipart upload protocol changed shape several times, and every change surfaced as a compile error on the other side rather than a runtime failure in a half-finished 400MB transfer.',
        tradeoff:
          'A build-ordering constraint across three workspaces, handled with Turborepo task dependencies.',
      },
    ],
    challenges: [
      'Nested workers failing silently: pdf.js running inside a module worker tries to spawn its own worker, fails, and degrades in browser-dependent ways — diagnosing it meant reproducing inconsistent behaviour across engines for what turned out to be a six-line fix.',
      'Getting cancellation right across three races — cancel before post, cancel in flight, cancel after settle — for what looks like a small utility but is used by every tool.',
      'Two CORS and caching incidents whose errors pointed nowhere near their causes: a wildcard origin header is silently incompatible with credentialed requests, and cached responses can cause a stale origin header to be re-applied.',
      'A build-system collision where the framework transform rewrote the PDF worker with unresolvable helper imports, fixed by copying the untransformed file at prebuild.',
    ],
    outcomes: [
      '27 tool routes across organise, convert, edit, and secure categories — 25 of them fully local, with only Office conversion and OCR-assisted extraction declaring a server mode.',
      'A continuous workspace: a virtualised multi-file page organiser, IndexedDB session recovery with a typed quota warning, a batch queue with per-job retry, and cross-tool handoff so one tool’s output becomes the next tool’s input.',
      '182 tests passing across three workspaces, with CI running typecheck, tests, and builds against real Postgres and Redis containers on every pull request.',
      'A delivery path with email verification, resumable 500MB direct-to-storage upload, signed 24-hour download links, and a 7-day file TTL enforced by a cleanup job — plus scoped Drive, Dropbox and OneDrive connectors encrypted at rest.',
    ],
    retrospective:
      'Making processing mode a typed value was the highest-leverage decision in the codebase, and keeping each limitation as a constant next to the code that has the limitation was the second — marketing copy in a separate file drifts, a constant beside the implementation does not. I also kept a status document with genuinely blank cells for checks that were never executed; publishing blanks is uncomfortable, and far better than publishing a document where the blanks have been filled in optimistically and nobody can tell which cells are real. What did not work: the bundle is heavy and there is no clean fix, because the local-first premise requires all those parsing and generation libraries to reach the browser — lazy loading and a CI budget gate keep it bounded, but bounded is not small, and low-end mobile remains a poor experience. Multipart upload was substantially harder than estimated; the happy path took an afternoon and everything else took much longer, which is the real lesson: for direct-to-storage uploads, budget the failure modes as the primary work. And the scope grew past its own premise — a ten-module admin console now serves an operator rather than the user whose privacy the product is about. It is useful and it works, and it is the clearest instance of scope that grew because it was possible rather than because the premise required it. Four things I would do differently: set the bundle budget on day one instead of retrofitting it after a dependency is load-bearing; build the automated cross-browser matrix before writing 27 tools, since local PDF processing is exactly where engine differences bite; decide the admin console’s boundary explicitly rather than letting it accrete; and write the honest capability copy first and build to it, instead of retrofitting a copy-honesty pass across pages already written.',
    stackDetail: [
      {
        category: 'Web app',
        items: [
          'Next.js 15 (App Router, RSC)',
          'React 19',
          'pdfjs-dist (parse, render, text layer)',
          'pdf-lib (structural writes)',
          'qpdf.wasm bindings',
          '@tanstack/react-virtual',
          'Tailwind CSS v4',
        ],
      },
      {
        category: 'Document generation',
        items: ['docx', 'xlsx', 'pptxgenjs', 'jszip', 'node-forge (PKCS#12 / PKCS#7)'],
      },
      {
        category: 'Browser platform',
        items: [
          'Module Web Workers',
          'WebAssembly',
          'IndexedDB session recovery',
          'Canvas 2D',
          'crypto.subtle',
          'AbortController',
        ],
      },
      {
        category: 'API & infrastructure',
        items: [
          'NestJS',
          'PostgreSQL + Prisma',
          'Redis + BullMQ',
          'Gotenberg (Office conversion)',
          'Direct-to-storage multipart upload',
          'HMAC-signed download links',
        ],
      },
      {
        category: 'Monorepo & quality',
        items: [
          'Turborepo (3 workspaces)',
          'Shared Zod contract package',
          'Vitest — 182 tests',
          'Build-time CSP artifact',
          'CI bundle-size budget gate',
        ],
      },
    ],
  },
} satisfies Project;
