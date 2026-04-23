-- Navigation links (replaces hardcoded header nav)
alter table site_settings
  add column if not exists nav_links jsonb not null default '[]'::jsonb;

-- Footer link columns
alter table site_settings
  add column if not exists footer_explore_links jsonb not null default '[]'::jsonb,
  add column if not exists footer_newsroom_links jsonb not null default '[]'::jsonb,
  add column if not exists footer_copyright text not null default '';

-- All homepage section labels, titles, descriptions, and CTA button text
alter table site_settings
  add column if not exists homepage_content jsonb not null default '{}'::jsonb;

-- Site-wide SEO / open-graph fields
alter table site_settings
  add column if not exists meta_description text not null default '',
  add column if not exists og_image text not null default '';
