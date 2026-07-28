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

- Header (mobile nav, scroll condense)
- ThemeToggle
- ExperienceTimeline (expand/collapse)
- ContactForm / CopyEmailButton
- ProjectsFilter
- error.tsx boundary

## Content

All factual data lives in `src/content/` and is parsed with Zod at module load. Invalid data fails the build. Placeholders use `{{NEEDS_INPUT: …}}` and are catalogued in `docs/CONTENT-GAPS.md`.

## Adding a project

1. Add one entry to `src/content/projects/index.ts` (or a new file re-exported from the index).
2. Drop any thumbnail under `public/images/projects/`.
3. No component changes required — routes use `generateStaticParams`.
