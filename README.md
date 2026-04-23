# Asuom Health News

Production-ready health blogging website built with Next.js 16.2.4, the App Router, TypeScript, Supabase, and Vercel deployment in mind.

## Stack

- Next.js 16.2.4
- React 19
- TypeScript
- Supabase Postgres
- Vercel deployment target
- ESLint with `eslint-config-next`

## What is included

- Responsive homepage, article page, category page, info pages, donation page
- Admin login with signed cookie session
- Admin dashboard for creating posts, categories, and pages
- API routes for newsletter signups, contact submissions, donations, auth, and content publishing
- Supabase SQL schema under [0001_init.sql](C:/Users/samam/Desktop/DEVELOPER/AHN/supabase/migrations/0001_init.sql) and [0002_admin_crud_support.sql](C:/Users/samam/Desktop/DEVELOPER/AHN/supabase/migrations/0002_admin_crud_support.sql)
- Demo seed content fallback so the app still runs before Supabase is connected

## Local setup

1. Install Node.js 20 or newer.
2. Open the project in your terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Fill in your Supabase and admin values.
6. Run `npm run dev`.
7. Open [http://localhost:3000](http://localhost:3000).

For code quality checks on Next.js 16, run `npm run lint` and `npm run build`.

## Environment variables

Use the values in `.env.example`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

## Supabase setup for a beginner

1. Create a Supabase account at [supabase.com](https://supabase.com).
2. Create a new project and wait for the database to finish provisioning.
3. In the Supabase dashboard, open the SQL Editor.
4. If this is a brand-new database, run `supabase/migrations/0001_init.sql`.
5. Then run `supabase/migrations/0002_admin_crud_support.sql`.
6. Open `Project Settings` -> `API`.
7. Copy:
   - `Project URL` into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`
8. Put those values in `.env.local`.

If you already created your Supabase tables earlier, you only need to run [0002_admin_crud_support.sql](C:/Users/samam/Desktop/DEVELOPER/AHN/supabase/migrations/0002_admin_crud_support.sql) to add the newer admin CRUD improvements.

## Vercel deployment for a beginner

1. Create a GitHub repository and push this project.
2. Create a Vercel account and connect it to GitHub.
3. Import the repository into Vercel.
4. In the Vercel project settings, add every variable from `.env.example`.
5. Set `NEXT_PUBLIC_SITE_URL` to your real Vercel domain, for example `https://your-project.vercel.app`.
6. Trigger a deployment.
7. After deploy finishes, open `/api/health` on your live domain to confirm the app is up.

## GitHub workflow

1. Initialize git if needed with `git init`.
2. Add files with `git add .`.
3. Commit with `git commit -m "Initial Next.js newsroom build"`.
4. Create a repo on GitHub.
5. Connect your local repo:
   - `git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git`
6. Push:
   - `git branch -M main`
   - `git push -u origin main`

## Admin access

- Visit `/admin/login`
- Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- The dashboard uses cookie-based auth

## Important note

Without Supabase environment variables, the website still renders using built-in demo data, but dashboard save actions remain disabled. That makes setup safer while you are still learning the deployment flow.
