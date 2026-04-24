-- Create Supabase Storage bucket for admin-uploaded videos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-videos',
  'site-videos',
  true,
  104857600,
  array[
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ]
)
on conflict (id) do nothing;

-- Allow anyone to read uploaded videos (bucket is public)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read site-videos'
  ) then
    create policy "Public read site-videos"
      on storage.objects for select
      using (bucket_id = 'site-videos');
  end if;
end$$;

-- Allow authenticated service role to upload videos
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Service role upload site-videos'
  ) then
    create policy "Service role upload site-videos"
      on storage.objects for insert
      with check (bucket_id = 'site-videos');
  end if;
end$$;
