alter table if exists posts
  add column if not exists gallery jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'posts'
      and constraint_name = 'posts_gallery_is_array'
  ) then
    alter table public.posts
      add constraint posts_gallery_is_array
      check (jsonb_typeof(gallery) = 'array');
  end if;
end
$$;
