import type { Project } from '@/content/schemas';

export const ammansTreasure = {
  slug: 'ammans-treasure',
  title: "Amman's Treasure — bilingual café landing page",
  summary:
    'A fully bilingual English/Arabic single-page site for an Amman café, with genuine RTL design rather than a mirrored LTR layout — seven sections, eight runtime dependencies, no file over 210 lines.',
  description:
    'A single-page marketing site for a boutique café and lounge in Amman. Bilingual with full right-to-left support, content-driven, and built as a static React SPA. The case study below is unusually candid: it includes the design review that found three silently broken styles and ranks the fixes by impact over effort.',
  role: 'Frontend Developer',
  timeframe: '2025',
  year: 2025,
  status: 'shipped' as const,
  technologies: [
    'React 19',
    'TypeScript',
    'Vite 6',
    'Tailwind CSS v4',
    'i18next',
    'Motion',
    'RTL / i18n',
  ],
  categories: ['Frontend'],
  cover: { hue: 38, pattern: 'arcs' as const },
  metrics: [
    { label: 'Source size', value: '1,158 lines' },
    { label: 'Runtime deps', value: '8 packages' },
    { label: 'Trackers / cookies', value: 'None' },
  ],
  links: {
    live: 'https://amman-treasure.siqva.com',
    caseStudy: '/projects/ammans-treasure',
  },
  featured: false,
  kind: 'client' as const,
  confidential: false,
  sortWeight: 40,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'A three-month-old café in Amman had Instagram, Facebook, and a 4.9-rated Google Maps listing, but no owned property on the web. Social profiles are good for photos and bad for practical questions: opening hours, exact location, whether there is WiFi, whether you can work there for three hours. None of that is answerable above the fold in a social feed.',
    problem:
      "Three constraints shaped the build. The bilingual audience is not one audience — Amman's café market splits between Arabic-first locals and an English-comfortable segment of students, remote workers and visitors, and they read in opposite directions, so treating Arabic as a translation layer over an LTR design produces a mirrored-but-broken experience. The positioning is the product: the differentiator is not the coffee, it is that the space is engineered for staying, so a generic restaurant template that sells food was the wrong shape. And the menu is maintained by café staff, not developers — any solution requiring a code deploy to reprice a latte would rot within a month.",
    approach:
      'Match the architecture to how the business actually converts. Nobody books a café table through a web form in Amman; the conversion actions are opening WhatsApp, tapping a phone number, or opening Maps for directions, so the site hands off to those channels as fast as possible instead of capturing leads. Split the internationalisation model deliberately: menu items, hero slides and reviews live as paired bilingual records so adding a drink is one object literal in one file, while reused interface chrome routes through i18next where a missing key is loudly visible. Build RTL as a design target rather than a transform — direction-scoped font families, mirrored entry animations, per-heading font overrides for Arabic glyph coverage.',
    architecture: {
      diagramId: 'ammans-treasure-spa',
      altText:
        'A client-rendered Vite and React 19 single-page app: seven section components composed under one route, reading paired bilingual content records from typed data modules while interface chrome resolves through i18next, styled by Tailwind v4 CSS-first tokens with direction-scoped typography, and built to a static dist/ bundle.',
    },
    decisions: [
      {
        decision: 'Paired bilingual content fields, with i18next reserved for interface chrome',
        alternatives: 'Routing every string through full i18next resource bundles',
        reasoning:
          'For menu items and reviews, paired fields mean one edit in one file with both languages adjacent, and a missing translation is visible at authoring time as an empty field rather than a silent fallback to English.',
        tradeoff:
          'Per-locale lazy loading becomes impossible for that content, and it gets no key-extraction tooling or CI checks. Chrome, where the same string is reused in six places, keeps i18next for exactly those reasons.',
      },
      {
        decision: 'Menu presented as photographs of the physical menu, not a structured list',
        alternatives: 'The structured, per-item bilingual menu that was already built',
        reasoning:
          'The worst outcome for a menu is a wrong price, and screenshots are updatable by staff without a deploy. The structured view — fourteen items, bilingual, priced, with category tabs — exists in the code but is switched off.',
        tradeoff:
          'It makes the primary content surface unindexable and inaccessible. Both concerns are legitimate; the mistake was resolving the conflict silently with a hardcoded constant rather than writing the trade down and choosing a path out of it.',
      },
      {
        decision: 'A client-rendered SPA rather than static generation',
        alternatives: 'Astro or Next.js static generation, or plain HTML',
        reasoning:
          'The framework was inherited from the scaffold the project started in, and the page is heavy with scroll- and viewport-driven animation that would become client components under SSR anyway, narrowing the win to first paint on an already-small page.',
        tradeoff:
          'The page ships an empty root element, so all content depends on JavaScript execution — and for a site whose entire purpose is local discovery, that is the largest strategic gap in the project.',
      },
      {
        decision: 'No analytics, tag manager, tracking pixels, or cookie wall',
        alternatives: 'A standard analytics and remarketing stack',
        reasoning:
          'Restraint matched to how this market actually contacts a café: one WhatsApp button and four tappable channels. Because nothing sets a cookie, no consent banner is needed either.',
        tradeoff:
          'No first-party data on how visitors use the page, so future changes have to be argued from reasoning rather than measurement.',
      },
    ],
    challenges: [
      'Building Arabic as a designed experience rather than a derived one — direction-scoped fonts, mirrored animations, and localized content selection at every call site, instead of setting a direction attribute and hoping.',
      'Keeping the whole codebase inside one developer’s head: no router, no state library, no backend, no CMS, with the largest file at 209 lines.',
      'Reconciling a menu that staff must be able to change against a menu that search engines and screen readers must be able to read — a genuine conflict with no free answer.',
    ],
    outcomes: [
      'A seven-section bilingual site — hero carousel, story, amenities, menu, review marquee, masonry gallery, and contact — with a one-tap language toggle and full RTL treatment.',
      'Eight runtime dependencies, 1,158 lines across fifteen files, and no third-party tracking of any kind.',
      'Six real, verifiable five-star Google reviews rendered bilingually and linked to the live listing — no invented testimonials.',
      'Conversion routed to the channels this market actually uses: WhatsApp, phone, email, and Maps directions.',
    ],
    retrospective:
      "The scope discipline and the split i18n model were the right calls, and the Arabic experience is designed rather than derived. The review that produced this document also found real defects. A parallel JavaScript colour map mirrored the CSS-first Tailwind tokens and drifted out of sync, so three components reference utility classes that were never generated — the menu and review sections lose their intended warm-grey ground, and the hero's primary call to action has no hover state at all. That failure is silent at every layer: TypeScript sees strings, Tailwind ignores unknown utilities, the build stays green, and the page just looks slightly wrong. The lesson generalises: one source of truth, or the second one will be wrong. Two more worth naming — a constant named like a feature flag that has never been true is not a flag, it is unfinished work with extra steps, and a comment listing what is missing would have communicated the real state better; and an inherited scaffold needs an explicit cleanup pass, because four unused dependencies and an API key with no reader cost the next developer real time working out whether any of it is load-bearing. The strategic gap is the same problem twice: because the page is client-rendered, there was never a document head to fill in, so the metadata was never written. Prerendering the single route plus adding local-business structured data is a few hours of work and the highest-value item outstanding.",
    stackDetail: [
      {
        category: 'Language & framework',
        items: ['TypeScript 5.8', 'React 19', 'React DOM 19'],
      },
      {
        category: 'Build & tooling',
        items: ['Vite 6', '@vitejs/plugin-react', '@tailwindcss/vite', 'tsc --noEmit'],
      },
      {
        category: 'Styling',
        items: [
          'Tailwind CSS v4 (CSS-first @theme config)',
          'clsx + tailwind-merge',
          'Bodoni Moda, Inter, Readex Pro via Google Fonts',
        ],
      },
      {
        category: 'Internationalisation',
        items: [
          'i18next + react-i18next for interface chrome',
          'Paired bilingual records for content',
          'Direction-scoped typography and mirrored animations',
        ],
      },
      {
        category: 'Motion & icons',
        items: ['Motion (reduced-motion aware)', 'lucide-react'],
      },
    ],
  },
} satisfies Project;
