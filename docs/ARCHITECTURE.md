# Architecture

## Layers

```
Presentation  → app/ routes, section composition
Feature       → features/*, components/features/*
Shared        → components/ui, components/layout, hooks, lib
Data          → content/* (Zod-validated), config/*
```

Dependencies point downward only. Content never imports components. UI primitives never import features.

## Server vs client

Default to Server Components. `'use client'` is reserved for:

- Header (mobile nav, scroll condense), LanguageSwitcher
- ThemeToggle
- ExperienceTimeline (expand/collapse)
- ContactForm / CopyEmailButton
- ProjectsFilter
- Scroll-driven motion primitives (`components/motion/*`: Reveal, ScrollParallax, ClipReveal, CountUp, WordReveal, StackedCards, SectionRail, …)
- error.tsx boundary

## Internationalisation

All routes live under `app/[locale]/`, routed by `next-intl` (`src/proxy.ts`, `src/i18n/routing.ts`). `src/i18n/navigation.ts` exports locale-aware `Link`/`useRouter`/`usePathname` — components use these, never the raw `next/link` / `next/navigation` ones, so every internal href gets the right language prefix automatically.

Every content entity is split in two:

- **Structure** — language-neutral facts (dates, URLs, imported images, tech names, flags) — stays in `src/content/*.ts`, validated by the `*StructureSchema`s in `src/content/schemas.ts`.
- **Text** — everything a visitor reads — lives in `src/i18n/content/<locale>/*.json`, validated by the matching `*TextSchema`s.

`src/content/index.ts` merges structure + text for a given locale (`getProfile(locale)`, `getProjects(locale)`, …) and re-parses the result with the full content schemas, so a missing or malformed translation fails the build rather than rendering a hole in the page. This module is server-only — a client component must never import it directly (same reasoning as `ProjectsFilter`'s existing note on `@/content/projects`), since the merge pulls in every language's prose.

UI chrome strings (nav, buttons, labels, errors, a11y text) are separate again, in `src/i18n/messages/<locale>.json`, read with `useTranslations()` (client) / `getTranslations()` (server).

`tests/unit/i18n.test.ts` is the guard rail: every language must have the same keys, array lengths and ICU placeholders as English (the source of truth), with no empty strings.

## Content

All factual data lives in `src/content/` (structure) and `src/i18n/content/<locale>/` (text), parsed with Zod at merge time. Invalid or missing data fails the build. Placeholders use `{{NEEDS_INPUT: …}}` and are catalogued in `docs/CONTENT-GAPS.md`.

## Adding a project

1. Add one structure entry to `src/content/projects/<slug>.ts` (registered in `src/content/projects/index.ts`).
2. Add `src/i18n/content/<locale>/projects/<slug>.json` for `de`, `en`, `fr` and `ar` (same shape; see `docs/i18n-glossary.md` for terminology).
3. Drop any thumbnail under `public/images/projects/`.
4. No component changes required — routes use `generateStaticParams`, per locale.
