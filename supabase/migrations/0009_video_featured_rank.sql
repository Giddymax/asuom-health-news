-- Add featured flag and rank to videos table
alter table videos
  add column if not exists featured boolean not null default false,
  add column if not exists featured_rank integer not null default 0;
