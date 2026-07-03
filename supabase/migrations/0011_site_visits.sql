-- Track site visits for a simple visitor counter
create table if not exists site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at_idx on site_visits (created_at);
create index if not exists site_visits_visitor_id_idx on site_visits (visitor_id);

alter table site_visits enable row level security;

drop policy if exists "public can insert visits" on site_visits;
create policy "public can insert visits" on site_visits for insert with check (true);
