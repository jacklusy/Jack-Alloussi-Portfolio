# Design Plan — Jack Alloussi Portfolio

## Pass 1 — Direction

### Colour (client-specified palette)

**Light (60 / 30 / 10)**

| Role | Hex | Token |
| --- | --- | --- |
| Dominant | `#F8F9FA` | `--color-bg` |
| Secondary | `#212529` | `--color-text` |
| Accent | `#4361EE` Electric Indigo | `--color-brand` |
| Muted | `#E9ECEF` | `--color-surface-sunken` |

**Dark**

| Role | Hex | Token |
| --- | --- | --- |
| Dominant | `#0B0C10` Deep Midnight | `--color-bg` |
| Secondary | `#C5C6C7` Ice Blue | `--color-text` |
| Accent | `#66FCF1` Vibrant Teal | `--color-brand` |
| Muted | `#1F2833` Slate Gray | `--color-surface` |

### Dynamic atmosphere

Hero/section backdrops compose: fluid ambient glow, pointer-driven parallax geometry, interactive particle mesh, and scroll-drawn SVG paths. All disabled under `prefers-reduced-motion`.

### Type


| Role | Face | Why |
| --- | --- | --- |
| Display | **Syne** (600–700) | Geometric, slightly awkward proportions — characterful without being a display serif cliché |
| Body | **IBM Plex Sans** (400–500) | Engineered for dense technical reading; excellent italics and x-height at 16–18px |
| Mono | **IBM Plex Mono** (400–500) | Same family as body; justified for metadata, tech tags, status labels |

Maximum three families, six weights. Avoid Inter / generic geometric-only pairings.

### Layout concept

The site reads like a **specification sheet for a candidate**: clear strata (hero → evidence → credentials → contact), a monospace **status rail** encoding work-authorisation facts recruiters filter on, and case-study pages structured like ADRs (context → decision → tradeoff). Whitespace is structural. No particle fields, no floating code rain.

#### Home wireframe (ASCII)

```
┌────────────────────────────────────────────────────────────┐
│ [Skip]  Jack Alloussi          Projects  Exp  Contact  CV  │
├──────────┬─────────────────────────────────────────────────┤
│ STATUS   │  JACK ALLOUSSI                                  │
│ AVAILABLE│  Software Engineer                              │
│ AMMAN JO │  TypeScript · Node · NestJS · React · RN        │
│ EU BLUE  │                                                 │
│ CARD OK  │  [View projects]  [Download CV]  GitHub LinkedIn│
│ GRAD     │                                                 │
│ OCT 2026 │  ▸ scroll                                       │
├──────────┴─────────────────────────────────────────────────┤
│ About (prose 68ch)              │  [portrait]              │
├────────────────────────────────────────────────────────────┤
│ Skills — grouped typographic tags                          │
├────────────────────────────────────────────────────────────┤
│ Featured projects — 3 equal-height cards                   │
├────────────────────────────────────────────────────────────┤
│ Experience spine (preview) → link to /experience           │
├────────────────────────────────────────────────────────────┤
│ Education + certs (compact)                                │
├────────────────────────────────────────────────────────────┤
│ Contact CTA                                                │
│ Footer                                                     │
└────────────────────────────────────────────────────────────┘
```

#### Project detail wireframe

```
┌────────────────────────────────────────────────────────────┐
│ Breadcrumb · Title · Summary · Stack chips                 │
├──────────────────────────────┬─────────────────────────────┤
│ Article (68ch)               │ Sticky TOC                  │
│ Context / Problem / Approach │ 01 Context                  │
│ [Architecture SVG]           │ 02 Problem …                │
│ Decisions (pull quotes)      │                             │
│ Outcomes / Retrospective     │                             │
│ Prev ← → Next · Contact CTA  │                             │
└──────────────────────────────┴─────────────────────────────┘
```

### Signature element

**The Status Rail** — a monospace vertical (desktop) / horizontal (mobile) panel of machine-readable facts: availability, location, EU Blue Card eligibility, graduation date. It is the visual thesis and the recruiter filter answer in one. Lives in the hero; echoed compactly in the sticky header when scrolled.

---

## Pass 2 — Critique against §2.2 / §2.3

| Check | Result |
| --- | --- |
| Warm cream `#F4F1EA` + serif + terracotta? | **No.** Cool `#EEF1F4`, Syne + Plex, deep teal `#0A5C63`. |
| Near-black + acid green / vermilion? | **No.** Light-first; dark mode is lifted slate; accent is muted teal. |
| Broadsheet (hairline rules, zero radius, dense columns)? | **No.** Soft 8–12px radii, restrained borders, open section rhythm. |
| Generic “AI portfolio” arrival? | **Revised.** First draft used a large stat strip (“2 yrs · N apps”) — that is the template answer. Removed stats-as-hero; status rail carries only visa/availability facts. Second draft considered a layer-diagram hero animation — deferred as decoration risk; status rail is functional, not ornamental. |

**What changed after critique**

1. Dropped hero metric counters (unverifiable + template).
2. Locked accent to one deep teal; removed a second “signal” cyan.
3. Confirmed Status Rail as the sole signature — everything else stays quiet.
4. Display face switched from a serif trial (too close to cream-portfolio cluster) to Syne.

**Aesthetic risk taken:** Leading with a monospace status panel instead of a large photographic hero or gradient blob. Justified: the audience filters on work authorisation first; making that the brand is honest and distinctive.
