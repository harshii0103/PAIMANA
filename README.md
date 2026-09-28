# PAIMANA Dashboard — Frontend

AI-powered Infrastructure Project Intelligence & Early Warning Platform.
This package contains the Main Dashboard implementation only (Explorer,
Analytics, Alerts, and Project Details are wired as navigation placeholders).

## Stack
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Recharts ·
TanStack Query · Framer Motion · Lucide React · Zod (ready for schema
validation once real API responses are wired in)

## Getting started
This environment has no network access, so dependencies were not installed
or built here. On your machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (redirects to /dashboard).

## Architecture notes
- `services/mockData.ts` — clearly labeled mock data, matching the shape of
  the future FastAPI responses (/projects, /risk, /alerts). No ML values,
  accuracy figures, or risk formulas are invented here — scores are
  illustrative placeholders for layout only.
- `services/api.ts` — the ONLY place that will change when the real FastAPI
  backend is ready. Swap the function bodies for real `fetch` calls against
  `/projects`, `/risk`, `/alerts`, etc. Components and hooks never change.
- `hooks/` — TanStack Query hooks wrapping the service layer (loading /
  error / caching handled here, not in components).
- `types/` — mirrors the PAIMANA Project, Prediction, and Alert DB tables
  exactly as defined in the solution document.
- Risk color meaning (`lib/utils.ts` → `riskTokens`) is defined once and
  reused everywhere — charts, badges, matrix dots — so High/Medium/Low
  never means something different in two places.

## Visual hierarchy (as approved)
- **Tier 1 — Portfolio Pulse**: status strip + risk distribution donut +
  Cost×Delay risk matrix. Strongest typography, only entrance animation
  with stagger.
- **Tier 2 — Needs Attention**: High-Risk Projects (wider) + Early
  Warnings, capped at 6 rows each, linking out to Explorer/Alerts.
- **Tier 3 — Portfolio Patterns**: Sector-wise Risk + Progress vs Risk,
  visually muted, smaller chart height, no stagger.

## Build verification
This container has no network egress (`npm install` fails with `403` against
the npm registry), so `npm run build`/`tsc` could not be executed here.
Verification instead relied on an automated sweep of every `.ts`/`.tsx` file
for brace/paren/bracket balance, unresolved `@/` import paths, and every
`Link` href (static and templated) against the actual `app/` route tree —
all clean as of this version. **Please run `npm install && npm run build`
locally as your first step** and report anything that surfaces; it hasn't
been compiled end-to-end.

## Not yet implemented
Project Explorer, Analytics, Early Warnings (full table), Project Details,
and the AI Assistant are placeholder routes only, per the current scope.
