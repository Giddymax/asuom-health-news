-- Add image display control columns to site_settings
alter table site_settings
  add column if not exists hero_image_opacity numeric(4,2) not null default 0.28,
  add column if not exists image_contrast    numeric(4,2) not null default 1.16,
  add column if not exists image_saturation  numeric(4,2) not null default 1.20,
  add column if not exists image_brightness  numeric(4,2) not null default 1.03;
