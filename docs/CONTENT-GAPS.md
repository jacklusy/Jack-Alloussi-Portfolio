# Content gaps — running list of deferred facts

Prioritised by impact on the 90-second recruiter journey.

Public site content under `src/content/` must not contain `{{NEEDS_INPUT}}` tokens.
Unit tests assert this. Fill gaps here first, then update typed content when values are verified.

## Deferred (not on the live site)

| Item | Notes |
| --- | --- |
| Number of client applications | Experience + case study — from Jira / team count |
| Number of production apps | Experience + case study — verifiable ops count |
| One measured result | Latency, deploy time, etc. |
| Deploy time before → after | Minutes |
| Personal project 1 (multi-tenant API) | Name, timeframe, live/repo URLs, coverage % — removed from catalog until ready |
| Personal project 2 (mobile app) | Name, timeframe, store/repo URLs — removed from catalog until ready |
| Relocate notice period (weeks) | Site uses graduation-aligned relocate-from date only |
| Anabin degree recognition status | Needed for Blue Card narrative |
| IELTS band + date | Spoken language shows proficiency; cert remains in-progress |
| GPA % | Intentionally omitted (CV/LinkedIn conflict) |
| Sky Software backend year | Cert listed without issue date until known |
| Domain / canonical URL | Buy `jackalloussi.dev` (or `.com`); set Vercel custom domain + `NEXT_PUBLIC_SITE_URL`. Code already reads the env in `siteConfig` — no hard-coded Vercel URL in source. Current production env still points at `jack-alloussi-portfolio.vercel.app`. |
| AWS cert issue date | When earned — currently in-progress |
| GitHub Foundations credential URL | Optional verification link |

## Resolved

| Item | Value |
| --- | --- |
| GitHub | https://github.com/jacklusy |
| CV PDF | `/public/pdf/CV_Jack_Alloussi.pdf` → `/pdf/CV_Jack_Alloussi.pdf` |
| Relocate-from framing | Available to relocate from October 2026 after graduation |
| GPA on site | Removed from education note |
| Unfinished personal project cards | Removed from live catalog |
| Sky Software backend `[object Object]` | Fixed issueDate ReactNode coercion; omitted placeholder date |

## Portrait

Professional photograph supplied: `me.jpg` → `/public/images/jack-alloussi.jpg`.
