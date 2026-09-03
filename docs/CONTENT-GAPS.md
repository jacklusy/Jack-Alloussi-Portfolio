# Content gaps — running list of deferred facts

Prioritised by impact on the 90-second recruiter journey.

Public site content under `src/content/` must not contain `{{NEEDS_INPUT}}` tokens.
Unit tests assert this. Fill gaps here first, then update typed content when values are verified.

## Deferred (not on the live site)

| Item | Notes |
| --- | --- |
| One measured result | Latency, deploy time, etc. — beyond the 15+ mobile-app release count now on site |
| Deploy time before → after | Minutes |
| Relocate notice period (weeks) | Site uses graduation-aligned relocate-from date only |
| Anabin degree recognition status | Needed for Blue Card narrative |
| IELTS band + date | Spoken language shows proficiency; cert remains in-progress |
| GPA % | Intentionally omitted (CV/LinkedIn conflict) |
| Sky Software backend year | Cert listed without issue date until known |
| AWS cert issue date | When earned — currently in-progress |
| GitHub Foundations credential URL | Optional verification link |
| www vs. apex canonical | Confirm which host is canonical in Vercel, then add the redirect in `next.config.ts` so link equity isn't split |
| Google Search Console sitemap submission | Property is verified; submit `https://jackalloussi.online/sitemap.xml` and request indexing for `/` and `/about` |
| **`NEXT_PUBLIC_SITE_URL` in Vercel's dashboard** | **Unverified.** `.env`/`.env.local` are gitignored and never reach Vercel — the correct local value has no bearing on production. Check Project Settings → Environment Variables → Production; it must read `https://jackalloussi.online`, not a `*.vercel.app` URL or unset. A production build now fails loudly (`src/lib/env.ts`) if this is misconfigured, but that only catches it *at* the next deploy — verify it directly rather than waiting. |
| Other env vars in Vercel's dashboard | Same caveat applies to `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — none of these are set by the local `.env` files in production. Confirm all are present in the dashboard. |
| `.env.example` may contain a live secret | The `RESEND_API_KEY` value in `.env.example` has the shape of a real key, not a placeholder. Confirm whether it's live; if so, rotate it in the Resend dashboard and replace it here with a placeholder. Not committed to git, so not publicly leaked, but worth cleaning up. |

## Resolved

| Item | Value |
| --- | --- |
| GitHub | https://github.com/jacklusy |
| CV PDF | `/public/pdf/CV_Jack_Alloussi.pdf` → `/pdf/CV_Jack_Alloussi.pdf` |
| Relocate-from framing | Available to relocate from October 2026 after graduation |
| GPA on site | Removed from education note |
| Unfinished personal project cards | Removed from live catalog |
| Sky Software backend `[object Object]` | Fixed issueDate ReactNode coercion; omitted placeholder date |
| Domain / canonical URL (local) | `.env` correctly reads `https://jackalloussi.online`; Google Search Console property is verified. Vercel's own dashboard value is a separate, unverified setting — see "Deferred" above. |
| Number of client applications | 15+ mobile applications released via React Native CLI and Expo — now on site in Experience and the client-platform case study |
| Personal project 1 (multi-tenant API) | Stockwell — added to the catalog with a full case study |
| Personal project 2 (mobile app) | Stockwell Mobile — added to the catalog with a full case study |
| Missing project portfolio | 11 additional case studies added from `Profile/Projects/`: Stockwell, Stockwell Mobile, PDFNexus, USNS Backend/Dashboard/Student App, Cloudix, Amman's Treasure, Master Laravel, Bidding Management System, Angular SKY |

## Portrait

Professional photograph supplied: `me.jpg` → `/public/images/jack-alloussi.jpg`.
