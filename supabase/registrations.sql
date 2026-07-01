-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- for project zcyqqctqmxvxltnyynhz. Creates the table the landing page writes
-- to and the /admin panel reads from.

create table if not exists public.registrations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  full_name     text not null,
  phone         text not null,
  email         text not null,
  guests        int  not null default 0,   -- ADDITIONAL guests (party size = guests + 1)
  session_id    text not null,
  session_label text not null,
  interests     text[] not null default '{}',
  comments      text not null default '',
  consent       boolean not null default false
);

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

create index if not exists registrations_session_idx
  on public.registrations (session_id);

-- Lock the table down. RLS with no policies => the public/anon API key cannot
-- read or write. The app uses the SERVICE ROLE key (server-side only), which
-- bypasses RLS, so registrations and the admin panel still work.
alter table public.registrations enable row level security;
