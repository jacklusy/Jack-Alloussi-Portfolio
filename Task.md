# AI Skill Specification Document

## Portfolio Website — Next.js + TypeScript

**Client: Jack Alloussi · Software Engineer · Amman, Jordan**
**Document version 1.0 — for direct input to Cursor AI**

---

# PART 0 — BRIEF & PRIME DIRECTIVES

## 0.1 Read this section before writing a single line

This document defines _what_ to build and _to what standard_. It does not contain implementation code, and you should not treat any snippet-shaped text in it as code to copy. Read Parts 0–3 fully before beginning Part 4.

## 0.2 The subject

A portfolio site for a software engineer with roughly two years of full-time production experience, graduating with a BSc in Software Engineering in October 2026, currently building web, API, and mobile applications for United States clients from Amman, Jordan.

**Primary stack to foreground:** TypeScript · Node.js · NestJS · Express · React · Next.js · React Native (CLI) · PostgreSQL · Redis · Docker · CI/CD
**Secondary:** PHP/Laravel 9–12 · ASP.NET Core · Clean Architecture · Domain-Driven Design · SOLID · AWS · GCP

## 0.3 The single job of this page

> **Convince a hiring manager in Berlin, Amsterdam, or Dubai — in under 90 seconds — that this candidate is worth an interview and worth the visa paperwork.**

Every decision traces back to that sentence. If a feature does not serve it, cut the feature.

## 0.4 Audience, in priority order

1. **German and EU engineering managers and technical recruiters.** They value rigour, architecture, testing, and honest reasoning about tradeoffs over visual flash. They will read prose. They will open the repository.
2. **Gulf recruiters (UAE, Saudi Arabia).** They scan faster, value breadth and shipped products, and look for immediate availability and visa status.
3. **Automated systems.** Recruiter search, LinkedIn crawlers, Google. Semantic HTML and structured data are not optional.

## 0.5 Five non-negotiable constraints

**1. This site is itself a work sample.**
The repository will be read by the same people who read the site. Commit history, README, folder structure, type safety, and test presence are all part of the deliverable. Build it as though a senior engineer will review the code — because one will.

**2. Employer work is confidential and cannot be shown as code.**
Most of the subject's professional work sits in private client repositories and cannot be published. The site must therefore carry that evidence _in prose_ — architecture, decisions, scale, and outcomes described in generic terms with no client-identifying information. **This is the site's hardest job and its most important one.** Case studies are not a nice-to-have here; they are the primary mechanism.

**3. Every factual claim must be verifiable.**
No invented metrics. No "40% performance improvement" unless a real figure exists. Where a number is unavailable, use scope (systems owned, applications shipped, platforms supported). Any placeholder must be visually obvious and tracked — see 0.7.

**4. Work authorisation must be unmissable.**
Recruiters filter hard on this and will not guess. Relocation availability, EU Blue Card eligibility, and graduation date must appear above the fold and again in the contact section.

**5. Accessibility and performance are acceptance criteria, not polish.**
A portfolio that fails Lighthouse is an argument against its author.

## 0.6 Explicit anti-goals

- Do not build a CMS, admin panel, or database. Content is typed data in the repository.
- Do not add a blog unless explicitly requested later. An empty blog is worse than no blog.
- Do not add authentication, comments, analytics dashboards, or AI chatbots.
- Do not add a visitor counter, "years of experience" auto-calculator, or animated skill percentage bars. Skill percentage bars in particular are meaningless and read as junior — "React 87%" communicates nothing.
- Do not use lorem ipsum anywhere, including in early scaffolding.

## 0.7 Placeholder protocol

Where real content is unavailable, use the exact token format `{{NEEDS_INPUT: description}}`. Render these in development with a visible warning style. Maintain a running list at `/docs/CONTENT-GAPS.md` and surface it in the final report. Never invent content to fill a gap.

---

# PART 1 — CLEAN CODE & ARCHITECTURE

## 1.1 Baseline stack decisions

| Concern         | Decision                                           | Rationale                                                                      |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Framework       | Next.js, latest stable, **App Router**             | Server Components reduce client bundle; the routing model is current           |
| Language        | TypeScript, `strict: true`                         | Non-negotiable                                                                 |
| Styling         | Tailwind CSS + CSS custom properties for tokens    | Tokens in CSS vars make theming trivial and keep design decisions in one place |
| Content         | Typed TS modules and MDX                           | No CMS. Content is code, versioned and type-checked                            |
| Animation       | One library only (Motion/Framer Motion **or** CSS) | Two animation systems is a smell                                               |
| Forms           | React Hook Form + Zod                              | Shared schema between client and server validation                             |
| Testing         | Vitest + React Testing Library; Playwright for E2E | Presence of tests is part of the demonstration                                 |
| Package manager | pnpm                                               | Faster, stricter dependency resolution                                         |
| Node            | Latest LTS                                         | Pin in `.nvmrc` and `package.json` engines                                     |

## 1.2 TypeScript standards

**`tsconfig.json` must enable:** `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `forceConsistentCasingInFileNames`. Path alias `@/*` mapped to `src/*`.

**Rules:**

- **`any` is forbidden.** Use `unknown` and narrow. If a third-party type is genuinely unavailable, declare a local module type in `src/types/` with a comment explaining why.
- **No non-null assertions (`!`)** except where immediately preceded by a guard that makes it provably safe, with a comment.
- **Prefer `type` for unions and props, `interface` for object contracts that may be extended.** Be consistent; do not mix arbitrarily.
- **Derive, don't duplicate.** Use `satisfies`, `as const`, and indexed access types so content data drives the types rather than types being maintained in parallel.
- **Discriminated unions over optional-field soup.** A `Project` that may or may not be a case study is two variants with a `kind` discriminant, not one type with eight optional fields.
- **Zod schemas are the source of truth for external input** (form payloads, env vars). Infer TS types from schemas, never hand-write both.
- **Validate environment variables at build time** in a single `src/lib/env.ts` that parses `process.env` through Zod and exports a typed object. The build should fail on a missing variable, not the runtime.

## 1.3 Architecture approach

The organising principle is **separation by responsibility, then by feature** — not by file type alone.

**Four layers, and dependencies only ever point downward:**

```
  Presentation   → app/ routes, page compositions, section components
  Domain/Feature → feature modules (projects, experience, contact)
  Shared         → design-system primitives, hooks, utilities
  Data           → typed content, schemas, external service adapters
```

**Enforced rules:**

- A UI primitive in `components/ui/` **may not** import from a feature module. Primitives know nothing about projects or experience.
- A feature module **may** import primitives and shared utilities.
- Route files in `app/` should be thin — compose sections, set metadata, fetch data. Business logic does not live in a page file.
- Content data **never** imports from components.
- **No circular imports.** Enforce with `eslint-plugin-import` (`import/no-cycle`).

**Server vs Client boundary:**

- Default to Server Components. Add `'use client'` only when a component genuinely needs state, effects, event handlers, or browser APIs.
- Push the `'use client'` boundary as far down the tree as possible. A page should not be a client component because one button inside it is interactive.
- Never import server-only modules into client components. Use `server-only` and `client-only` packages to make violations fail at build time.

## 1.4 Root project structure

```
portfolio/
├── .github/
│   └── workflows/ci.yml
├── docs/
│   ├── ARCHITECTURE.md          ← decisions and layer rules
│   ├── CONTENT-GAPS.md          ← running placeholder list
│   └── adr/                     ← architecture decision records
├── public/
│   ├── fonts/
│   ├── images/
│   ├── documents/               ← CV PDFs
│   ├── favicon/
│   └── og/                      ← Open Graph images
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── experience/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── api/contact/route.ts
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx
│   │
│   ├── components/
│   │   ├── ui/                  ← primitives: Button, Card, Badge, Input…
│   │   ├── layout/              ← Header, Footer, Nav, Container, Section
│   │   ├── motion/              ← Reveal, Stagger, PageTransition
│   │   └── sections/            ← Hero, About, SkillsGrid, Timeline…
│   │
│   ├── features/
│   │   ├── projects/            ← components/, lib/, types.ts
│   │   ├── experience/
│   │   └── contact/
│   │
│   ├── content/
│   │   ├── profile.ts           ← name, headline, availability, links
│   │   ├── projects/            ← one file or MDX per project
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── education.ts
│   │   ├── certifications.ts
│   │   └── schemas.ts           ← Zod schemas validating all of the above
│   │
│   ├── hooks/
│   ├── lib/                     ← env.ts, seo.ts, analytics.ts, utils.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css           ← ALL design tokens, single source
│   ├── types/
│   └── config/
│       ├── site.ts              ← URL, title, description, locale
│       └── navigation.ts
│
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── .nvmrc
├── eslint.config.mjs
├── prettier.config.mjs
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

## 1.5 What belongs where

| Directory              | Contains                                                          | Must not contain                                                |
| ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `components/ui/`       | Unstyled-by-domain primitives. Accept props, render, nothing else | Data fetching, feature knowledge, content strings               |
| `components/layout/`   | Structural shells — Container, Section, Header, Footer            | Page-specific content                                           |
| `components/motion/`   | Reusable animation wrappers                                       | Anything that isn't animation                                   |
| `components/sections/` | Composed page sections built from primitives                      | Direct DOM manipulation, inline styles                          |
| `features/*/`          | Feature-scoped components, logic, and types                       | Anything used by more than one feature — that belongs in shared |
| `content/`             | Typed, Zod-validated data                                         | JSX, components, imports from `src/components`                  |
| `hooks/`               | Reusable stateful logic, one hook per file                        | Component markup                                                |
| `lib/`                 | Pure functions and adapters, unit-tested                          | React                                                           |
| `styles/tokens.css`    | Every design token as a CSS custom property                       | Component styles                                                |
| `config/`              | Static configuration                                              | Runtime logic                                                   |

## 1.6 Component design standards

- **One component per file.** File name matches the export.
- **Under 150 lines.** If it exceeds that, it is doing more than one job — split it.
- **Props interfaces named `<Component>Props`** and exported alongside the component.
- **No prop drilling beyond two levels.** Use composition (`children`, slot props) or colocated context.
- **Composition over configuration.** `<Card><Card.Header/><Card.Body/></Card>` beats a `Card` with fifteen boolean props.
- **Extend native element props** where sensible: `interface ButtonProps extends React.ComponentPropsWithoutRef<'button'>`. Forward refs on primitives.
- **Variants belong in one place.** Use `cva` (class-variance-authority) or an equivalent map. Never scatter conditional class strings through JSX.
- **No inline styles** except for genuinely dynamic values that cannot be tokenised (a computed transform, for example).
- **No magic values.** Every colour, spacing, radius, duration, and z-index references a token.
- **Every component handles four states** where applicable: default, loading, empty, error. An empty state is a design opportunity, not an oversight.

## 1.7 Naming conventions

| Thing              | Convention                     | Example                     |
| ------------------ | ------------------------------ | --------------------------- |
| Component files    | `PascalCase.tsx`               | `ProjectCard.tsx`           |
| Hook files         | `useCamelCase.ts`              | `useReducedMotion.ts`       |
| Utility files      | `kebab-case.ts`                | `format-date.ts`            |
| Route directories  | `kebab-case`                   | `case-studies/`             |
| Types & interfaces | `PascalCase`, no `I` prefix    | `Project`, `ProjectProps`   |
| Constants          | `SCREAMING_SNAKE_CASE`         | `MAX_FEATURED_PROJECTS`     |
| Booleans           | `is` / `has` / `should` prefix | `isLoading`, `hasCaseStudy` |
| Handlers           | `handle` inside, `on` in props | `handleSubmit` / `onSubmit` |
| CSS tokens         | `--category-name-variant`      | `--color-surface-raised`    |
| Test files         | `*.test.ts(x)` beside source   | `Button.test.tsx`           |

**Name by domain, not by shape.** `ProjectCard`, not `BlueBoxWithImage`. Names should survive a redesign.

## 1.8 Code readability

- **Guard clauses and early returns.** Maximum nesting depth of three.
- **Named intermediate values over clever one-liners.** `const isPubliclyVisible = ...` reads better than the same expression inlined into a ternary.
- **Comments explain _why_, never _what_.** If a line needs a comment to say what it does, rename something instead.
- **JSDoc on exported utilities and hooks** — purpose, parameters, return, and one usage example.
- **Import order enforced by lint:** node builtins → external → `@/` internal → relative → styles → types.
- **Prettier with no per-file overrides.** Formatting is not a decision anyone should make twice.
- **Functions do one thing.** If you need "and" to describe it, split it.

## 1.9 Reusability rules

Apply the rule of three: **write it inline once, extract on the second use, generalise on the third.** Premature abstraction costs more than duplication.

- Extract to `components/ui/` only when used by two or more features.
- Extract logic to `hooks/` when the _stateful behaviour_ repeats, not merely the markup.
- Prefer generic components with typed generics over near-duplicate variants.
- A shared component with more than six props is probably two components.

## 1.10 Performance-friendly patterns

- **Server Components by default.** The most effective bundle optimisation is not shipping the code.
- **Dynamic imports** for anything below the fold and heavy: `next/dynamic` with `ssr: false` where appropriate.
- **`next/image` everywhere.** Explicit `width`/`height` or `fill` with a sized parent — no unsized images, ever, because they cause layout shift.
- **`next/font`** with `display: 'swap'` and subsetting. Self-host; never link to Google Fonts at runtime.
- **Memoise deliberately, not reflexively.** `useMemo`/`useCallback` only where a measured cost exists. Reflexive memoisation adds noise and its own overhead.
- **Stable keys.** Never array index for reorderable lists.
- **Virtualise** any list beyond ~50 items.
- **Debounce** input-driven filtering at 200–300 ms.
- **Static generation** for all content routes; `generateStaticParams` for project detail pages.
- **`next/link` prefetching** left at default for primary navigation.

## 1.11 Scalability

Build so that these are additive, not refactors:

| Future need             | Structural provision now                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| Blog / writing          | `app/(site)/writing/` slot; MDX pipeline already configured                                 |
| German-language version | No hard-coded strings in components — all copy in `content/`. Keep `lang` attribute dynamic |
| More projects           | Adding a file to `content/projects/` must be sufficient. Zero component changes             |
| Case study depth        | `Project` type is a discriminated union with a `caseStudy` variant from the start           |
| CMS migration           | Content access goes through `features/*/lib/` functions, never direct imports in components |
| Analytics               | A single `lib/analytics.ts` with a no-op default                                            |

**The test:** adding a new project must require editing exactly one file and touching no components. If it doesn't, the data layer is wrong.

---

# PART 2 — UI/UX & DESIGN SYSTEM

## 2.1 The design brief, and how to approach it

You are acting as the design lead at a small studio known for giving every client an identity that could not be mistaken for anyone else's. The client has explicitly rejected templated work. Make deliberate, opinionated choices about palette, typography, and layout that are specific to _this_ brief, and take one real aesthetic risk you can justify.

**Ground the design in the subject.** This is not a generic "creative portfolio." It is the professional presence of a backend-leaning full-stack engineer with formal architecture training, applying across borders. The subject's world — systems, layers, contracts, deployment pipelines, structured thinking — is where distinctive choices come from. Not stock developer imagery, not floating code snippets, not particle backgrounds.

## 2.2 ⚠️ Calibration: three looks you must not default to

AI-generated design currently clusters around three recognisable directions. All three are legitimate for _some_ briefs, but they appear regardless of subject, which makes them defaults rather than choices. **Producing any of them here will read as machine-generated to exactly the audience this site is for.**

1. **Warm cream background (near `#F4F1EA`) with a high-contrast serif display and a terracotta or warm-clay accent (near `#D97757`).** This particular accent is strongly associated with AI tooling and reads as a tell.
2. **Near-black background with a single bright acid-green or vermilion accent.**
3. **Broadsheet layout — hairline rules, zero border-radius, dense newspaper columns.**

Where this brief pins down a direction, follow the brief. Where it leaves an axis free, do not spend that freedom on one of the above.

## 2.3 Required process: plan, critique, then build

**Do not start writing components until you have completed both passes below.**

**Pass 1 — Write a design plan** at `/docs/DESIGN.md` containing:

- **Colour:** 4–6 named hex values with stated roles. Describe the palette in a sentence.
- **Type:** typefaces for at least two roles — a characterful display face used with restraint, and a complementary body face. A third utility/mono face for data and captions if the direction calls for it. Name them and justify the pairing.
- **Layout:** a one-paragraph concept plus ASCII wireframes for the home page and a project detail page.
- **Signature:** the _one_ element this site will be remembered by. Name it explicitly.

**Pass 2 — Critique the plan against the brief.** Ask honestly: if you were given a generic prompt for "a developer portfolio," would you arrive somewhere similar? Any part where the answer is yes must be revised. Record what you changed and why at the end of `DESIGN.md`.

Only then begin implementation, deriving every colour and type decision from the revised plan.

## 2.4 Design principles

**The hero is a thesis.** Open with the most characteristic thing in this subject's world — a headline, a diagram, a live element, an interactive moment. A large number with a small label plus supporting stats plus a gradient accent is the template answer; use it only if it is genuinely the best option here.

**Typography carries the personality.** Set a clear scale with intentional weights, widths, and spacing. Make the type treatment a memorable part of the design, not a neutral delivery vehicle.

**Structure is information.** Numbering, eyebrows, dividers, and labels should encode something true. Numbered markers (01 / 02 / 03) are only appropriate where the content genuinely is a sequence — a real process, or a timeline where order carries meaning the reader needs. The experience timeline qualifies. A skills grid does not.

**Match complexity to the vision.** A maximalist direction needs elaborate execution; a minimal direction needs precision in spacing, type, and detail. Elegance is executing the chosen vision well.

**Spend your boldness in one place.** Let the signature element be the memorable thing and keep everything around it quiet and disciplined. Cut any decoration that does not serve the brief. Before shipping, look at each page and remove one thing.

## 2.5 Layout and spacing

- **Spacing scale: 4 px base, 8 px rhythm.** Permitted values: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Nothing else. Tokenise as `--space-1` … `--space-12`.
- **Content container:** max-width 1200–1280 px. Prose columns capped at **65–75 characters** (`max-w-[68ch]`) — this is a readability rule, not a preference.
- **Section vertical rhythm:** 96–160 px desktop, 64–96 px mobile. Consistent across all sections; a single `<Section>` layout primitive owns this so it can never drift.
- **Grid:** 12 columns desktop, 8 tablet, 4 mobile. Gutters from the spacing scale.
- **Optical alignment over mathematical** where they disagree — trust the eye for icon and text baselines.
- **Whitespace is structural.** Density communicates carelessness in a portfolio whose subject is engineering discipline.

## 2.6 Typography system

**Selection criteria** (choose specific faces in `DESIGN.md`; these are the constraints):

- Display face: characterful, distinctive, used sparingly — headings only.
- Body face: excellent at 16–18 px, generous x-height, real italics, minimum 4 weights.
- Mono face: for code, technical labels, and data. Given the subject, a mono is genuinely justified here rather than decorative — use it for metadata, tech tags, and figures.
- **Avoid the obvious defaults** — Inter alone, or Inter + a generic geometric sans, is what every AI portfolio ships. Choose a pairing you can defend.
- Self-host via `next/font/local` or `next/font/google` with subsetting. Maximum **three families, six weights total**.
- Latin subset only unless Arabic support is added later.

**Type scale** — modular, ratio ~1.25 desktop / ~1.2 mobile:

| Token            | Desktop  | Mobile   | Use                      |
| ---------------- | -------- | -------- | ------------------------ |
| `--text-display` | 56–72 px | 36–40 px | Hero headline only       |
| `--text-h1`      | 40–48 px | 30–32 px | Page titles              |
| `--text-h2`      | 30–36 px | 24–26 px | Section headings         |
| `--text-h3`      | 22–24 px | 20 px    | Subsections, card titles |
| `--text-body-lg` | 18–20 px | 17 px    | Lead paragraphs          |
| `--text-body`    | 16–17 px | 16 px    | Default                  |
| `--text-sm`      | 14 px    | 14 px    | Captions, metadata       |
| `--text-xs`      | 12–13 px | 12 px    | Labels, tags — sparingly |

**Rules:**

- **Body text never below 16 px.** Not for captions inside cards, not for footer text.
- Line height: 1.5–1.7 body, 1.1–1.25 display, 1.3–1.4 mid headings.
- Letter-spacing: slightly negative on large display (−0.01 to −0.03 em), neutral on body, positive on all-caps labels (+0.05 to +0.1 em).
- Maximum **two** weights per visual grouping.
- **Never centre more than three lines** of running text.
- One `<h1>` per page. Heading levels never skip.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

## 2.7 Colour system

**Define tokens semantically, not literally.** `--color-surface-raised`, not `--color-gray-100`. Semantic naming is what makes a dark mode possible without touching a single component.

**Required token groups:**

```
Brand      --color-brand, --color-brand-hover, --color-brand-subtle
Surface    --color-bg, --color-surface, --color-surface-raised, --color-surface-sunken
Text       --color-text, --color-text-muted, --color-text-subtle, --color-text-inverse
Border     --color-border, --color-border-strong, --color-focus
Feedback   --color-success, --color-warning, --color-danger, --color-info
```

**Palette constraints:**

- **One accent colour.** Two at absolute most. A portfolio with five accents has no accent.
- 60 / 30 / 10 distribution — dominant surface, secondary tone, accent.
- Avoid pure `#000000` and pure `#FFFFFF` for large areas; slightly tinted neutrals read as considered.
- Do not use the specific hexes named in 2.2.

**Contrast — WCAG 2.2 AA is the floor:**

| Element                         | Minimum ratio                    |
| ------------------------------- | -------------------------------- |
| Body text                       | **4.5:1**                        |
| Large text (18px+ bold / 24px+) | **3:1**                          |
| UI components, borders, icons   | **3:1**                          |
| Focus indicators                | **3:1** against adjacent colours |

Verify programmatically, not by eye. Muted text is where this fails most often — check `--color-text-muted` on every surface it appears on.

**Dark and light mode:**

- Both required. Default to system preference, allow manual override, persist in `localStorage`.
- Implemented purely by swapping token values under `[data-theme]` — **zero component changes**. If any component needs a dark-mode conditional, the token system is wrong.
- Dark mode is not inverted light mode: reduce saturation, lift dark surfaces to `#12–1A` rather than pure black, soften shadows into subtle borders.
- No theme flash on load. Inline the theme-resolution script in `<head>`.
- Set `color-scheme` so native controls and scrollbars match.

## 2.8 Component design standards

**Buttons.** Three variants (primary, secondary, ghost), three sizes. Minimum touch target **44 × 44 px**. States: default, hover, active, focus-visible, disabled, loading. Loading state preserves width to avoid layout shift. Icon-only buttons require `aria-label`. Never disable a submit button without explaining why.

**Cards.** Consistent radius and elevation from tokens. If a whole card is clickable, use a single anchor with a stretched pseudo-element rather than nesting interactive elements — nested links inside a clickable card is an accessibility failure. Hover should be a genuine affordance, not decoration.

**Navigation.** Sticky header that condenses on scroll. Current section indicated via scroll-spy on the home page and route match elsewhere. Mobile: full-screen overlay, focus trapped, `Esc` closes, background scroll locked, focus returned to the trigger on close. Skip-to-content link as the first focusable element.

**Sections.** One `<Section>` primitive owning vertical rhythm, container width, and optional eyebrow/heading/description slots. Every section has a stable `id` for anchor linking.

**Forms.** Labels always visible — placeholders are not labels. Inline validation on blur, not on every keystroke. Errors announced via `aria-live`, associated with `aria-describedby`, and never conveyed by colour alone. Correct `autocomplete` and `inputmode`. Success and failure states must both be designed.

**Project displays.** Grid on the index, full case study on detail routes. Every project card carries: title, one-line summary, tech tags, and a clear primary action. Cards in a row must be equal height. Images need explicit aspect ratios to prevent shift. **A card must be legible with images disabled.**

## 2.9 Responsive requirements

| Breakpoint | Width        | Layout                                      |
| ---------- | ------------ | ------------------------------------------- |
| Mobile     | 320–639 px   | Single column, stacked, full-width cards    |
| Tablet     | 640–1023 px  | Two columns, condensed nav                  |
| Desktop    | 1024–1439 px | Full layout, 12-column grid                 |
| Wide       | 1440 px+     | Capped container, increased whitespace only |

- **Design mobile-first.** Write base styles for mobile and layer up.
- Test at **320 px** — no horizontal scroll at any width.
- Fluid type via `clamp()` between breakpoints rather than stepped jumps.
- Touch targets ≥ 44 px with ≥ 8 px separation.
- Hover-dependent information must have a non-hover equivalent.
- Respect safe-area insets on notched devices.
- Test landscape orientation on mobile — heroes commonly break there.

## 2.10 Accessibility standards

**Target: WCAG 2.2 Level AA. Treated as acceptance criteria.**

- Semantic HTML first. `<button>` for actions, `<a>` for navigation, real `<nav>`/`<main>`/`<article>`/`<footer>` landmarks. ARIA only where semantics genuinely fall short.
- Full keyboard operability. Logical tab order, no traps, `focus-visible` styling on everything interactive with a **3:1** contrast indicator.
- All images have meaningful `alt`; decorative images use `alt=""`.
- Colour is never the sole carrier of meaning.
- Respect `prefers-reduced-motion` (see 3.4).
- Page zoom to 200% without loss of content or function.
- Test with a screen reader on the primary user journey at minimum.
- Automated audit via `axe-core` in CI — zero violations is the merge gate.

## 2.11 User journey

**Primary flow — recruiter, 90 seconds:**

```
Land on hero
  → Read: name, role, stack, availability, visa status      (0–10 s)
  → Scan: featured projects with outcomes                    (10–40 s)
  → Open: one case study, skim architecture and decisions    (40–75 s)
  → Act:  download CV / open GitHub / open LinkedIn / email  (75–90 s)
```

**Design implications, and these are requirements:**

1. Hero must answer _who, what, where, available?_ without scrolling.
2. A primary call to action must be visible at all times — hero, sticky header, and footer.
3. Maximum **two clicks** from any page to contact details.
4. CV download reachable from header, hero, and footer.
5. Case studies must be skimmable: headings, pull quotes, and diagrams should carry the argument for a reader who never reads a full paragraph.
6. Every terminal page ends with a next action. No dead ends.

**Secondary flow — engineer evaluating depth:** hero → case study → architecture diagram → decisions and tradeoffs → GitHub repository. Optimise for their patience: they will read, and they are the ones who will vouch for the hire.

---

# PART 3 — ANIMATION, PERFORMANCE & ADVANCED

## 3.1 Animation philosophy

**Motion must justify itself.** Every animation answers one of three questions: _Where did this come from? Where did it go? What just changed?_ If it answers none, delete it.

The stated audience is engineers and technical recruiters. Excessive motion reads as compensating for thin substance, and scattered effects are one of the strongest tells of AI-generated design. **One orchestrated moment lands harder than fifteen scattered ones.**

## 3.2 Where animation is appropriate — and where it is not

**Use it for:**

- The page-load sequence — one deliberate, well-timed hero entrance
- Scroll reveals — subtle, once, never replayed on scroll-up
- Micro-interactions confirming user action (button press, form state, copy-to-clipboard)
- Route transitions maintaining spatial continuity
- Loading and skeleton states
- Theme toggle

**Never use it for:**

- Text that animates in word by word or letter by letter
- Continuous ambient motion — floating shapes, particles, drifting gradients
- Parallax on more than one element
- Counters that tick up on scroll
- Anything that delays content becoming readable
- Auto-playing carousels
- Typewriter effects in the hero (universally recognised as a template)
- Animated skill percentage bars
- Cursor-following custom elements

## 3.3 Timing and easing

| Interaction                                | Duration         | Easing                          |
| ------------------------------------------ | ---------------- | ------------------------------- |
| Micro (hover, focus, colour)               | 120–180 ms       | `ease-out`                      |
| Standard (dropdown, tooltip, small reveal) | 200–300 ms       | `cubic-bezier(0.4, 0, 0.2, 1)`  |
| Large (modal, drawer, route change)        | 300–450 ms       | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Hero entrance                              | 600–900 ms total | Custom, orchestrated            |

- **Animate only `transform` and `opacity`.** These are compositor-only. Animating `width`, `height`, `top`, `left`, `margin`, or `box-shadow` forces layout or paint on every frame.
- Enter faster than exit — the eye tolerates a slower departure.
- Stagger increments of 40–80 ms; **cap any stagger group at five items.**
- Tokenise durations and easings in `tokens.css`. No hard-coded timing values in components.

## 3.4 Reduced motion — mandatory

`prefers-reduced-motion: reduce` must be honoured throughout. This is a WCAG requirement, not a courtesy.

- Global CSS reset reducing all durations to ~0.01 ms.
- Animation library configured to respect the preference at the provider level.
- A `useReducedMotion` hook for JS-driven motion.
- **Reduced motion means removed, not merely faster.** Replace movement with an instant state change or a simple opacity fade.
- Content must be fully reachable and readable with all motion disabled — scroll-triggered content must never depend on the animation firing to become visible.

## 3.5 Scroll and page transitions

**Scroll reveals:** IntersectionObserver, threshold ~0.15, `rootMargin` around `0px 0px -80px 0px`. Trigger once, then unobserve. Maximum 16–24 px of travel with a fade. Never hide content that has not yet been revealed from the DOM or from search engines — start at `opacity: 0` in CSS only, never conditionally render.

**Route transitions:** ≤ 300 ms, no perceived blocking. Use Next.js `loading.tsx` and Suspense boundaries. The View Transitions API is acceptable where supported, with graceful degradation. Never delay first paint to run an exit animation.

**Micro-interactions:** hover lift ≤ 4 px, scale ≤ 1.02. Focus rings appear instantly — never animate a focus indicator in. Copy-to-clipboard, form submission, and theme switch all get immediate visual acknowledgement.

## 3.6 Performance budgets

**These are hard limits. Enforce in CI and fail the build on regression.**

| Metric                              | Budget                                               |
| ----------------------------------- | ---------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | **≤ 2.0 s** (target); 2.5 s is the failure threshold |
| **INP** (Interaction to Next Paint) | **≤ 200 ms**                                         |
| **CLS** (Cumulative Layout Shift)   | **≤ 0.05** (target); 0.1 is the failure threshold    |
| **TTFB**                            | ≤ 600 ms                                             |
| First-load JS, home route           | **≤ 120 KB gzipped**                                 |
| Total page weight, home             | ≤ 900 KB                                             |
| Lighthouse Performance              | **≥ 95**                                             |
| Lighthouse Accessibility            | **100**                                              |
| Lighthouse Best Practices           | ≥ 95                                                 |
| Lighthouse SEO                      | **100**                                              |

Note that **INP replaced FID** as a Core Web Vital — target INP, not FID.

## 3.7 Image optimisation

- `next/image` exclusively. No raw `<img>` outside of MDX escape hatches.
- **AVIF with WebP fallback.** Configure `formats` in `next.config.ts`.
- `priority` on the hero image only. Everything else lazy-loads.
- Explicit `sizes` on every responsive image — omitting it silently serves the largest variant.
- Blur placeholders on above-the-fold imagery.
- Source assets at 2× display size maximum; compress before committing.
- SVG for icons and diagrams, inlined where small, sprited where repeated. Never load an icon font.
- Every image has an explicit aspect ratio reserved in CSS.

## 3.8 Bundle and rendering

- **Static generation for every content route.** No route should require a server round-trip to render.
- `@next/bundle-analyzer` wired up; document the output in the final report.
- Import only what you use — no barrel-file wildcard imports from large libraries.
- Icons imported individually, never as a whole set.
- Audit the animation library's bundle cost; use a lazy/reduced entry point if available.
- No polyfills for browsers outside the support matrix (last 2 versions of evergreen browsers, plus iOS Safari 15+).
- No client-side data fetching for content that exists at build time.
- `next/font` for all typography — eliminates render-blocking font requests and layout shift.

## 3.9 SEO

- **Metadata API** on every route: unique `title`, `description` (150–160 chars), canonical URL.
- **Open Graph and Twitter cards** on every page. Generate OG images with `next/og` so they reflect real page content.
- **JSON-LD structured data:** `Person` on the home page (with `jobTitle`, `knowsAbout`, `alumniOf`, `sameAs` linking every profile), `WebSite`, `BreadcrumbList` on nested routes, and `CreativeWork` on project detail pages.
- `sitemap.ts` and `robots.ts` generated from routes, not hand-maintained.
- Semantic heading hierarchy — this is an SEO requirement as much as an accessibility one.
- Descriptive link text. Never "click here" or a bare "read more" without an accessible name.
- `lang` attribute set correctly. Structure for future locale addition.
- Real URLs for every project — do not build the projects section as a modal-only experience, because modals are not indexable and cannot be linked.

## 3.10 Security

- **Content Security Policy** with nonce-based script handling. No `unsafe-inline` in production.
- Security headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying unused features.
- **Contact form:** server-side Zod validation, rate limiting by IP, a honeypot field, and a bot check. Never trust client validation.
- **No secrets in client code.** Every environment variable exposed to the browser must be deliberately prefixed and reviewed; everything else stays server-side.
- All external links carry `rel="noopener noreferrer"`.
- Sanitise anything rendered as HTML.
- Dependency audit in CI; no known high-severity vulnerabilities at ship.
- No PII in analytics or logs.

## 3.11 Production quality bar

- **CI pipeline** running: typecheck → lint → format check → unit tests → build → Lighthouse CI → axe accessibility scan. Any failure blocks merge.
- **Error boundaries** at the route level, with a designed `error.tsx` and a designed `not-found.tsx`. Both must be genuinely useful pages, not stubs.
- **README** documenting: what this is, stack decisions and why, local setup in three commands, project structure, how to add content, deployment.
- `.env.example` complete and committed.
- Meaningful commit messages — Conventional Commits. The history is part of the work sample.
- No `console.log`, `TODO`, `FIXME`, or commented-out code at ship.
- Verified on Chrome, Firefox, Safari, and iOS Safari.
- Works with JavaScript disabled to the extent that content remains readable.

---

# PART 4 — COMPLETE BUILD SPECIFICATION

## 4.0 Site map

```
/                     Home — hero, about summary, skills, featured projects,
                      experience preview, education, contact CTA
/about                Full biography, values, timeline, education, certifications
/projects             All projects, filterable by technology
/projects/[slug]      Project detail / case study
/experience           Full professional timeline
/contact              Contact form and direct details
/404, /error          Designed states
```

Keep the home page a curated summary that links deeper. Do not duplicate full content on both the home page and a dedicated route.

## 4.1 Sections: format for each

Every section below is specified as **Objective · Content · UI structure · Interaction · Animation · Data fields · Performance**.

---

### SECTION 1 — Hero

**Objective.** Answer _who, what, where, and available?_ within ten seconds, and establish the visual thesis of the entire site.

**Content.**

- Name
- Role: _Software Engineer_
- One-sentence positioning line naming the real stack — TypeScript, Node.js, NestJS, React, React Native
- Location: Amman, Jordan
- **Availability statement — mandatory:** open to relocation, EU Blue Card eligible, graduating October 2026
- Primary CTA: _View projects_ · Secondary: _Download CV_ · Tertiary: GitHub, LinkedIn, email

**UI structure.** Full viewport height is permitted but not required — content must not be pushed below the fold to achieve it. A visible scroll affordance if full height is used. The signature element from `DESIGN.md` lives here.

**Interaction.** CTAs are keyboard reachable in logical order. Scroll indicator, if present, is decorative and `aria-hidden`.

**Animation.** The one orchestrated moment on the site. Sequenced entrance, 600–900 ms total, staggered by 60–80 ms. Must complete without blocking readability. Fully disabled under reduced motion.

**Data fields.** `name`, `role`, `tagline`, `location`, `availability { status, visaNote, graduationDate }`, `ctas[]`, `socials[]`

**Performance.** Contains the LCP element — no lazy loading, no client-side data dependency, fonts preloaded. This section alone determines the LCP score.

---

### SECTION 2 — About

**Objective.** Convert a stack list into a person, and establish credibility for the case studies that follow.

**Content.**

- 2–3 paragraphs, first person: what he builds, how he works, what he is moving toward
- The genuine differentiator: builds to client specification across many stacks, which produces unusual breadth and fast onboarding into unfamiliar codebases
- Formal training in Clean Architecture, DDD, SOLID
- Currently completing AWS Certified Developer – Associate
- Graduating October 2026
- Professional photograph
- Optional: 3–4 factual figures — years of experience, applications in production, platforms shipped to. **Only real numbers.**

**UI structure.** Two columns desktop (text + portrait), stacked on mobile. Prose capped at 68ch.

**Interaction.** Minimal. This section is for reading. Inline link to the CV download.

**Animation.** Single fade-and-rise on scroll into view. Nothing per-paragraph.

**Data fields.** `bio[]`, `portrait { src, alt }`, `highlights[]`, `cvUrl`

**Performance.** Portrait lazy-loaded with explicit dimensions and a blur placeholder.

---

### SECTION 3 — Skills & Technology Stack

**Objective.** Let a recruiter confirm a keyword match in under five seconds, and let an engineer gauge depth.

**Content.** Grouped by category, ordered by the subject's actual strength:

| Group          | Items                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Languages      | TypeScript, JavaScript, PHP, SQL, C#                                  |
| Backend        | Node.js, NestJS, Express, Laravel 9–12, REST API design, ASP.NET Core |
| Frontend       | React, Next.js, Tailwind CSS                                          |
| Mobile         | React Native (CLI & Expo), App Store & Play Store release             |
| Data           | PostgreSQL, MySQL, Redis                                              |
| Infrastructure | Docker, CI/CD, GitHub Actions, AWS, Google Cloud Platform             |
| Practices      | Clean Architecture, DDD, SOLID, Agile, Jira, code review, testing     |

**UI structure.** Grouped grid. Consistent tag or chip treatment. Official brand icons only where licensing permits — otherwise typographic tags, which are safer and often look better.

**Interaction.** Optional: clicking a technology filters the projects index by it — a genuinely useful connection between sections rather than decoration.

**Animation.** Grid stagger, capped at five items per group. No hover animation beyond a subtle state change.

**Data fields.** `SkillGroup { id, label, skills: Skill[] }` · `Skill { name, level?, icon?, projectSlugs?[] }`

**Performance.** Pure static markup. Zero JS unless filtering is implemented.

> **Prohibited:** proficiency percentages, star ratings, animated progress bars. They are unverifiable, communicate nothing, and are a strong junior signal to the target audience.

---

### SECTION 4 — Experience Timeline

**Objective.** Present a clean, verifiable, gapless professional history — which matters unusually much here, because the same timeline will be cross-checked against a CV, LinkedIn, and a visa file.

**Content.** For each role: title, company, employment type, location, dates, 3–5 achievement bullets, technologies used. Include the university enrolment period so the timeline reads as continuous.

**Every date must match the CV and LinkedIn exactly.** Dates are sourced from `content/experience.ts` and nowhere else.

**UI structure.** Vertical timeline with a connecting spine. This is genuine sequential content, so numbered or dated markers are appropriate here — unlike elsewhere on the site.

**Interaction.** Entries may expand to reveal detail; collapsed state must still convey role, company, and dates. Expansion state in the URL hash so a specific role can be linked directly.

**Animation.** Sequential reveal as the spine enters the viewport. One direction only, triggered once.

**Data fields.** `Role { id, title, company, companyUrl?, employmentType, location, locationType, startDate, endDate | 'present', summary, achievements[], technologies[], confidentialityNote? }`

**Performance.** Static. Expansion is CSS-driven where possible.

---

### SECTION 5 — Projects Showcase

**Objective.** The evidence layer. This section carries the most weight of anything on the site.

**Content.** 3–6 projects maximum. Fewer, deeper entries beat a long list of small ones. Each card: title, one-line summary, tech tags, thumbnail with a real aspect ratio, links (live demo, repository, case study), and a status badge where relevant.

**UI structure.** Responsive grid — 3 columns desktop, 2 tablet, 1 mobile. Equal heights. Optional filter by technology, driven by URL query parameters so filtered views are linkable and shareable.

**Interaction.** Whole card is a single link target using a stretched-link pattern. Secondary links (repo, demo) sit outside the stretched region to avoid nested interactive elements.

**Animation.** Staggered grid reveal, ≤ 5 at a time. Restrained hover lift.

**Data fields.**

```
Project {
  slug, title, summary, description,
  role, timeframe, status,
  technologies[], categories[],
  thumbnail { src, alt, width, height },
  links { live?, repo?, caseStudy? },
  featured: boolean,
  kind: 'personal' | 'professional',
  confidential: boolean
}
```

**Performance.** Thumbnails lazy-loaded below the fold with explicit dimensions. Filtering is client-side over pre-rendered data — no refetch.

---

### SECTION 6 — Project Detail & Case Studies

**Objective.** **This is the section that solves the confidentiality problem, and it is the most important page on the site.** Professional work cannot be shown as code, so it must be argued in prose. Done well, a case study is more persuasive than a repository, because it demonstrates thinking rather than syntax.

**Content — required structure for each case study:**

1. **Context** — what the system was for, who used it, what constraints applied
2. **The problem** — stated concretely
3. **Approach** — architecture and technology choices _with reasoning_
4. **Architecture diagram** — SVG, readable in both themes, with a text alternative
5. **Key decisions and tradeoffs** — _"chose X over Y because Z, accepting cost W."_ The single highest-signal element on the site
6. **Challenges and how they were resolved**
7. **Outcome** — real, verifiable figures, or scope where figures are unavailable
8. **What I would do differently** — nothing signals seniority faster than knowing your own limits
9. **Stack summary**
10. **Links** — live and repository where publishable

**Confidentiality handling.** For client work: describe system type, scale, technologies, and personal contribution. Never name clients, never show schemas, never publish proprietary logic. Include a short, matter-of-fact note stating that client work is confidential and descriptions are generalised. Handled well, this reads as professionalism.

**UI structure.** Article layout, prose capped at 68ch, sticky table of contents on desktop, clear reading progress. Pull quotes for key decisions.

**Interaction.** Anchor links to each heading. Prev/next project navigation. Persistent contact CTA at the end.

**Animation.** Minimal — this is a reading experience. Fade-in on diagrams only.

**Data fields.** Project fields plus `caseStudy { context, problem, approach, architecture { diagram, altText }, decisions[{ decision, alternatives, reasoning, tradeoff }], challenges[], outcomes[], retrospective, gallery[] }`

**Performance.** Statically generated via `generateStaticParams`. Diagrams as inline SVG. MDX compiled at build time.

---

### SECTION 7 — Education & Certifications

**Objective.** Establish formal credentials, which matter more for visa-sponsored roles than for domestic ones — degree recognition is a legal prerequisite for the EU Blue Card.

**Content.**

- **BSc Software Engineering**, Al-Zaytoonah University of Jordan, Oct 2021 – Oct 2026 (expected). Note the pause for Orange Coding Academy.
- **Orange Coding Academy**, Full Stack Development Programme, Oct 2022 – Oct 2023
- Certifications: AWS Certified Developer – Associate _(in progress)_, IELTS _(in progress)_, GitHub Foundations, Sky Software Backend (.NET, Clean Architecture, DDD, SOLID), Sky Software Front-End (Angular, TypeScript)

**UI structure.** Two groups. Certifications as a compact card grid with issuer, date, and verification link where one exists.

**Interaction.** Credential links open in a new tab with `rel="noopener noreferrer"`.

**Animation.** Simple stagger. Nothing more.

**Data fields.** `Education { institution, degree, field, startDate, endDate, status, note? }` · `Certification { name, issuer, issueDate, expiryDate?, credentialId?, credentialUrl?, skills[], status: 'earned' | 'in-progress' }`

**Performance.** Static. Issuer logos as optimised SVG or omitted entirely.

---

### SECTION 8 — Contact

**Objective.** Remove every obstacle between an interested recruiter and a conversation.

**Content.** Short invitation line. Direct email (as a `mailto:` link, visible as text). LinkedIn, GitHub, portfolio links. Location and time zone. **Availability and work-authorisation statement, repeated here.** Contact form.

**UI structure.** Form plus direct-details panel side by side on desktop, stacked on mobile. Form fields: name, email, subject/purpose, message. Nothing else — every additional field reduces completion.

**Interaction.** Inline validation on blur. Clear loading state on submit. Explicit success and error states. Email address must be copyable in one click with visible confirmation. **The form must never be the only route to contact** — a visible email address is essential, because many recruiters will not use a form.

**Animation.** Button state transitions and success confirmation only.

**Data fields.** `ContactForm { name, email, subject, message }` validated by a shared Zod schema. `ContactInfo { email, phone?, location, timezone, socials[], availability }`

**Performance.** Form component is the only client-side JS in this section. Server-side rate limiting and honeypot per 3.10.

---

### SECTION 9 — Footer

**Objective.** Provide a reliable exit and reinforce the essentials.

**Content.** Name and role. Site navigation. Social links with accessible names. Email. Availability line. Copyright with a build-time year. A brief colophon naming the stack — appropriate on an engineer's site, and quietly demonstrative.

**UI structure.** Multi-column desktop, stacked mobile. Visually distinct from the page body.

**Animation.** None.

**Data fields.** Reuses `profile` and `navigation` config.

---

### SECTION 10 — CV / Resume Download

**Objective.** Deliver the document most recruiters actually forward internally.

**Requirements.**

- PDF served from `/public/documents/`
- Descriptive filename: `Jack-Alloussi-Software-Engineer-CV.pdf`
- Accessible from header, hero, about section, and footer
- `download` attribute set
- Link text states format and size: _Download CV (PDF, 240 KB)_
- Optional: two variants (Germany / UAE) behind a small selector, since the two markets require materially different documents
- Track the download event if analytics are added later

---

### SECTION 11 — Social Links

- GitHub, LinkedIn, email at minimum
- Accessible names on every icon link — never an unlabelled icon
- Consistent icon sizing and touch targets ≥ 44 px
- Every URL also present in the `Person` JSON-LD `sameAs` array

---

### CONDITIONAL SECTIONS — read the reasoning before building

**Services — do not build by default.**
A services section signals freelance availability. That actively conflicts with the site's actual objective: securing a full-time, visa-sponsored position. A recruiter deciding whether to sponsor a relocation should not encounter a page implying the candidate is building a contracting practice. **Omit unless explicitly requested.**

**Testimonials — build only with real quotes.**
Powerful when genuine, damaging when thin or invented. Requires named individuals with roles, companies, and ideally photographs. **Two real testimonials beat six anonymous ones, and zero beats two fabricated ones.** If real quotes are not yet available, omit the section and revisit once LinkedIn recommendations exist — those can be quoted with permission and are independently verifiable.

**Professional achievements — fold into Experience.**
As a standalone section this tends to read as padding at this career stage. Achievements belong as bullets under the roles that produced them, where they carry context.

---

## 4.2 Content data model summary

All content lives in `src/content/`, validated by Zod schemas in `content/schemas.ts` at build time. **A schema violation must fail the build.**

| File                | Exports                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `profile.ts`        | Name, role, tagline, bio, location, availability, socials, CV paths      |
| `projects/*.mdx`    | One file per project; frontmatter validated against the `Project` schema |
| `experience.ts`     | `Role[]` — the single source of truth for all employment dates           |
| `skills.ts`         | `SkillGroup[]`                                                           |
| `education.ts`      | `Education[]`                                                            |
| `certifications.ts` | `Certification[]`                                                        |
| `navigation.ts`     | Header and footer link structures                                        |

**Acceptance test for the data layer:** adding a new project requires creating exactly one MDX file and editing nothing else. If any component needs changing, the abstraction has failed.

---

# PART 5 — AI AGENT INSTRUCTIONS

## 5.0 Execution order

Do not deviate from this sequence. Steps 1 and 2 exist to prevent the most common failure mode: producing a competent generic site.

```
1.  Read Parts 0–3 in full
2.  Write /docs/DESIGN.md  → plan, then critique against §2.2 and §2.3
3.  Scaffold project, tooling, CI, tokens
4.  Build the design system primitives (components/ui/)
5.  Build layout shell (Header, Footer, Section, Container)
6.  Populate content/ with typed data + Zod schemas
7.  Build sections in the order of Part 4
8.  Build project detail / case study route
9.  Add motion layer (last, never first)
10. Performance, SEO, accessibility passes
11. Write tests
12. Run every checklist in §5.1–5.7
13. Produce the final report (§5.8)
```

**Build motion last.** Animation added early gets baked into component structure and becomes hard to remove or make reduced-motion-safe.

## 5.1 Architecture quality checklist

- [ ] `tsconfig` strict flags all enabled per §1.2; build passes with zero errors
- [ ] Zero occurrences of `any` in `src/`
- [ ] Zero non-null assertions without an adjacent guard and comment
- [ ] `import/no-cycle` passes
- [ ] No UI primitive imports from a feature module
- [ ] No content file imports a component
- [ ] `'use client'` appears only where genuinely required; count is documented and justified
- [ ] Every component under 150 lines
- [ ] All content validated by Zod at build time; an invalid field fails the build
- [ ] Environment variables parsed and typed in one place
- [ ] Naming conventions consistent throughout (§1.7)
- [ ] **Adding a project requires editing exactly one file**
- [ ] ESLint and Prettier pass with zero warnings
- [ ] `README.md` and `docs/ARCHITECTURE.md` written
- [ ] At least 3 ADRs recorded in `docs/adr/`
- [ ] No `console.log`, `TODO`, `FIXME`, or commented-out code
- [ ] Conventional Commits used throughout

## 5.2 UI/UX quality checklist

- [ ] `docs/DESIGN.md` exists, including the pass-2 critique and what was revised
- [ ] The design matches none of the three default directions in §2.2
- [ ] The signature element is identifiable and named
- [ ] Every colour, spacing, radius, and duration references a token — zero magic values
- [ ] Type scale applied consistently; no ad-hoc font sizes
- [ ] Body text never below 16px anywhere, including captions and footer
- [ ] Prose columns capped at 65–75 characters
- [ ] Section vertical rhythm consistent, owned by one primitive
- [ ] Dark and light modes both complete, with no theme flash on load
- [ ] Theme switching requires no component-level conditionals
- [ ] Every interactive element has hover, focus-visible, active, and disabled states
- [ ] Loading, empty, and error states designed where applicable
- [ ] `404` and `error` pages designed and useful
- [ ] No lorem ipsum; no invented metrics
- [ ] All `{{NEEDS_INPUT}}` tokens catalogued in `docs/CONTENT-GAPS.md`

## 5.3 Responsive checklist

- [ ] No horizontal scroll at 320px
- [ ] Verified at 320, 375, 414, 768, 1024, 1280, 1440, 1920
- [ ] Mobile landscape verified — especially the hero
- [ ] Touch targets ≥ 44 × 44px with ≥ 8px separation
- [ ] Mobile nav: focus trapped, `Esc` closes, scroll locked, focus restored on close
- [ ] Tables and code blocks scroll horizontally within their container, not the page
- [ ] Fluid type via `clamp()`; no jarring breakpoint jumps
- [ ] No hover-only information without a non-hover equivalent
- [ ] Safe-area insets respected
- [ ] Images correct at 1× and 2× density

## 5.4 Performance checklist

- [ ] Lighthouse Performance ≥ 95 (mobile, throttled)
- [ ] LCP ≤ 2.0 s · **INP ≤ 200 ms** · CLS ≤ 0.05
- [ ] First-load JS on `/` ≤ 120 KB gzipped — report the actual figure
- [ ] Bundle analyzer run; output documented
- [ ] Every route statically generated
- [ ] All images via `next/image` with explicit dimensions and `sizes`
- [ ] AVIF/WebP configured; hero uses `priority`, everything else lazy
- [ ] Fonts self-hosted via `next/font`, subset, `display: swap`, max 3 families / 6 weights
- [ ] Zero layout shift on font load
- [ ] Only `transform` and `opacity` animated
- [ ] No render-blocking third-party resources
- [ ] Lighthouse CI wired into the pipeline with budgets enforced

## 5.5 Accessibility checklist

- [ ] `axe-core` reports **zero** violations on every route
- [ ] Lighthouse Accessibility = 100
- [ ] Full keyboard traversal of the primary journey without a mouse
- [ ] Visible `focus-visible` indicator at ≥ 3:1 contrast on every interactive element
- [ ] Skip-to-content link present and functional
- [ ] Semantic landmarks: `header`, `nav`, `main`, `footer`
- [ ] One `h1` per page; no skipped heading levels
- [ ] All images have appropriate `alt`; decorative images `alt=""`
- [ ] Architecture diagrams have text alternatives
- [ ] Form labels visible and programmatically associated
- [ ] Errors announced via `aria-live` and not conveyed by colour alone
- [ ] Contrast verified programmatically — including muted text on every surface
- [ ] `prefers-reduced-motion` fully honoured; all content reachable with motion off
- [ ] 200% zoom without loss of content or function
- [ ] Screen-reader tested on the primary journey
- [ ] No keyboard traps; modal focus management correct

## 5.6 SEO checklist

- [ ] Unique `title` and `description` on every route
- [ ] Canonical URLs set
- [ ] Open Graph and Twitter cards on every page, with generated OG images
- [ ] JSON-LD: `Person`, `WebSite`, `BreadcrumbList`, `CreativeWork` — validated against Google's Rich Results test
- [ ] `sameAs` includes every social profile
- [ ] `sitemap.xml` and `robots.txt` generated from routes
- [ ] Every project has a real, indexable URL — no modal-only content
- [ ] Semantic heading hierarchy
- [ ] Descriptive link text throughout
- [ ] `lang` attribute correct
- [ ] Lighthouse SEO = 100

## 5.7 Production readiness checklist

- [ ] CI green: typecheck → lint → format → test → build → Lighthouse → axe
- [ ] Unit tests on `lib/` utilities and content validators
- [ ] E2E test covering the primary user journey (§2.11)
- [ ] Contact form: server-side validation, rate limiting, honeypot, verified success and failure paths
- [ ] CSP and security headers configured; no `unsafe-inline` in production
- [ ] No secrets in client bundles
- [ ] `rel="noopener noreferrer"` on all external links
- [ ] Dependency audit clean of high-severity issues
- [ ] `.env.example` complete
- [ ] Verified on Chrome, Firefox, Safari, iOS Safari
- [ ] Favicon set and web manifest complete
- [ ] Custom `404` and `error` pages
- [ ] CV PDF present, correctly named, and downloading
- [ ] Every external link manually clicked and confirmed
- [ ] Content readable with JavaScript disabled

## 5.8 Final report — required output

On completion, produce `docs/BUILD-REPORT.md` containing:

1. **Design rationale** — the direction chosen, why, and the one aesthetic risk taken
2. **Measured results** — Lighthouse scores per route, actual bundle sizes, actual Core Web Vitals
3. **`'use client'` inventory** — every occurrence with its justification
4. **Content gaps** — the full `{{NEEDS_INPUT}}` list, prioritised by impact
5. **Known limitations** — anything knowingly deferred, and why
6. **Suggested next steps** — ranked

## 5.9 Standing rules for the whole build

1. **Never invent factual content.** Placeholders only, tracked and reported.
2. **Never ship a checklist item marked complete that was not verified.** If you could not measure it, say so.
3. **When this specification and your instinct conflict, follow the specification** — and note the disagreement in the build report.
4. **Prefer deleting to adding.** The finished site should feel edited, not accumulated.
5. **The repository is part of the deliverable.** Build it as though it will be reviewed, because it will be.

---

## Appendix — Content the client must supply

Request these before or during the build; do not fabricate substitutes.

| Item                                                      | Why it matters                                      |
| --------------------------------------------------------- | --------------------------------------------------- |
| Professional photograph                                   | About section                                       |
| Confirmed employment dates for all roles                  | Must match CV, LinkedIn, and visa documents exactly |
| 3–6 projects with real detail                             | The entire evidence layer                           |
| Case study material for 1–2 professional projects         | Highest-value content on the site                   |
| Any real metrics from Jira                                | Replaces every placeholder outcome                  |
| Exact degree title from the certificate                   | Education section and structured data               |
| Written confirmation of what client work may be described | Governs case study wording                          |
| CV PDF, final version                                     | Download target                                     |
| Certification issue dates and credential URLs             | Certifications section                              |
| Domain name                                               | Canonical URLs, OG tags, sitemap                    |
