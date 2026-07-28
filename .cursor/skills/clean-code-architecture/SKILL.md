# Skill: Clean Code & Architecture (Next.js + TypeScript)

## Purpose

This skill defines how the AI coding tool must write, structure, and organize code for a production-grade Next.js + TypeScript application. It governs code quality, architecture, folder structure, and engineering conventions. It does not cover UI/UX design or animation/performance — those live in separate skills.

---

## 1. Core Engineering Principles

- **Single Responsibility Principle**: every file, function, and component should do exactly one thing well. If a file starts doing two unrelated jobs, split it.
- **DRY, but not premature**: extract shared logic into hooks/utilities only after a pattern repeats 2–3 times. Avoid abstracting too early.
- **Composition over inheritance**: prefer small composable functions/components over deep class hierarchies or prop-drilled mega-components.
- **Explicit over implicit**: avoid "magic" behavior. Prefer clear, traceable code over clever one-liners.
- **Predictability**: given the same input, a function/component should behave the same way. Avoid hidden side effects.
- **Fail fast, fail loud**: validate inputs early; do not silently swallow errors.
- **Readability > cleverness**: code is read far more often than it is written. Optimize for the next developer (human or AI).
- **YAGNI**: do not build abstractions, config layers, or generalization for hypothetical future requirements that aren't real yet.

---

## 2. TypeScript Standards

- **Strict mode always on**: `"strict": true` in `tsconfig.json` is mandatory. Never disable strict checks to "make it compile."
- **No `any`**: use `unknown` + type narrowing instead. `any` is only acceptable in tightly justified, commented edge cases.
- **Prefer `type` for unions/utility shapes, `interface` for object/entity contracts** that may be extended (e.g., component props, domain models).
- **Discriminated unions** for state machines and variant data (e.g., `{ status: 'idle' | 'loading' | 'success' | 'error' }`).
- **No implicit `any` in function signatures** — all parameters and return types must be explicitly typed unless trivially inferable.
- **Avoid type assertions (`as`)** unless narrowing is genuinely impossible; never use `as any` or `!` (non-null assertion) to bypass real type errors.
- **Centralize shared types** in a `types/` or colocated `*.types.ts` file — do not duplicate the same shape across files.
- **Use generics** for reusable utilities, hooks, and API wrappers instead of duplicating logic per type.
- **Enums**: prefer union string literal types over TypeScript `enum` unless the value set is stable and used across many modules.
- **Zod (or equivalent schema validation)** should back every external boundary: API responses, form inputs, environment variables.

---

## 3. Recommended Project Root Structure

```
project-root/
├── src/
│   ├── app/                      # Next.js App Router routes only
│   │   ├── (marketing)/          # Route groups for logical separation
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/                  # Route handlers (API endpoints)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── error.tsx / loading.tsx / not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Primitive, design-system-level components (Button, Input, Card)
│   │   ├── layout/                # Header, Footer, Sidebar, Shell
│   │   ├── shared/                 # Reusable cross-feature components
│   │   └── features/              # Feature-specific components, grouped by domain
│   │       ├── auth/
│   │       ├── dashboard/
│   │       └── billing/
│   │
│   ├── hooks/                     # Reusable custom React hooks
│   ├── lib/                       # Framework-agnostic utilities, helpers, integrations
│   │   ├── api/                   # API client, fetch wrappers, endpoint definitions
│   │   ├── validations/           # Zod schemas
│   │   ├── constants/
│   │   └── utils/
│   │
│   ├── services/                  # Business logic / data-access layer (DB, third-party APIs)
│   ├── store/                     # Global state management (Zustand/Redux/etc.)
│   ├── types/                     # Shared/global TypeScript types & interfaces
│   ├── config/                    # App configuration, env parsing, feature flags
│   ├── styles/                    # Global styles, Tailwind config extensions, tokens
│   └── middleware.ts
│
├── public/                        # Static assets
├── tests/                         # Unit/integration/e2e tests (mirrors src structure)
├── .env.example
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Structure Rules

- **Colocate feature code** under `components/features/<domain>` — each domain owns its components, hooks, and types where feasible.
- **`app/` contains routing only** — no business logic, no heavy components defined inline. Pages should primarily compose components from `components/`.
- **Never import from `app/` into `lib/`, `services/`, or `components/`** — dependency direction flows one way: `app → components → hooks/lib/services → types`.
- **Barrel files (`index.ts`)** are allowed per feature folder to simplify imports, but must not create circular dependencies.
- **Absolute imports** via `tsconfig.json` paths (`@/components`, `@/lib`, `@/hooks`) — no deep relative import chains (`../../../../`).

---

## 4. Component Architecture

- **Server Components by default**; use `"use client"` only when the component needs interactivity, browser APIs, or client-only hooks.
- **Keep client boundaries small**: push `"use client"` as deep into the tree as possible rather than marking entire pages client-side.
- **Component size limit**: if a component file exceeds ~150–200 lines or handles more than one clear concern, split it (extract subcomponents, hooks, or utils).
- **Props contracts**:
  - Always define an explicit `Props` interface/type per component.
  - Avoid boolean prop explosions (`isLoading`, `isError`, `isEmpty` all separately) — prefer a single discriminated `status` prop when representing state.
  - Destructure props at the top of the function signature.
- **Presentational vs. Container separation**: UI components (`components/ui`) must be free of data-fetching or business logic; container/feature components own data orchestration and pass data down.
- **Composition patterns**: prefer children/render-prop composition over deeply nested conditional rendering inside a single component.
- **No inline anonymous functions creating new component definitions** inside render (e.g., don't define a component inside another component's function body).
- **Co-locate a component's styles, tests, and types** with the component when feature-specific; keep only truly shared logic in top-level `lib`/`types`.

---

## 5. State Management

- **Local state first**: use `useState`/`useReducer` for UI-local state. Do not reach for global state unless data is genuinely shared across distant parts of the tree.
- **Server state vs. client state are different problems**:
  - Use a data-fetching/cache library (e.g., React Query/SWR, or Next.js server components + fetch caching) for server state (API data, remote resources).
  - Use a lightweight global store (e.g., Zustand, Jotai, Redux Toolkit) only for genuine client-only shared state (UI preferences, auth session shape, cart, modals).
- **Never duplicate server data into global client state** unless a caching layer explicitly requires it — this causes state desync bugs.
- **Derive, don't duplicate**: compute derived values (totals, filters, formatted data) at render/selector time instead of storing them redundantly in state.
- **Keep reducers/stores domain-sliced**: one slice per domain (e.g., `authSlice`, `cartSlice`), never one monolithic global state object.
- **Context API** is for low-frequency-update, cross-cutting concerns (theme, locale, auth session) — not for high-frequency data (avoid re-render storms).

---

## 6. API & Data Handling

- **Centralize API access** in `lib/api/` — no raw `fetch` calls scattered across components.
- **Typed API layer**: every endpoint function has explicit request/response types, validated with Zod (or equivalent) at the boundary.
- **Route Handlers (`app/api/**`)\*\*:
  - Validate input (body, query params) before processing.
  - Return consistent response shapes: `{ data, error }` or standard HTTP status codes with typed error payloads.
  - Never leak internal error details (stack traces, DB errors) to the client response.
- **Environment variables**:
  - Access only through a typed, validated config module (`config/env.ts`) — never `process.env.X` scattered across the codebase.
  - Server-only secrets must never be referenced in client components.
- **Data fetching placement**:
  - Prefer fetching in Server Components / route handlers over client-side `useEffect` fetching where possible.
  - Use caching/revalidation (`revalidate`, `cache`, tags) intentionally and document why a given strategy was chosen.
- **Pagination, filtering, and sorting** logic belongs in the service/API layer, not embedded inside UI components.

---

## 7. Error Handling

- **Never swallow errors silently** — no empty `catch {}` blocks.
- **Use typed error handling**: define custom error classes/types (e.g., `AppError`, `ValidationError`, `NotFoundError`) rather than throwing raw strings.
- **Boundary-based error handling**:
  - Use Next.js `error.tsx` boundaries per route segment for UI-level recovery.
  - Wrap risky async operations in try/catch with meaningful, user-safe messages.
- **Distinguish expected vs. unexpected errors**: expected errors (validation failure, not-found) should produce clear user-facing feedback; unexpected errors should be logged and shown as a generic fallback.
- **Logging**: centralize logging through a single utility/service rather than raw `console.log` scattered through the app; strip or gate verbose logs in production.
- **Never expose sensitive data** (tokens, internal IDs, stack traces) in error messages returned to the client.

---

## 8. Naming Conventions

| Item                    | Convention                                      | Example                         |
| ----------------------- | ----------------------------------------------- | ------------------------------- |
| Components              | PascalCase                                      | `UserProfileCard.tsx`           |
| Hooks                   | camelCase, `use` prefix                         | `useAuthSession.ts`             |
| Utilities/functions     | camelCase                                       | `formatCurrency.ts`             |
| Types/Interfaces        | PascalCase                                      | `UserProfile`, `ApiResponse<T>` |
| Constants               | UPPER_SNAKE_CASE                                | `MAX_RETRY_COUNT`               |
| Folders                 | kebab-case                                      | `user-settings/`                |
| Files (non-component)   | kebab-case or camelCase, consistent per project | `api-client.ts`                 |
| Boolean variables/props | `is/has/should/can` prefix                      | `isLoading`, `hasError`         |
| Event handlers          | `handle` prefix (internal), `on` prefix (props) | `handleSubmit`, `onSubmit`      |

- Names must describe **intent**, not implementation (`fetchActiveUsers`, not `getData2`).
- Avoid abbreviations unless universally understood (`btn`, `id`, `url` are fine; `usrPrfl` is not).

---

## 9. Code Quality Gates

- **Linting**: ESLint with strict TypeScript + Next.js rules enforced; no disabled rules without inline justification comments.
- **Formatting**: Prettier (or Biome) enforced consistently — no manual formatting debates.
- **No dead code**: remove unused imports, variables, commented-out blocks before considering work complete.
- **No console statements** left in production code paths (allowed only behind an explicit debug flag).
- **Function length**: keep functions short and single-purpose; if a function needs a comment to explain "step 1, step 2, step 3," it likely should be split into named helper functions.
- **Consistent return patterns**: avoid mixing early returns and deeply nested conditionals inconsistently within the same codebase — prefer early returns/guard clauses to reduce nesting.
- **Tests accompany logic**: business logic in `services/`, `lib/`, and hooks should be unit-testable in isolation from UI.
- **Every PR-sized change should be self-contained**: a single change should not mix unrelated refactors, feature additions, and formatting-only edits.

---

## 10. Architectural Decision Defaults

When the AI must choose between competing valid approaches, default to:

1. Server Components > Client Components (unless interactivity is required).
2. Composition > configuration flags on a single mega-component.
3. Explicit types > inferred `any`/broad types.
4. Small, focused files > large multi-purpose files.
5. Colocated feature code > scattered cross-cutting files, unless the code is genuinely shared.
6. Standard library / well-maintained ecosystem packages > custom-built solutions for solved problems (auth, forms, validation, dates).
7. Convention consistency across the codebase > local optimization in a single file.

This skill should be applied to every code-generation, refactor, and review task performed by the AI coding tool for this project.
