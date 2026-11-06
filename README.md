# Jack Alloussi — Portfolio

Personal portfolio for a software engineer based in Amman, Jordan — built as a work sample for EU (especially Germany) and Gulf hiring managers.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · next-intl · Zod · React Hook Form · Motion · Vitest · Playwright · pnpm

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/de` (German is the default language; see [Internationalisation](#internationalisation)).

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests (content validation + translation parity) |
| `pnpm test:e2e` | Playwright end-to-end tests (builds + starts a prod server) |
| `pnpm analyze` | Bundle analyzer |

## Internationalisation

Four languages: German (`de`, default), English (`en`), French (`fr`), Arabic (`ar`, RTL). URLs are locale-prefixed (`/de`, `/en/projects`, …), routed by `next-intl` via `src/proxy.ts` and `src/i18n/routing.ts`.

- **UI strings** live in `src/i18n/messages/<locale>.json`, used with `useTranslations()` / `getTranslations()`.
- **Content** (profile, experience, projects, …) is split: language-neutral facts (dates, URLs, images, tech names) stay as typed TypeScript under `src/content/`; the words a visitor reads live in `src/i18n/content/<locale>/**.json`. `src/content/index.ts` merges the two per request and re-validates with Zod, so a missing or malformed translation fails the build.
- `tests/unit/i18n.test.ts` asserts every language has the same keys, array lengths and ICU placeholders as English, with no empty strings.
- `docs/i18n-glossary.md` is the voice/terminology guide used when translating.
- RTL: Tailwind logical properties (`ps-`, `me-`, `start-`, …) throughout; `:lang(ar)` rules in `src/styles/globals.css` swap in an Arabic font and turn off letter-tracking/uppercase, which break Arabic letter joining.

## Content

Edit structure in `src/content/*.ts` and matching text in `src/i18n/content/<locale>/*.json`. Schemas live in `src/content/schemas.ts`. Gaps use `{{NEEDS_INPUT: …}}` — see `docs/CONTENT-GAPS.md`.

**Adding a project:** one structure entry in `src/content/projects/<slug>.ts` (registered in `src/content/projects/index.ts`) plus a `src/i18n/content/<locale>/projects/<slug>.json` for each of the four languages.

## Design

See `docs/DESIGN.md` (Status Rail signature, cool teal palette, Syne + IBM Plex).

## CV

Place the final PDF at:

`public/documents/Jack-Alloussi-Software-Engineer-CV.pdf`
