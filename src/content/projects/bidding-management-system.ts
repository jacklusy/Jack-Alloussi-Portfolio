import type { Project } from '@/content/schemas';

export const biddingManagementSystem = {
  slug: 'bidding-management-system',
  title: 'Bidding Management System — tender workflow API',
  summary:
    'A .NET 8 tender and bidding API built on Clean Architecture, DDD, and CQRS: ~40 endpoints across two guarded aggregate lifecycles, delivered in a three-day sprint.',
  description:
    'A procurement platform backend where staff publish tenders, vendors submit bids, and evaluators score and award them — with the business rules enforced by the domain model itself rather than by ad-hoc checks in controllers. Built for the Sky Academy backend track as a deliberate exercise in enterprise .NET patterns applied end to end on a non-trivial domain.',
  role: 'Backend Developer',
  timeframe: 'April 2025',
  year: 2025,
  status: 'shipped' as const,
  technologies: [
    'C# 12',
    '.NET 8',
    'ASP.NET Core',
    'Entity Framework Core',
    'SQL Server',
    'MediatR',
    'FluentValidation',
    'AutoMapper',
    'JWT',
    'Clean Architecture',
    'DDD',
    'CQRS',
  ],
  categories: ['Backend', 'Architecture'],
  cover: { hue: 268, pattern: 'planes' as const },
  group: { id: 'sky-academy', label: 'Sky Academy' },
  metrics: [
    { label: 'REST endpoints', value: '~40' },
    { label: 'Architecture layers', value: '4 projects' },
    { label: 'Sprint length', value: '3 days' },
  ],
  links: {
    caseStudy: '/projects/bidding-management-system',
  },
  featured: false,
  kind: 'training' as const,
  confidential: false,
  sortWeight: 20,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'Procurement is fundamentally a workflow with strict state transitions and multiple actors holding different permissions. A tender should not be biddable before it is published or after it closes. A bid should not be scored before submission, or accepted before evaluation. The procurement officer who creates a tender is not the evaluator who scores bids, and neither is the vendor submitting one.',
    problem:
      'Rules like these are easy to scatter across controllers and hard to keep consistent once they are. The same is true of the data: money amounts with currencies, contact emails, eligibility criteria, and payment terms that must sum to one hundred percent. The goal was a backend where illegal states are unrepresentable in the domain model, not merely rejected at the edge.',
    approach:
      'Build outward from the domain in four layers. Model the core concepts as aggregates with their own invariants and state machines, plus value objects that make illegal values impossible to construct. Wrap every use case as a CQRS command or query dispatched through MediatR rather than writing logic in controllers. Push validation and logging into a MediatR pipeline instead of repeating guard clauses. Keep EF Core, SQL Server, JWT, and file storage behind interfaces defined in the inner layers. Features landed as vertical slices through Domain, Application, and API rather than one horizontal layer at a time.',
    architecture: {
      diagramId: 'bidding-clean-architecture',
      altText:
        'Four-project Clean Architecture: an ASP.NET Core API layer translating HTTP into MediatR commands and queries, an Application layer holding handlers plus a FluentValidation pipeline behavior, a dependency-free Domain layer holding the Tender, Bid, and User aggregates with their value objects and state machines, and an Infrastructure layer implementing persistence via EF Core against SQL Server plus JWT token generation and file storage behind interfaces.',
    },
    decisions: [
      {
        decision: 'Rich, behaviour-carrying aggregates over an anemic model with logic in services',
        alternatives: 'Plain data entities with the rules living in application services',
        reasoning:
          'State transitions are guarded in exactly one place — the aggregate — so it is impossible to award a tender that is not under evaluation, no matter which code path calls in.',
        tradeoff:
          'Aggregates need private setters and constructors plus explicit EF Core configuration to map to relational tables without exposing mutable public state, handled through backing-field mapping for the private collections.',
      },
      {
        decision: 'CQRS via MediatR for every use case, including simple reads',
        alternatives: 'Conventional service classes injected into controllers',
        reasoning:
          'A uniform pipeline gives validation and logging to all operations for free, and keeps controllers to translating HTTP into a command or query.',
        tradeoff:
          'Many small classes — nine separate command classes for tenders alone — which is more files to navigate than a service-class approach would need.',
      },
      {
        decision: 'FluentValidation in a MediatR pipeline behavior, not data-annotation attributes',
        alternatives: 'DTO attributes plus ModelState checks in every action',
        reasoning:
          'The real rules are cross-field and conditional — unit price times quantity must equal total price to the cent, and every bid item currency must match the bid — which is awkward with attributes and natural with a fluent rule builder.',
        tradeoff:
          "Validators sit in the Application layer alongside the aggregate's own constructor guards. That is defence in depth, but it is two places to keep in sync.",
      },
      {
        decision: 'Local disk file storage behind an IFileStorageService interface',
        alternatives: 'Wiring cloud blob storage directly into the handlers',
        reasoning:
          'Zero external dependency was needed to demonstrate document upload inside a three-day sprint.',
        tradeoff:
          'Not viable for a multi-instance deployment. The interface exists specifically so it can be swapped without touching Application-layer code.',
      },
    ],
    challenges: [
      'Mapping aggregates with private setters and private collections onto relational tables without leaking mutable public state — solved with Fluent API configurations using EF Core backing-field support.',
      'Enforcing two full lifecycles with real preconditions: Draft to Published to UnderEvaluation to Awarded to Closed for tenders, with Cancel from any non-terminal state, and Draft to Submitted to UnderEvaluation to Accepted or Rejected for bids.',
      'Mapping around ten domain and application exception types onto coherent HTTP status codes with a consistent JSON error shape, centralised in middleware rather than scattered across controllers.',
    ],
    outcomes: [
      'Roughly forty REST endpoints across five controllers covering authentication, tender lifecycle, bid lifecycle, user administration, and document upload.',
      'Both aggregate lifecycles enforced inside the domain model, with transitions validated against real preconditions rather than checked in the controller.',
      'JWT authentication with 24-hour access tokens, persisted 7-day refresh tokens, four enforced roles, and a password-change flow.',
      'Duplicate-prevention rules surfacing as proper 409 responses, and centralised error handling mapping around ten exception types to appropriate status codes.',
    ],
    retrospective:
      'The domain-driven state machines earned their ceremony — they are what actually prevented invalid states, more than the validators did. What a three-day timeline could not also cover shows up exactly where you would expect. There are no automated tests at all, which for a project built to demonstrate CQRS and DDD is the single biggest gap: the aggregate guard clauses are precisely the kind of logic unit tests exist for. Writing this documentation surfaced a real authorization bug — the create-tender endpoint checks for a role string that does not match the enum value used correctly everywhere else in the same file, so the one role whose purpose is creating tenders currently cannot call it. A LoggingBehavior class was written but never registered in the pipeline, so the per-request timing it implements never ran; handlers logging manually is why nobody noticed. CORS and Swagger were left wide open unconditionally, flagged in a code comment as something to restrict later and never revisited. The lesson I took: wiring a cross-cutting concern as a class is not the same as it being active, and a smoke test asserting the pipeline actually contains its behaviors would have caught both that and the role typo.',
    stackDetail: [
      {
        category: 'Language & runtime',
        items: ['C# 12', '.NET 8', 'ASP.NET Core 8 Web API'],
      },
      {
        category: 'Architecture & patterns',
        items: [
          'Clean Architecture (Domain / Application / Infrastructure / API)',
          'Domain-Driven Design — aggregates, value objects, domain events',
          'CQRS via MediatR 12',
          'Repository + Unit of Work',
          'MediatR pipeline behaviors',
        ],
      },
      {
        category: 'Data access',
        items: [
          'Entity Framework Core 8 (Code-First)',
          'SQL Server',
          'Fluent API entity configurations',
          'Two checked-in migrations',
        ],
      },
      {
        category: 'Validation & mapping',
        items: ['FluentValidation 11', 'AutoMapper 12'],
      },
      {
        category: 'Auth & docs',
        items: [
          'JWT bearer (access + refresh tokens)',
          'ASP.NET Core Identity password hashing',
          'Role-based authorization',
          'Swagger / OpenAPI via Swashbuckle',
        ],
      },
    ],
  },
} satisfies Project;
