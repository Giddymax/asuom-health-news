create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Asuom Health News',
  tagline text not null default 'Your Health Is Our Priority',
  featured_topic text not null default 'Community-first health reporting for Eastern Region and beyond.',
  mission text not null default 'We publish practical, trusted health reporting for families, health workers, and local leaders across Ghana.',
  contact_email text not null default 'info@asuomhealthnews.com',
  ticker_items jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  color text not null,
  hero_title text not null,
  hero_description text not null,
  hero_image_path text not null,
  stats_label text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  author_name text not null,
  published_at timestamptz not null default now(),
  read_time_label text not null default '5 min read',
  cover_image_path text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  featured_rank integer not null default 0,
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  hero_image_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  thumbnail_path text not null,
  duration_label text not null,
  video_url text not null,
  category_slug text not null references categories(slug) on update cascade on delete cascade,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists donation_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kicker text not null,
  title text not null,
  description text not null,
  raised_amount numeric(12,2) not null default 0,
  goal_amount numeric(12,2) not null default 0,
  payment_label text not null,
  payment_number text not null,
  payment_link text,
  image_path text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  location text not null,
  amount numeric(12,2) not null,
  payment_method text not null,
  phone text not null,
  email text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists donation_campaigns_single_active_idx
  on donation_campaigns ((is_active))
  where is_active = true;

create index if not exists posts_category_id_idx on posts (category_id);
create index if not exists posts_status_published_at_idx on posts (status, published_at desc);
create index if not exists videos_category_slug_idx on videos (category_slug);
create index if not exists videos_published_at_idx on videos (published_at desc);

drop trigger if exists set_site_settings_updated_at on site_settings;
create trigger set_site_settings_updated_at
before update on site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on categories;
create trigger set_categories_updated_at
before update on categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on posts;
create trigger set_posts_updated_at
before update on posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_pages_updated_at on pages;
create trigger set_pages_updated_at
before update on pages
for each row
execute function public.set_updated_at();

drop trigger if exists set_videos_updated_at on videos;
create trigger set_videos_updated_at
before update on videos
for each row
execute function public.set_updated_at();

drop trigger if exists set_donation_campaigns_updated_at on donation_campaigns;
create trigger set_donation_campaigns_updated_at
before update on donation_campaigns
for each row
execute function public.set_updated_at();

alter table site_settings enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
alter table pages enable row level security;
alter table videos enable row level security;
alter table donation_campaigns enable row level security;
alter table newsletter_signups enable row level security;
alter table donations enable row level security;
alter table contact_submissions enable row level security;

drop policy if exists "public can read categories" on categories;
create policy "public can read categories" on categories for select using (true);

drop policy if exists "public can read published posts" on posts;
create policy "public can read published posts" on posts for select using (status = 'published');

drop policy if exists "public can read pages" on pages;
create policy "public can read pages" on pages for select using (true);

drop policy if exists "public can read videos" on videos;
create policy "public can read videos" on videos for select using (true);

drop policy if exists "public can read donation campaigns" on donation_campaigns;
create policy "public can read donation campaigns" on donation_campaigns for select using (true);

drop policy if exists "public can read site settings" on site_settings;
create policy "public can read site settings" on site_settings for select using (true);

drop policy if exists "public can insert newsletter" on newsletter_signups;
create policy "public can insert newsletter" on newsletter_signups for insert with check (true);

drop policy if exists "public can insert donations" on donations;
create policy "public can insert donations" on donations for insert with check (true);

drop policy if exists "public can insert contact submissions" on contact_submissions;
create policy "public can insert contact submissions" on contact_submissions for insert with check (true);
