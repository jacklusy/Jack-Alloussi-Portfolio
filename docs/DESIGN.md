# Design Plan — Jack Alloussi Portfolio

## Direction (premium redesign)

**Visual thesis:** A specification sheet for a backend-leaning engineer — elevated to a dark-first, senior product UI. Contrast and CTA language borrow from enterprise CSC VR design principles (ink primary, blue accent, AA text pairs) without adopting CSC branding.

### Colour

**Rules**

- Primary CTA uses **ink** (`--color-cta`), not accent blue — black on light / near-white on dark.
- Blue (`--color-brand`) is for links, focus rings, system labels, and optional accent fills.
- Never place light text on light surfaces or washed glass panels; elevated surfaces are solid tokens.
- Yellow/warn fills only — never yellow body text.

**Light**

| Role | Hex | Token |
| --- | --- | --- |
| Page | `#FFFFFF` | `--color-bg` |
| Elevated | `#F8F9FB` | `--color-surface` |
| Text | `#0A0A0A` | `--color-text` |
| Muted | `#5A6470` | `--color-text-muted` |
| CTA | `#0A0A0A` on `#FAFAFA` | `--color-cta` / `--color-cta-fg` |
| Accent | `#1B5BB5` | `--color-brand` |

**Dark (default)**

| Role | Hex | Token |
| --- | --- | --- |
| Page | `#0B0D10` | `--color-bg` |
| Elevated | `#14181E` / `#1A1F27` | `--color-surface` / raised |
| Text | `#F4F6F8` | `--color-text` |
| Muted | `#9AA3AF` | `--color-text-muted` |
| CTA | `#FAFAFA` on `#0A0A0A` | `--color-cta` / `--color-cta-fg` |
| Accent | `#3D82E6` | `--color-brand` |

Theme defaults to **dark** when no `localStorage` preference exists. Manual toggle persists.

### Type

| Role | Face | Use |
| --- | --- | --- |
| Display | Syne 600–700 | Hero / page titles |
| Body | IBM Plex Sans 400–500 | Prose and UI |
| Mono | IBM Plex Mono 400–500 | System labels, tags, meta |

### Layout language

- System labels: uppercase mono (`SYSTEM.*` style eyebrows)
- Hero: status pill + large display + dual CTAs + side meta panel (LOC / VISA / GRAD)
- Skills: three-column technology matrix (no proficiency ranks)
- Projects: equal-height cards, case-study footer actions
- Case studies: sticky TOC + numbered narrative blocks
- Closing CTA: large statement + email

### Signature

**Status meta panel** — machine-readable availability and work-authorisation facts above the fold.

### Atmosphere

Ambient glow + subtle grid; parallax / particle mesh only on fine pointers. All non-essential motion respects `prefers-reduced-motion`.
