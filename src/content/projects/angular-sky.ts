import type { Project } from '@/content/schemas';

export const angularSky = {
  slug: 'angular-sky',
  title: 'Angular SKY — employee leave request portal',
  summary:
    'A server-rendered Angular 17 internal portal: employee directory, profile, and leave-request browsing across ~20 standalone components, built against a mock API in three weeks.',
  description:
    'A Sky Academy frontend training project. Three routed pages — home dashboard, profile, and request browsing — assembled from around twenty standalone Angular 17 components, server-rendered through Angular Universal. Built without a real HR backend, using a public mock API as a stand-in data source; the documentation below is explicit about where that stand-in shows.',
  role: 'Frontend Developer',
  timeframe: 'September – October 2024',
  year: 2024,
  status: 'shipped' as const,
  technologies: [
    'Angular 17',
    'TypeScript',
    'Angular Universal',
    'RxJS',
    'Express.js',
    'Bootstrap 5',
    'SSR',
  ],
  categories: ['Frontend'],
  cover: { hue: 348, pattern: 'planes' as const },
  group: { id: 'sky-academy', label: 'Sky Academy' },
  metrics: [
    { label: 'Standalone components', value: '~20' },
    { label: 'Build time', value: '3 weeks' },
    { label: 'Rendering', value: 'SSR + hydration' },
  ],
  links: {
    caseStudy: '/projects/angular-sky',
  },
  featured: false,
  kind: 'training' as const,
  confidential: false,
  sortWeight: 10,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Employees need a self-service portal: view their own profile and leave balances, browse a searchable directory of coworkers, and track vacation and leave requests. It is the classic internal HR self-service problem — several distinct views sharing a lot of visual language, backed by a search, filter, select, and paginate interaction pattern that recurs across more than one screen.',
    problem:
      'No real backend for vacation-request data existed to build against. The exercise had to demonstrate a complete, componentised Angular front end — routing, standalone components, HTTP data-fetching, client-side search and pagination, SSR — while the actual leave-request domain data had no source to come from.',
    approach:
      'Layout first, data second, then polish. Scaffold Angular 17 with Bootstrap and FontAwesome; build three static pages before any service code; restructure into a pages/ (routed) versus components/ (reusable) split once the shape of the app was clear; wire routing and a shared navbar; introduce HTTP services last, backed by a public mock API; then spend the final commits hardening loading states and visual detail rather than adding features.',
    architecture: {
      diagramId: 'angular-sky-layers',
      altText:
        'Three routed pages (Home, Profile, Request) each composed from standalone components, drawing data through shared UserService, PostService, and PhotoService over HttpClient with withFetch(), server-rendered by an Express host running the Angular Universal CommonEngine and hydrated on the client.',
    },
    decisions: [
      {
        decision: 'Angular 17 standalone components throughout, no NgModules',
        alternatives: 'Conventional NgModule-based feature modules',
        reasoning:
          'The idiomatic Angular approach at the time, and it avoids NgModule boilerplate for an app this size.',
        tradeoff:
          'Every component repeats its own imports array — CommonModule, FormsModule, and FontAwesomeModule are visibly duplicated across many files.',
      },
      {
        decision: 'Derive the navbar links from the route table rather than hardcoding them',
        alternatives: 'A hand-maintained array of nav items in the navbar component',
        reasoning:
          'Reading routes directly from app.routes.ts keeps navigation and routing from drifting apart as pages are added.',
        tradeoff:
          'Nav order and labels become coupled to route declaration order, so presentation-only changes have to happen in the router config.',
      },
      {
        decision: 'A public mock REST API as the sole data source',
        alternatives: 'Hand-written local fixtures behind domain-named services',
        reasoning:
          'It supplied realistically shaped, id-addressable, paginated REST data for free, letting the real frontend patterns — fetch, search, paginate, select — be built and demonstrated end to end without a backend existing.',
        tradeoff:
          "The app's data model does not match its domain. Generic user, post, and photo records stand in for employees, request history, and avatars, and the actual domain fields are hardcoded in component state alongside them rather than modelled.",
      },
      {
        decision: 'Client-side search, filter, and pagination instead of server-driven queries',
        alternatives: 'Query-parameter-driven server-side filtering',
        reasoning:
          'The mock API had no support for arbitrary name-substring search, so filtering had to happen after the fetch.',
        tradeoff:
          'Every filter operation re-scans the full in-memory array. Fine at ten records; it would not survive a real employee directory.',
      },
    ],
    challenges: [
      'Composing roughly twenty components into three pages without a flat, unnavigable folder — solved by restructuring into pages/ and components/ early, after three static pages existed but before data-fetching logic made the move expensive.',
      'Making HttpClient behave correctly under server-side rendering, which required the fetch-backed client rather than the XHR default.',
      'Keeping the data-access layer thin: four components needed user and photo data, and each fetching independently would have duplicated the HTTP logic four times.',
    ],
    outcomes: [
      'Three routed, server-rendered pages: a home dashboard with summary tiles and a photo carousel, a profile page with history and pending-request sections, and a searchable, paginated, multi-select request list.',
      'Around twenty standalone components in a clear routed-versus-reusable hierarchy, with shared services reused across four consumers instead of duplicated HTTP logic.',
      'A production SSR build producing both browser and server bundles, served by an Express host with client hydration.',
      'A navbar that stays in sync with the router automatically, because it reads the route table rather than a parallel list.',
    ],
    retrospective:
      'The honest gap is that the domain model was never built. The UI displays vacation balances, request statuses, and an approval workflow, but what is actually fetched is generic mock data, with the domain-specific numbers hardcoded in component classes rather than modelled as a VacationRequest interface and service. A local mock service with domain-shaped data would have made the intent legible in the code, not just in the UI labels. There is also no request submission flow despite the app being framed around requests, no authentication (the profile page always renders the same hardcoded user id), and every one of the roughly twenty-one spec files is untouched CLI scaffolding — the default "should create" smoke test with no assertions about search, selection, or pagination behaviour. The broader lesson: a public mock API is excellent for exercising HTTP and async-rendering patterns, but it quietly lets the shape of the available data become the shape of the app, instead of the domain driving what gets fetched. And a scaffolded passing test is easy to leave alone, because nothing forces you to notice that "tests exist" and "tests test anything" are different claims.',
    stackDetail: [
      {
        category: 'Language & framework',
        items: [
          'TypeScript 5.4',
          'Angular 17.3 (standalone components)',
          'RxJS 7.8',
          'zone.js',
        ],
      },
      {
        category: 'Server-side rendering',
        items: [
          '@angular/platform-server',
          '@angular/ssr (Angular Universal)',
          'Express 4.18 SSR host',
          'provideClientHydration()',
          'HttpClient with withFetch()',
        ],
      },
      {
        category: 'UI & styling',
        items: [
          'Bootstrap 5.3',
          '@ng-bootstrap/ng-bootstrap',
          'Bootstrap Icons',
          'FontAwesome',
        ],
      },
      {
        category: 'Tooling',
        items: ['Angular CLI 17.3', 'Karma + Jasmine (configured, not exercised)'],
      },
    ],
  },
} satisfies Project;
