create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table if exists videos
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'videos'
      and constraint_name = 'videos_category_slug_fkey'
  ) then
    alter table public.videos
      add constraint videos_category_slug_fkey
      foreign key (category_slug)
      references public.categories (slug)
      on update cascade
      on delete cascade;
  end if;
end
$$;

drop index if exists donation_campaigns_single_active_idx;
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
