# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project overview

LEXPAT Connect is a Belgian B2B/B2C platform connecting Belgian employers with international workers in shortage occupations ("métiers en pénurie"), built and operated by Candice, an immigration lawyer at cabinet LEXPAT (Brussels). The platform handles two distinct user journeys — employer and worker — plus a legal accompaniment layer handled separately by the LEXPAT cabinet.

---

## Commands

```bash
npm run dev          # Next.js dev server on http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint via next lint
npm run email        # react-email preview server on http://localhost:3001 (emails/ dir)
npm run send:visibility          # Send worker profile visibility emails (Resend)
npm run send:visibility:reminder # Same with --reminder flag
```

No test runner is configured.

---

## Required environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY          # Claude Haiku for AI generation (email, LinkedIn post, comment replies, Coach IA)
OPENAI_API_KEY             # GPT-4o-mini fallback for AI generation + GPT-image-1 images
RESEND_API_KEY             # Transactional emails
CONTACT_EMAIL              # Admin email (also grants admin access)
NEXT_PUBLIC_GA_MEASUREMENT_ID   # Google Analytics 4 (optional)
LINKEDIN_CLIENT_ID         # LinkedIn OAuth
LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URI
LINKEDIN_API_VERSION       # LinkedIn API version YYYYMM (ex: 202506). If absent, code uses hardcoded fallback 202506.
CLAUDE_MODEL               # Override default "claude-haiku-4-5-20251001"
OPENAI_MODEL               # Override default "gpt-4o-mini"
NEXT_PUBLIC_SITE_URL       # Full URL of the site (ex: https://lexpat-connect.be) — used for LinkedIn OAuth redirect
```

### LinkedIn API version

`lib/linkedin-marketing.js` exports `LINKEDIN_API_VERSION`. The value is sanitized from `LINKEDIN_API_VERSION` env var:
- All non-digit characters are stripped first (handles quotes, spaces, etc.)
- 8-digit value (YYYYMMDD) → truncated to 6 digits (YYYYMM)
- 6-digit value → used as-is
- Anything else → falls back to `"202506"`

**Never set `LINKEDIN_API_VERSION` to a YYYYMMDD format** — LinkedIn only accepts YYYYMM.

---

## Architecture

### Routing & i18n

Next.js 15 App Router. French is the default locale at `/`; English lives under `/en/` (e.g. `/en/simulateur-eligibilite`). There is **no middleware-based i18n** — locale is detected at runtime from the pathname using `lib/i18n.js`:

```js
detectLocaleFromPathname(pathname)  // → "fr" | "en"
localizeHref(href, locale)          // prepends /en if needed
switchLocalePath(pathname, target)  // switches between FR↔EN for the language toggle
```

`siteCopy` in `lib/i18n.js` holds all UI strings for both languages. Shared components receive a `locale` prop and select from a `copy` object internally (see `components/Sections.js` → `HeroPremium`).

### Supabase client pattern

Two clients, never mix them:

- `lib/supabase/client.js` → `getSupabaseBrowserClient()` — browser singleton using anon key, persists session, for use in Client Components only.
- `lib/supabase/server.js` → `getServiceClient()` — service role client (bypasses RLS), server/API routes only. Also exports `getUserFromRequest(request)` which extracts and validates the Bearer token from the `Authorization` header.

All API routes follow this pattern:
```js
const { user } = await getUserFromRequest(request);  // throws if unauthenticated
const supabase = getServiceClient();                   // service client for DB writes
```

### Admin authentication

Admin access is checked against a hardcoded email list (`ADMIN_EMAILS`) plus a `user_roles` table:
```js
const ADMIN_EMAILS = [process.env.CONTACT_EMAIL, "contact@lexpat-connect.be", "lexpat@lexpat.be"]
```
The function `assertAdmin(supabase, user)` is duplicated in each admin API route — it returns `true` or throws `"Accès administrateur requis."`. HTTP 403 is returned when that specific error message is thrown; otherwise 500.

The admin dashboard is at `/admin` (FR) and `/en/admin` (EN) — both render `components/AdminDashboard.js`, a large tabbed component managing its own state entirely in `useState`.

### AI generation pattern

Both `lib/email-generator.js` and `lib/linkedin-post-generator.js` use the same three-tier fallback:
1. **Claude** (Anthropic API, `claude-haiku-4-5-20251001`) — primary
2. **OpenAI** (GPT-4o-mini) — fallback if Claude fails or `ANTHROPIC_API_KEY` is absent
3. **Local template** — always available, no API calls

All AI generation returns `{ ..., mode: "claude" | "openai" | "fallback" }`. Email generation returns `{ subject, body, mode }`; LinkedIn returns `{ text, mode }`.

The `SITE_CONTEXT` constant in `email-generator.js` contains the authoritative description of the platform, legal concepts (permis unique, test du marché, listes pénurie), and key URLs. Keep it up to date when the platform evolves.

### Shortage jobs data

Two files form the backbone of the eligibility simulator and métiers pages:

- `lib/shortageJobs2026.js` — full shortage jobs list by region (Brussels/Actiris, Wallonia/Forem, Flanders/VDAB), structured as `[{ id, label, intro, groups: [{ title, jobs[] }] }]`.
- `lib/flandreKnelpuntberoepen.js` — two Sets:
  - `FLANDRE_MB_21`: 31 VDAB job title strings mapping to the 21 articles of the AM du 1er décembre 2025 (MB 8/12/2025, réf. 2025009222). These get **full exemption** from the labour market test.
  - `FLANDRE_VDAB_227`: 227 VDAB knelpuntberoepen requiring a 9-week market test.
  - **Critical**: job title strings in these Sets must match exactly the strings used in `shortageJobs2026.js` (Flandre section) for the simulator to function correctly.

### Email system

Transactional emails use **Resend** + **react-email** (components in `emails/`). Preview with `npm run email`. Bulk/campaign emails are orchestrated via `app/api/admin/campaigns/` and tracked in a `email_campaigns` Supabase table. The unsubscribe flow lives at `app/api/unsubscribe/` and `lib/email-unsubscribe.js`.

### Component conventions

- `components/Sections.js` — all major reusable page sections (HeroPremium, HowItWorksPremium, SimulateurTeaser, etc.). Sections accept a `locale` prop and derive copy from a local `copy` object.
- Inline styles use shared style objects (`btn`, `card`, `labelStyle`, `inputStyle`) defined at the top of the relevant component file — not Tailwind classes. Tailwind is present but used minimally.
- `components/SiteChrome.js` — header + footer wrapper. Navigation items and dropdown menus are defined here. The `highlight: true` flag on a nav item triggers the accent-styled CTA button.
- `components/AuthProvider.js` — React context wrapping the entire app, exposes `{ user, session, loading, signOut }` via `useAuth()`.
- `components/AdminDashboard.js` — single large client component (~5200+ lines). Top-level tab IDs and labels:
  - `overview` — Vue d'ensemble
  - `coach` — Coach IA (profile analysis + KPI diagnostics)
  - `analytics` — Analyse trafic
  - `prospection` — Emailing & Contacts (contacts list + emailing campaigns + email individuel with contact dropdown)
  - `promo` — Kit comm (copy-paste messages, QR codes, tracked links)
  - `linkedin` — Posts LinkedIn (post generation + publication + comment reply assistant)
  - `security` — Sécurité données
  - `operations` — Opérationnel
  - `history` — Historique

  The `prospection` tab has sub-tabs (`contacts` | `emailing`) managed by `prospectionTab` state. The `linkedin` tab includes a comment reply assistant: paste a received comment → AI generates a suggested reply → user copies to LinkedIn manually (LinkedIn API does not allow reading comments without restricted `r_member_social` scope).

  AI email/post generation state lives in `aiEmailPrompt`, `aiEmailResult`, `aiEmailHistory` etc. History stored in localStorage under `lexpat_email_drafts` (max 30 entries). LinkedIn post history in `lexpat_linkedin_posts`.

  Default LinkedIn post image is loaded from `/hero-world-map.webp` via a `useEffect` on mount (fetches → converts to base64).

### AI routes added (2025-06)

- `app/api/admin/linkedin/suggest-reply/route.js` — POST `{ commentText, authorName }` → returns `{ suggestion, mode }`. Used by the comment reply assistant. Requires `ANTHROPIC_API_KEY` for smart replies; falls back to a generic template.
- `app/api/admin/coach/strategy/route.js` — GET, fetches worker profiles and asks Claude/OpenAI for 4 employer targeting recommendations. JSON parsing is wrapped in try/catch with markdown-backtick stripping to handle inconsistent AI output format.
- `app/api/admin/linkedin/comments/route.js` — GET `?postId=xxx` — attempts to fetch comments for a specific post URN. **Currently non-functional** due to LinkedIn API scope restrictions (`r_member_social` required, not available without LinkedIn app approval). Kept for future use.
- `app/api/admin/linkedin/comments/reply/route.js` — POST, posts a reply to a LinkedIn comment. Also currently restricted by the same LinkedIn scope issue.

### Database migrations

Sequential SQL files in `supabase/` (001–010). Apply manually in Supabase dashboard or via `supabase db push`. No migration runner is configured in package.json.

### Redirects

Permanent redirects defined in `next.config.mjs`:
- `/liste-metiers-penurie` → `/metiers-en-penurie`
- `/liste-metiers-en-penurie` → `/metiers-en-penurie`
- `/accompagnement-juridique` → `/permis-unique`
- `/en/legal-support` → `/en/single-permit`

### Deployment

Vercel (primary). A `netlify.toml` exists but is not the active deployment target. `@vercel/analytics` is loaded through `ConsentAwareAnalytics` only after cookie consent.

---

## Security

### Secret key discipline

`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `LINKEDIN_CLIENT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are **server-only**. They must never appear in `NEXT_PUBLIC_*` variables, client components, or be returned in API responses. Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentionally client-exposed.

### API route authentication flow

Every API route that touches user data must start with:
```js
const { user } = await getUserFromRequest(request);  // throws 401 if token missing/invalid
```
Omitting this call leaves the route completely unauthenticated.

### Admin route inconsistency (known risk)

There are two different `assertAdmin` implementations across the codebase:
- Most admin routes use the `assertAdmin(supabase, user)` pattern that **throws** on failure (HTTP 403 is inferred from the error message string).
- `app/api/admin/overview/route.js` uses `assertAdminAccess(supabase, user)` that **returns a boolean** and must be checked manually.

When adding new admin routes, use the throwing pattern and return 403 explicitly on the caught error. Do not silently fall through.

### Supabase RLS

The service role client (`getServiceClient()`) bypasses Row-Level Security entirely — use it only in API routes after the user has been authenticated and authorised. Never pass the service client to a function that could return data to an arbitrary user. The browser client (`getSupabaseBrowserClient()`) respects RLS and is the correct choice for data fetched directly from client components.

The `test_feedback` table is explicitly flagged in `CHECKLIST-RGPD-LEXPAT-CONNECT.md` as requiring RLS verification.

### Cookie consent gate

GA4 and Vercel Analytics are loaded exclusively by `components/ConsentAwareAnalytics.js`, which checks consent before injecting any script. Consent state is stored in two places (cookie `lexpat_cookie_consent` + localStorage key `lexpat-cookie-consent`) with a 180-day max age — `lib/analytics-consent.js` is the single source of truth for reading it. Do not load analytics scripts anywhere else.

### Form metadata logging

Server-side form handlers capture and include in notification emails: submission timestamp, public IP, user-agent, referer, and browser language. This is documented as intentional for anti-abuse qualification. If new forms are added and this metadata is stored (not just emailed), the RGPD register must be updated.

### RGPD compliance status

`CHECKLIST-RGPD-LEXPAT-CONNECT.md` (last updated 2026-04-07) is the internal compliance tracker. As of that date, all checklist items were unchecked. Priority items flagged as urgent: RLS on `test_feedback`, privacy policy FR+EN publication, Google Workspace in RGPD register, and operational email addresses.

### Email infrastructure security

Three records are required for the sending domain:
- **DKIM** — must be active for the sending domain via Resend
- **SPF** — `v=spf1 include:amazonses.com ~all` needed on the `send` subdomain in OVH
- **DMARC** — must be configured

These are not enforced in code — they are DNS-level settings managed in OVH.

### Sensitive pages in production

`/retours-test` (and `/en/retours-test`) are development feedback pages with no access control, currently reachable by anyone. They should be removed or protected behind admin auth before any public launch.

---

## Known technical debt

- `/retours-test` is a dev test page accessible in production — should be protected or removed.
- `/returning-to-belgium-after-leaving` is an English-slug route in the French tree (and `/en/revenir-en-belgique-apres-un-retour` is a French-slug in the English tree). Both need redirects.
- The `assertAdmin` function is copy-pasted into every admin API route — candidates for extraction to a shared middleware or utility.
- `components/AdminDashboard.js` manages extensive state inline; if it grows further, consider splitting tabs into separate lazy-loaded components.
- Navigation label "Mon recrutement est-il possible ?" (37 chars) overflows on medium screens — consider shortening to "Simulateur".
- LinkedIn comment reading (`app/api/admin/linkedin/comments/route.js`) is non-functional due to missing `r_member_social` scope. The feature has been replaced by a manual copy-paste + AI suggestion flow. The route is kept for when/if LinkedIn grants the scope.
- `Coach IA` tab (`/api/admin/coach/strategy`) requires `ANTHROPIC_API_KEY` for useful output. Without it, falls back to a single static recommendation.
- `app/api/admin/linkedin/suggest-reply` also requires `ANTHROPIC_API_KEY` — without it the same generic fallback text is returned for every comment.
