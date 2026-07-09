-- Allow a video entry to hold up to 2 additional clips (3 total with the primary video_url)
alter table if exists videos
  add column if not exists extra_video_urls jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'videos'
      and constraint_name = 'videos_extra_video_urls_is_array'
  ) then
    alter table public.videos
      add constraint videos_extra_video_urls_is_array
      check (jsonb_typeof(extra_video_urls) = 'array' and jsonb_array_length(extra_video_urls) <= 2);
  end if;
end
$$;
