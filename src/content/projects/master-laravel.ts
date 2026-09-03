import type { Project } from '@/content/schemas';

export const masterLaravel = {
  slug: 'master-laravel',
  title: 'Master Laravel — e-commerce & multi-role admin platform',
  summary:
    'A self-hosted Laravel 10 storefront with a full back office and a super-admin tier above it: catalog, cart, checkout, orders, coupons, moderated reviews, and PDF invoices, built solo over seven months.',
  description:
    'A storefront-plus-back-office application for a single online retailer. Customers browse and buy, staff run the catalog and order fulfilment through an admin panel, and a super-admin role manages the admin accounts themselves. Built without a SaaS storefront or per-transaction platform fees — not just a shopping cart, but a small internal operations tool bundled with the shop.',
  role: 'Full Stack Developer',
  timeframe: 'February – September 2023',
  year: 2023,
  status: 'shipped' as const,
  technologies: [
    'PHP 8.1',
    'Laravel 10',
    'MySQL',
    'Eloquent ORM',
    'Blade',
    'Laravel Breeze',
    'DomPDF',
    'Bootstrap',
    'Vite',
  ],
  categories: ['Backend', 'Full-stack'],
  cover: { hue: 12, pattern: 'grid' as const },
  metrics: [
    { label: 'Admin modules', value: '14+' },
    { label: 'Build time', value: '7 months solo' },
    { label: 'Roles', value: 'Customer · Admin · Vendor' },
  ],
  links: {
    caseStudy: '/projects/master-laravel',
  },
  featured: false,
  kind: 'personal' as const,
  confidential: false,
  sortWeight: 30,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'A small retail business needed a self-hosted online store covering the full order lifecycle without a SaaS storefront or per-transaction platform fees. That meant a public catalog with categories, brands, search, galleries and reviews; a cart, checkout and order flow with region-based shipping costs and coupons; two payment paths, because not every customer in the target market has or trusts card payments; a staff-facing admin panel for catalog, merchandising, fulfilment and review moderation; and an administrative tier above the admins to create and deactivate staff accounts without raw database access.',
    problem:
      'Deliver both halves — a customer-facing storefront and a genuine internal operations tool — as one maintainable application, built and maintained by a single developer against a fixed scope.',
    approach:
      'Start from the Laravel Breeze starter kit rather than a pre-built e-commerce package, so authentication, password flows and profile management were correct from day one and the time budget went to commerce features. Role-gate a single users table with a small custom middleware instead of pulling in a permissions package for three fixed roles. Render storefront and admin as Blade views over vendored Bootstrap themes rather than hand-building a design system. Iterate strictly module by module — catalog primitives, then merchandising, then the transactional path, then supporting features, then the second admin surface — so the app stayed deployable at nearly every point in its history.',
    architecture: {
      diagramId: 'master-laravel-layers',
      altText:
        'A Laravel 10 monolith: Blade storefront and admin views over controllers that write through Eloquent to MySQL, with a single users table role-gated by custom middleware into customer, admin, and vendor surfaces, plus DomPDF invoice generation and a vendored Bootstrap theme layer.',
    },
    decisions: [
      {
        decision: 'A single users table with a role column, gated by hand-rolled middleware',
        alternatives: 'A permissions package with granular abilities, or separate auth guards per actor type',
        reasoning:
          'Three fixed roles made a full ACL system over-engineering for the scope, and the middleware is readable end to end in about ten seconds.',
        tradeoff:
          'No granular permissions — an admin who can edit products but not delete orders is not expressible — and adding a fourth role later means touching every route group by hand.',
      },
      {
        decision: 'Blade plus vendored HTML themes, despite scaffolding the React/Inertia starter kit',
        alternatives: 'Committing to Inertia and React, or hand-building a component system',
        reasoning:
          'The themes arrived with ready-made tables, charts, form widgets and a responsive storefront, which mattered more than design uniqueness for a small-business tool on a one-developer budget.',
        tradeoff:
          'Two parallel front-end stacks now live in the repo. The React and Inertia pages are effectively dead code, inflating the dependency list and confusing anyone new to it.',
      },
      {
        decision: 'Two order-completion paths sharing the same order writes',
        alternatives: 'A single card-only checkout, or a full payment-gateway integration up front',
        reasoning:
          'The target market mixes card-comfortable customers with cash-on-delivery ones, so both had to complete an order.',
        tradeoff:
          'The online path records the order as if payment succeeded — the naming promises a gateway integration the code does not contain, which anyone maintaining it needs to know.',
      },
      {
        decision: 'Moderated reviews behind a status flag rather than immediate publication',
        alternatives: 'Publishing reviews on submission and removing bad ones reactively',
        reasoning:
          'Keeps unmoderated and spam reviews from appearing next to products on a small catalog where each one is highly visible.',
        tradeoff:
          'It adds an admin queue that has to be actively worked, or legitimate reviews never surface at all.',
      },
    ],
    challenges: [
      'Keeping a seven-month solo build deployable throughout, by scoping strictly one vertical module per iteration rather than building horizontal layers.',
      'Serving two quite different UIs — a merchandised storefront and a dense data-table back office — from one Laravel application without either compromising the other.',
      'Modelling shipping cost against a division-and-district address hierarchy with a cascading picker, without pulling in a full geo-data package.',
    ],
    outcomes: [
      'A working storefront: sliders and banners, category and brand browsing, product search, detail pages with an AJAX quick-view, and per-product reviews.',
      'A complete cart, checkout and order pipeline writing order and order-item records transactionally, with coupons and region-based shipping, and two completion paths.',
      'A back office spanning fourteen-plus CRUD modules, an order queue with pending-to-delivered transitions, a contact inbox with customer-visible replies, and a review moderation queue.',
      'Per-order PDF invoices downloadable by both staff and customers, plus a super-admin surface for managing admin accounts.',
    ],
    retrospective:
      'The project met its actual goal — a working self-hosted storefront plus a real internal admin tool, delivered solo in about seven months — and starting from Breeze was the decision that made the timeline possible. Writing this documentation surfaced problems worth stating plainly. The most serious: the super-admin account-creation path inserts new admin records through a query-builder call that bypasses Eloquent mutators and never hashes the password, so admin credentials are stored in plaintext. That is a genuine security defect and the highest-priority fix before this codebase goes anywhere near a public environment. Beyond it: the admin view tree was duplicated wholesale to build the second role surface instead of being refactored into shared components, so every future UI change has to be made twice or the two silently drift; money and quantity columns were typed as strings during early schema iteration and never revisited, removing a layer of protection the database would otherwise give; an add-to-cart path reads a user id that is only assigned inside an authentication check, so it throws instead of redirecting to login; and there is no test coverage on cart, checkout, coupon or order-status logic — exactly the money-moving paths where a regression costs the most. A handful of feature tests around add-to-cart through order-created would have caught that last bug for free. None of it needs a rewrite, but the ordering of what got cut under deadline pressure is instructive: tests and hardening went first, and the defects landed precisely there.',
    stackDetail: [
      {
        category: 'Backend',
        items: [
          'PHP 8.1',
          'Laravel 10',
          'Laravel Breeze (auth scaffolding)',
          'Eloquent ORM',
          'barryvdh/laravel-dompdf (PDF invoices)',
          'intervention/image (galleries & thumbnails)',
        ],
      },
      {
        category: 'Database',
        items: [
          'MySQL',
          'Migrations for users, products, categories, brands, carts, coupons, shipping states, orders, order items, contacts, reviews, sliders, banners',
        ],
      },
      {
        category: 'Frontend',
        items: [
          'Blade templating (storefront, admin, super-admin)',
          'Vendored Bootstrap admin theme (DataTables, ApexCharts, Select2)',
          'Separate storefront theme with its own Sass/JS',
          'Vite asset bundling',
        ],
      },
      {
        category: 'Tooling',
        items: ['Pest & PHPUnit (Breeze defaults only)', 'Laravel Pint', 'Laravel Sail'],
      },
    ],
  },
} satisfies Project;
