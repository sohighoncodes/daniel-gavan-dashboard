# Daniel Gavan Dashboard

Free-first dashboard stack:

- Next.js app hosted on Vercel or Netlify
- Supabase Free for Postgres, auth-ready storage, and dashboard reads
- Server-only sync jobs for HubSpot, MYOB, Keap, and Monday

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and set your Supabase values.

3. Start the app:

   ```bash
   pnpm dev
   ```

## Supabase

The starter migration creates:

- `integration_sources`
- `sync_runs`
- `source_records`
- `dashboard_metrics`

Run the migration after linking the Supabase project:

```bash
pnpm supabase:init
pnpm supabase:link
pnpm supabase db push
```

## Ingestion Plan

Each app connector should run on the server only:

- Pull records from the source API.
- Save source-shaped JSON to `source_records`.
- Record every execution in `sync_runs`.
- Transform raw records into reporting tables or metrics.

Do not put private API keys, OAuth secrets, refresh tokens, or database passwords in browser code.
