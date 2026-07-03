# Asuom Health News — Deployment Guide

A Next.js 16 health news site backed by Supabase (Postgres + file storage). This guide takes you from zero to live.

---

## Prerequisites

- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- A **Supabase** account (free tier works) — sign up at [supabase.com](https://supabase.com)
- A **Vercel** account (free tier works) — sign up at [vercel.com](https://vercel.com)
- **Git** installed

---

## 1. Set Up Supabase

1. Create a new Supabase project. Pick any region; note the **project URL** and **anon key** shown on the project home page.
2. Go to **Project Settings > API** and copy the **service_role key** (keep this secret).
3. Open the **SQL Editor** in the Supabase dashboard and run each migration file in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_admin_crud_support.sql`
   - `supabase/migrations/0003_theme_settings.sql`
   - `supabase/migrations/0004_site_images.sql`
   - `supabase/migrations/0005_site_full_content.sql`
   - `supabase/migrations/0006_site_videos.sql`
   - `supabase/migrations/0007_image_display_settings.sql`
   - `supabase/migrations/0008_post_gallery_images.sql`
   - `supabase/migrations/0009_video_featured_rank.sql`
   - `supabase/migrations/0010_settings_hero_panel_mode.sql`
   - `supabase/migrations/0011_site_visits.sql`
4. **(Optional)** To load demo content, paste the contents of `supabase/seed.sql` into the SQL Editor and run it.

---

## 2. Configure Environment Variables

Create a file called `.env.local` in the project root with these values:

```env
# Supabase (from your project dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin login credentials (change these!)
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password

# Session signing secret (any random string, 32+ characters)
SESSION_SECRET=replace-with-a-long-random-string

# Your live URL (update after deploying)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

> **Security note:** Never commit `.env.local` — it is already in `.gitignore`.

---

## 3. Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. If you loaded the seed data, you should see articles, categories, and videos. The admin panel is at `/admin/login`.

---

## 4. Deploy to Vercel

1. Push your code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Vercel auto-detects Next.js — no build settings to change.
4. Add the same environment variables from Step 2 in **Settings > Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (e.g. `https://asuom-health-news.vercel.app`).
5. Click **Deploy**.

---

## 5. Load Demo Data (Alternative Method)

If you skipped the SQL seed in Step 1, you can load demo data through the admin panel instead:

1. Go to `https://your-domain.vercel.app/admin/login`
2. Sign in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
3. Use the **Seed** button in the admin dashboard — this calls the `/api/admin/seed` endpoint and populates categories, articles, videos, pages, donations, and site settings.

---

## 6. Supabase Storage (for image uploads)

The admin panel supports uploading images. For this to work:

1. In Supabase, go to **Storage** and create a bucket (e.g. `images`).
2. Set the bucket's policy to allow public reads (so images display on the site) and authenticated writes.

---

## Quick Reference

| Task | Command / URL |
|---|---|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Run production build locally | `npm run build && npm start` |
| Lint | `npm run lint` |
| Admin panel | `/admin/login` |
| Health check endpoint | `/api/health` |

---

## Troubleshooting

- **"Supabase is not configured"** — your `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing or empty.
- **Admin login fails** — double-check `ADMIN_EMAIL` and `ADMIN_PASSWORD` match what you set in your environment variables.
- **Images not loading** — make sure your Supabase storage bucket exists and has a public read policy.
- **Build errors on Vercel** — confirm all environment variables are set in the Vercel dashboard (they don't carry over from `.env.local`).
