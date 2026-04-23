-- Add site-wide image fields to site_settings
alter table site_settings
  add column if not exists logo_image text not null default '/images/brand/ahn.jpg',
  add column if not exists hero_image text not null default '',
  add column if not exists mid_section_image text not null default '';

-- Create Supabase Storage bucket for admin-uploaded images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- Allow anyone to read uploaded images (bucket is public)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read site-images'
  ) then
    create policy "Public read site-images"
      on storage.objects for select
      using (bucket_id = 'site-images');
  end if;
end$$;
