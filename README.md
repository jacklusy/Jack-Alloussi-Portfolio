# Jack Alloussi — Portfolio

Personal portfolio for a software engineer based in Amman, Jordan — built as a work sample for EU (especially Germany) and Gulf hiring managers.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Zod · React Hook Form · Vitest · pnpm

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests |
| `pnpm analyze` | Bundle analyzer |

## Content

Edit typed modules under `src/content/`. Schemas live in `src/content/schemas.ts`. Gaps use `{{NEEDS_INPUT: …}}` — see `docs/CONTENT-GAPS.md`.

**Adding a project:** one entry in `src/content/projects/index.ts` (+ thumbnail). No component changes.

## Design

See `docs/DESIGN.md` (Status Rail signature, cool teal palette, Syne + IBM Plex).

## CV

Place the final PDF at:

`public/documents/Jack-Alloussi-Software-Engineer-CV.pdf`
