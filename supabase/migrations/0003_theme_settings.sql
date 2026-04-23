-- Add theme column to site_settings for per-site colour customisation
alter table site_settings
  add column if not exists theme jsonb not null default '{
    "primary": "#2ecc8e",
    "primaryDark": "#1ba870",
    "secondary": "#153a28",
    "bg": "#f7faf7",
    "surface": "#ffffff",
    "text": "#23312b"
  }'::jsonb;
