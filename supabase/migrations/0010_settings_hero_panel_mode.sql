-- Add hero panel mode toggle to site_settings
alter table site_settings
  add column if not exists hero_panel_mode text not null default 'article'
    check (hero_panel_mode in ('article', 'video'));
