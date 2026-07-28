# Skill: Animation, Performance & Optimization (Next.js)

## Purpose

This skill defines how the AI coding tool must implement motion, interaction feedback, and performance/optimization strategy for a production Next.js application. It governs animation principles, loading/feedback states, rendering performance, bundle size, caching, SEO, and Core Web Vitals. It builds on top of Skill 1 (architecture) and Skill 2 (design system) — motion and performance decisions must respect both.

---

## 1. Animation Philosophy

- **Motion must have purpose**: every animation should communicate something — state change, spatial relationship, causality, or feedback. Never animate purely for decoration.
- **Subtlety over spectacle**: production UI motion should feel fast and understated. If a user consciously notices "that was a cool animation," it's usually too slow or too large.
- **Consistency**: the same interaction type (e.g., modal open, dropdown expand, page transition) uses the same timing/easing everywhere in the app.
- **Interruptible & responsive**: animations must not block user input; if a user acts again mid-animation, the new action takes priority smoothly (no queued/backed-up motion).
- **Respect `prefers-reduced-motion`**: all non-essential animation must be disabled or reduced to instant/opacity-only transitions when this is set.

---

## 2. Timing & Easing Standards

- **Duration scale** (do not invent arbitrary durations):
  - Micro-interactions (hover, button press, toggle): **100–150ms**
  - Small UI transitions (dropdown, tooltip, accordion): **150–250ms**
  - Medium transitions (modal open/close, drawer, page section change): **250–350ms**
  - Large/complex transitions (page transitions, full-screen overlays): **350–500ms** (rarely exceed this)
- **Easing**:
  - Entrances: ease-out (`cubic-bezier(0.16, 1, 0.3, 1)` or similar) — fast start, gentle finish, feels responsive.
  - Exits: ease-in — quick departure, doesn't linger.
  - Avoid default linear easing for anything user-facing; linear motion reads as mechanical/unnatural.
- **Never exceed ~500ms** for any interactive UI transition — anything longer feels sluggish regardless of easing.
- Define timing/easing as shared tokens (CSS variables or a motion config object) — do not hardcode per-component magic numbers.

---

## 3. Micro-Interactions

- **Buttons**: subtle scale/opacity/background shift on hover (~100–150ms) and a slightly more pronounced feedback on active/press (e.g., scale down 2–4%).
- **Inputs/Forms**: focus ring transition, label float (if using floating labels), and inline validation messages should fade/slide in, not pop abruptly.
- **Toggles/checkboxes/switches**: state change animated (150–200ms) to visually confirm the change registered.
- **Hover states** on cards/list items: subtle elevation/shadow or border change, never large layout shifts on hover.
- **Icon feedback**: icons that trigger actions (like, bookmark, delete) should have a small confirming animation (scale pulse, color transition) to reinforce the action succeeded.
- Micro-interactions must never introduce layout shift — animate `transform`/`opacity`, not `width`/`height`/`margin` where avoidable.

---

## 4. Transitions & Page-Level Motion

- **Element enter/exit**: use fade + slight translate (8–16px) combinations for elements entering/leaving the viewport (toasts, modals, dropdowns) rather than abrupt appearance.
- **Modals/Dialogs**: backdrop fades in, panel scales/slides in slightly (from 96–98% scale or a small Y-offset) — combined duration ~200–300ms.
- **Route/page transitions**: keep minimal and fast; avoid full-page fade-outs that delay perceived load — prioritize instant navigation with content streaming in (Next.js streaming/suspense) over heavy transition choreography.
- **List animations**: when items are added/removed/reordered, animate position changes (e.g., FLIP technique or a motion library's layout animation) rather than an abrupt jump.
- **Staggering**: when animating groups of elements in (e.g., a grid of cards on load), use small stagger delays (~30–50ms between items) capped at a reasonable total duration — never stagger so much that the last item feels delayed.

---

## 5. Loading States & Visual Feedback

- **Every async action must show feedback within ~100ms** of being triggered — a UI that appears frozen erodes trust.
- **Skeleton screens** over spinners wherever content shape is predictable (lists, cards, tables) — skeletons should match the real content's layout/dimensions to avoid layout shift once loaded.
- **Spinners** reserved for short, indeterminate, layout-agnostic waits (e.g., inside a button during submit).
- **Button loading states**: disable the button, show an inline spinner and/or swap label text (e.g., "Save" → "Saving…"), never let a user double-submit a form.
- **Progressive/optimistic UI**: where safe, update the UI optimistically (e.g., a like button, adding an item) and reconcile with the server response, rolling back gracefully on failure.
- **Toasts/notifications**: used for transient feedback (success/error confirmations), auto-dismiss with a sensible timeout (~3–5s), always dismissible manually, never blocking interaction.
- **Progress indicators** for multi-step or long-running processes (uploads, multi-step forms) should show real or well-approximated progress, not a fake indefinite spinner for a known-duration task.
- **Never show a blank white screen** during loading — always a skeleton, spinner, or meaningful placeholder.

---

## 6. Animation Implementation Guidelines

- Prefer animating **`transform` and `opacity`** only — these are GPU-accelerated and do not trigger layout/reflow. Avoid animating `width`, `height`, `top`, `left`, `margin` directly.
- Use a motion library (e.g., Framer Motion / Motion for React) for orchestrated, interruptible, physics-based animation; use CSS transitions for simple, single-property state changes (hover, focus) to keep bundle weight down.
- **Avoid animating too many elements simultaneously** — large-scale simultaneous animation (e.g., every card on a page animating independently with heavy shadows) can cause jank; batch/stagger and simplify effects.
- **will-change** used sparingly and only on elements actively animating — not applied globally, as it consumes GPU memory.
- Test all animations at 60fps target; anything causing visible jank should be simplified or removed rather than "optimized" indefinitely.

---

## 7. Next.js Rendering Performance

- **Default to Server Components**; only opt into Client Components where interactivity/state is required (directly impacts bundle size and hydration cost).
- **Streaming & Suspense**: use `loading.tsx` and `<Suspense>` boundaries to stream in slower data-dependent sections without blocking the whole page render.
- **Avoid unnecessary re-renders**:
  - Memoize expensive computations (`useMemo`) and stable callbacks passed to memoized children (`useCallback`) only where profiling shows benefit — not reflexively everywhere.
  - Split large client components so state changes in one part don't re-render unrelated UI.
- **Virtualize long lists** (hundreds+ items) using a virtualization library rather than rendering the full DOM list.
- **Avoid layout thrashing**: batch DOM reads/writes; avoid synchronous layout-triggering operations in loops.
- **Hydration cost awareness**: minimize the amount of interactive JS shipped for above-the-fold, largely static content.

---

## 8. Image & Asset Optimization

- **Always use `next/image`**: automatic responsive `srcset`, lazy loading (except above-the-fold), and format optimization (AVIF/WebP) are mandatory for all product imagery.
- **Explicit width/height (or fill + aspect-ratio container)** on every image to prevent Cumulative Layout Shift (CLS).
- **Priority loading**: mark true above-the-fold hero/LCP images with `priority` — but use this sparingly (only the actual LCP element), not on every image.
- **Correctly sized source assets**: never ship a 4000px-wide source image for a 400px display slot; provide appropriately sized originals.
- **Modern formats** (AVIF/WebP) preferred over PNG/JPEG where supported, with automatic fallback handled by `next/image`.
- **Icons**: use SVG (inline or as components) over icon fonts or raster images for crispness and small size.
- **Fonts**: use `next/font` (self-hosted, no external render-blocking requests), subset to required character sets, and use `font-display: swap` semantics to avoid invisible text during load.

---

## 9. Bundle Size Optimization

- **Code-split by route** (automatic with Next.js App Router) and further split heavy, rarely-used components via `next/dynamic` (e.g., rich text editors, charting libraries, modals with heavy content).
- **Audit dependencies before adding them**: prefer lightweight, tree-shakeable libraries; avoid pulling in a large library for a small utility need (e.g., don't import all of lodash for one function — use targeted imports or native alternatives).
- **Avoid duplicate functionality libraries**: standardize on one date library, one animation library, one icon set project-wide.
- **Tree-shaking hygiene**: use named ES module imports; avoid default/wildcard imports (`import * as _ from 'lodash'`) that defeat tree-shaking.
- **Analyze bundle regularly**: use `@next/bundle-analyzer` (or equivalent) to catch unexpected bundle bloat before it ships.
- **Lazy-load below-the-fold and non-critical UI** (heavy modals, secondary widgets, analytics scripts) instead of including them in the initial bundle.

---

## 10. Caching & Data Strategy

- **Leverage Next.js caching layers deliberately**: static rendering by default where content isn't highly dynamic; explicit `revalidate`/tag-based invalidation for content that changes on a known cadence; dynamic rendering only where truly necessary (personalized/real-time data).
- **Use `fetch` caching options intentionally** (`cache: 'force-cache'` vs `'no-store'` vs time-based `revalidate`) and document the reasoning for non-default choices.
- **Client-side caching** for repeated data fetching (React Query/SWR-style stale-while-revalidate) to avoid redundant network calls and to keep UI responsive during navigation.
- **CDN-friendly static assets**: ensure static assets are served with long-lived cache headers and content-hashed filenames for safe long-term caching.
- **Avoid over-fetching**: request only the fields/data actually needed per view; paginate large collections server-side rather than fetching everything client-side.

---

## 11. SEO Fundamentals (Next.js)

- Use the **Metadata API** (`generateMetadata` / static `metadata` export) for titles, descriptions, Open Graph, and Twitter card data on every route — no manual `<head>` tag manipulation.
- **Semantic, crawlable HTML**: content critical to SEO must be rendered server-side (Server Components), not injected purely client-side after hydration.
- **Structured data (JSON-LD)** added for relevant content types (articles, products, organizations) where applicable.
- **Descriptive, unique `<title>` and meta description** per route; avoid duplicate/generic titles across pages.
- **Canonical URLs** set to avoid duplicate-content issues, especially with query-parameter-driven views.
- **`sitemap.xml` and `robots.txt`** generated (via Next.js file conventions) and kept accurate as routes are added/removed.
- **Alt text and semantic headings (`h1`–`h6` in logical order)** support both accessibility and SEO simultaneously.

---

## 12. Core Web Vitals Targets

The AI must build with these thresholds as explicit targets, not afterthoughts:

| Metric                              | Good Target | What Impacts It                                                                                    |
| ----------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | ≤ 2.5s      | Server render speed, image optimization, font loading, render-blocking resources                   |
| **INP** (Interaction to Next Paint) | ≤ 200ms     | Main-thread work, JS execution cost, event handler efficiency                                      |
| **CLS** (Cumulative Layout Shift)   | ≤ 0.1       | Image/embed dimensions, font loading strategy, dynamically injected content without reserved space |
| **TTFB** (Time to First Byte)       | ≤ 0.8s      | Server/edge rendering strategy, caching, database query performance                                |

- Reserve space for all dynamically loaded content (ads, embeds, async components) to prevent CLS.
- Defer/avoid render-blocking third-party scripts; load analytics/marketing scripts with `next/script` using `strategy="afterInteractive"` or `"lazyOnload"` as appropriate.
- Keep main-thread JS work minimal on initial load — heavy computation should be deferred, memoized, or moved server-side.

---

## 13. Scalability Considerations

- Design animation and data-fetching patterns that **remain performant as data volume grows** (virtualized lists, paginated/streamed data, not "works fine with 10 items" assumptions).
- **Feature-flag heavy/experimental UI** so it can be toggled without a full redeploy, keeping production stable as new features are optimized.
- **Monitor performance in production** (Web Vitals reporting, error/performance logging) rather than only testing locally — assume real-world network/device conditions are worse than development conditions.
- Build with the assumption that **images, lists, and API responses will grow** — avoid patterns that only work at small scale (e.g., fetching an entire collection client-side "for now").

---

## 14. Pre-Ship Performance & Motion Checklist

- [ ] All animations use `transform`/`opacity`, respect `prefers-reduced-motion`, and stay within the duration scale.
- [ ] Every async action shows feedback within ~100ms (loading state, disabled control, or optimistic update).
- [ ] All images use `next/image` with explicit dimensions/aspect ratio; LCP image marked `priority` if applicable.
- [ ] Fonts loaded via `next/font`; no layout shift from font swap.
- [ ] Heavy/non-critical components are code-split via `next/dynamic`.
- [ ] Bundle analyzed for unexpected bloat; no duplicate libraries solving the same problem.
- [ ] Caching strategy (`revalidate`/`cache`) is intentional and documented for each data source.
- [ ] Metadata API used for SEO on every route; sitemap/robots present and accurate.
- [ ] Core Web Vitals targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) verified, not assumed.
- [ ] Long lists are virtualized or paginated; no unbounded client-side rendering of large collections.

This skill governs all motion, interaction feedback, and performance/optimization decisions the AI coding tool makes when building or modifying this application.
