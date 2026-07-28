# Skill: Professional UI/UX & Design System (Next.js)

## Purpose

This skill defines how the AI coding tool must think, decide, and build user interfaces. It governs visual design, layout, spacing, typography, color, accessibility, responsiveness, and component design consistency. It does not cover code architecture (see Skill 1) or animation/performance (see Skill 3) — but all UI decisions here must remain compatible with those.

---

## 1. Mindset: Think Like a Product Designer, Not Just a Developer

Before writing any UI, the AI must reason through:

1. **Who is the user and what is their goal on this screen?** Design the simplest path to that goal.
2. **What is the visual hierarchy?** The most important element must be the most visually prominent (size, weight, contrast, position) — not everything can compete for attention.
3. **What state is this component in?** Every UI element must account for its full state matrix: default, hover, focus, active, disabled, loading, error, empty, success.
4. **Is this consistent with the rest of the product?** Reuse existing tokens, components, and patterns before inventing new ones.
5. **Does this reduce cognitive load?** Fewer decisions, clear labels, predictable placement, no unnecessary novelty.

The AI should never treat UI as "just make it work" — it must treat every screen as a deliberate design decision with a rationale.

---

## 2. Core UI/UX Principles

- **Clarity over decoration**: every visual element must serve a functional or communicative purpose. If it doesn't aid understanding or usability, remove it.
- **Consistency**: identical patterns (buttons, forms, cards, spacing) must look and behave identically everywhere in the app.
- **Feedback**: every user action must produce a visible, immediate response (state change, message, indicator).
- **Forgiveness**: destructive actions require confirmation; forms preserve input on error; undo is available where feasible.
- **Progressive disclosure**: show only what's needed now; reveal complexity (advanced settings, extra detail) on demand.
- **Recognition over recall**: label actions clearly; don't make users remember icons/meanings without cues (tooltips, labels).
- **Fitts's Law**: interactive targets must be large enough and positioned to be easy/fast to hit (min. 40–44px touch target on interactive elements).
- **Hick's Law**: minimize the number of choices presented at once; group and prioritize actions (one clear primary action per screen/section).

---

## 3. Design System Foundations

### 3.1 Spacing System

- Use an **8px base spacing scale** (with a 4px half-step for tight cases): `4, 8, 12, 16, 24, 32, 48, 64, 96px`.
- Never use arbitrary spacing values (`13px`, `27px`) — always snap to the scale.
- Define spacing as design tokens (Tailwind config / CSS variables), not hardcoded per component.
- Maintain **consistent vertical rhythm**: sections separated by larger scale steps (32–96px), internal component spacing uses smaller steps (4–24px).

### 3.2 Typography

- Define a **type scale** (modular scale, e.g., 1.25 ratio) rather than ad-hoc font sizes:
  - Example scale: `12, 14, 16 (base), 18, 20, 24, 30, 36, 48, 60px`.
- **Font pairing**: one primary sans-serif for UI/body (e.g., Inter, Geist, system-ui stack), optionally one distinct display font for large headings if the brand calls for it. Never mix more than 2 font families.
- **Line height**: body text 1.5–1.6x; headings 1.1–1.3x.
- **Font weight usage**: reserve bold/semibold (600–700) for headings and emphasis; body copy stays regular (400) or medium (500) at most.
- **Line length**: body text containers should target ~60–80 characters per line for readability; constrain with `max-width`.
- **Hierarchy via type, not just size**: combine size + weight + color/contrast + spacing to establish hierarchy — don't rely on size alone.

### 3.3 Color System

- Define a **semantic token layer**, not raw hex values used ad hoc:
  - `background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `destructive`, `success`, `warning`, `border`, `ring`.
- Each semantic color needs **light and dark mode values** from day one, even if dark mode isn't launched immediately.
- **Neutral palette** (grays) should have enough steps (9–11 shades) for backgrounds, borders, disabled states, and text hierarchy.
- **Accent/brand color** used sparingly and purposefully — primarily for primary actions, links, and key highlights, not decoration everywhere.
- **Contrast**: all text/background combinations must meet WCAG AA contrast minimums (4.5:1 for normal text, 3:1 for large text/UI components).
- Never hardcode colors directly in components — always reference design tokens/theme variables.

### 3.4 Layout & Grid

- Use a **consistent max-width container** (e.g., 1280px or 1440px) with responsive horizontal padding (16px mobile, 24–32px desktop) centering page content.
- Base layouts on a **12-column grid** concept for complex pages (dashboards, marketing pages); simple content pages can use a single constrained column.
- Maintain **consistent card/section padding** (e.g., 16px mobile, 24px desktop) across all container components.
- Group related elements with proximity and whitespace rather than borders/dividers wherever possible ("whitespace as a design tool").

### 3.5 Elevation & Depth

- Define a small set of shadow tokens (e.g., `sm, md, lg, xl`) for elevation — do not invent one-off box-shadow values per component.
- Use elevation purposefully: higher elevation = higher interaction priority (modals > dropdowns > cards > flat content).
- Prefer subtle shadows/borders over heavy skeuomorphic effects; keep the UI visually flat and modern unless the brief specifies otherwise.

### 3.6 Border Radius

- Define a consistent radius scale (e.g., `4px, 8px, 12px, 16px, full`) and apply it consistently by component type (buttons/inputs one radius tier, cards/modals another).

---

## 4. Responsive Design Rules

- **Mobile-first**: design and implement the smallest breakpoint first, then progressively enhance for larger screens.
- **Standard breakpoints** (Tailwind defaults are acceptable): `sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px`.
- Every component must be verified/considered at minimum at: mobile (375px), tablet (768px), desktop (1280px+).
- **Touch targets** on mobile: minimum 44x44px for tappable elements, adequate spacing between adjacent tap targets (min. 8px gap).
- **Navigation adapts by breakpoint**: full nav bar on desktop → hamburger/drawer or bottom nav on mobile, never a cramped shrunk desktop nav.
- **Content reflow, not just shrinking**: multi-column layouts collapse to single column on mobile; tables become cards/lists where appropriate rather than horizontally scrolling by default.
- Images and media must be responsive (`w-full h-auto` equivalents) and never cause horizontal overflow.

---

## 5. Accessibility (a11y) Rules

- **Semantic HTML first**: use correct elements (`button`, `nav`, `header`, `main`, `label`, `table`) before reaching for ARIA.
- **All interactive elements are keyboard-operable**: tab order is logical, focus is visible (never remove `outline` without a replacement focus style), and all actions reachable via mouse are reachable via keyboard.
- **Form accessibility**: every input has an associated `<label>`; validation errors are announced (`aria-describedby`, `aria-invalid`) and displayed visually near the field.
- **Images**: meaningful images require descriptive `alt` text; decorative images use empty `alt=""`.
- **Color is never the only signal**: pair color-coded states (error/success) with icons or text, not color alone.
- **Focus management**: modals/dialogs trap focus while open and return focus to the trigger element on close.
- **ARIA roles/labels** used correctly for custom components (custom dropdowns, tabs, modals) following WAI-ARIA authoring patterns.
- **Minimum contrast** (see 3.3) enforced across all text and meaningful UI elements.
- **Reduced motion**: respect `prefers-reduced-motion` for any non-essential animation (detailed further in Skill 3).

---

## 6. Component Design Standards

- **Every component has a defined state matrix**: default, hover, focus-visible, active/pressed, disabled, loading, error (where applicable), empty (where applicable).
- **Buttons**:
  - Clear hierarchy: primary (solid, high-contrast), secondary (outline/subtle), tertiary/ghost (text-only), destructive (distinct color, usually red-family).
  - Only one primary button per view/section to avoid competing calls-to-action.
  - Disabled buttons are visually distinct and non-interactive, with a tooltip/explanation if the reason isn't obvious.
- **Forms**:
  - Labels always visible (avoid placeholder-as-label anti-pattern).
  - Inline validation on blur/submit, not on every keystroke (unless real-time feedback is explicitly valuable, e.g., password strength).
  - Group related fields visually; logical tab order; sensible input types (`email`, `tel`, `number`) for correct mobile keyboards.
- **Cards**: consistent padding, radius, and shadow per the design tokens; clear content hierarchy (title > meta > body > actions).
- **Modals/Dialogs**: used sparingly for focused tasks/confirmations only, not as a dumping ground for complex flows; always dismissible via escape key, overlay click (when safe), and explicit close control.
- **Empty states**: every list/table/data view has a designed empty state (icon/illustration + message + primary action), not a blank screen.
- **Loading states**: skeleton screens or spinners matching the eventual content's layout, never a blank flash (detailed further in Skill 3).
- **Tables/data views**: support sorting/filtering affordances clearly, responsive collapse strategy defined for small screens, sensible row density and padding.

---

## 7. Visual Consistency & Design Language

- Maintain a **single source of truth for design tokens** (colors, spacing, typography, radius, shadow) — implemented via Tailwind theme config or CSS variables, never duplicated/hardcoded per component.
- Establish and reuse a small set of **UI primitives** (`Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `Tooltip`) — new UI should compose these primitives rather than creating one-off styled elements.
- **Icon usage**: one consistent icon set/library throughout the app (e.g., Lucide) at consistent stroke widths and sizes; never mix icon styles.
- **Imagery style**: consistent treatment (rounded corners, aspect ratios, filters) across all product imagery.
- Before introducing a new visual pattern, the AI should check whether an existing token/component already solves the need.

---

## 8. Modern Next.js UI Best Practices

- Use **`next/image`** for all images to get automatic optimization, responsive sizing, and lazy loading (detailed further in Skill 3, but required as a UI baseline).
- Use **`next/font`** for font loading to avoid layout shift and ensure self-hosted, performant font delivery.
- Design layouts to leverage **nested layouts (`layout.tsx`)** for shared UI chrome (nav, sidebar) instead of duplicating it per page.
- Use **CSS variables + Tailwind** (or a chosen equivalent styling system) as the single styling approach — avoid mixing multiple styling paradigms (CSS Modules + styled-components + inline styles) in the same project.
- Design with **dark mode as a first-class citizen** from the start (token-driven), not retrofitted later.
- Favor **utility-first styling with extracted design tokens** over inline arbitrary values (`p-[13px]` should be rare/justified, not default).

---

## 9. Design Review Checklist (apply before considering any UI "done")

- [ ] Visual hierarchy clearly guides the eye to the primary action/content.
- [ ] Spacing follows the defined scale; no arbitrary pixel values.
- [ ] Typography follows the type scale and uses at most 2 font families.
- [ ] All colors reference semantic design tokens; contrast meets WCAG AA.
- [ ] Layout is verified at mobile, tablet, and desktop breakpoints.
- [ ] All interactive elements have visible focus states and are keyboard-accessible.
- [ ] Every component's full state matrix (loading/empty/error/disabled) is designed, not just the happy path.
- [ ] No more than one primary call-to-action competes per view.
- [ ] Consistent with existing components/patterns already in the design system.
- [ ] Dark mode values exist for any new token/color introduced.

This skill governs all visual and interaction design decisions the AI coding tool makes when building or modifying UI in this project.
