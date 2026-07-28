# Design Plan — Jack Alloussi Portfolio

## Direction (premium redesign)

**Visual thesis:** A specification sheet for a backend-leaning engineer — elevated to a dark-first, senior product UI. Inspired by premium portfolio structure (hero meta panel, uniform cards, matrix skills, case-study TOC) without copying reference copy, fake metrics, or locations.

### Colour

**Light (60 / 30 / 10)**

| Role | Hex | Token |
| --- | --- | --- |
| Dominant | `#F8F9FA` | `--color-bg` |
| Secondary | `#212529` | `--color-text` |
| Accent | `#4361EE` Electric Indigo | `--color-brand` |
| Muted | `#E9ECEF` | `--color-surface-sunken` |

**Dark (default)**

| Role | Hex | Token |
| --- | --- | --- |
| Dominant | `#0B0C10` Deep Midnight | `--color-bg` |
| Secondary | `#C5C6C7` Ice Blue | `--color-text` |
| Accent | `#66FCF1` Vibrant Teal | `--color-brand` |
| Muted | `#1F2833` Slate Gray | `--color-surface` |

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

**Status meta panel** — machine-readable availability and work-authorisation facts above the fold (evolved from the Status Rail).

### Atmosphere

Ambient glow + subtle grid; parallax / particle mesh only on fine pointers. All non-essential motion respects `prefers-reduced-motion`.
