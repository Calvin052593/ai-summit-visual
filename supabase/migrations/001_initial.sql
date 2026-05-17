-- Gen AI Summit Asia 2026 — initial schema

create table public.attendees (
  id              uuid        primary key default gen_random_uuid(),
  first_name      text        not null,
  last_name       text,
  email           text        unique not null,
  phone           text        not null,
  country_code    text        not null default '+60',
  checked_in_at   timestamptz not null default now(),
  avatar_seed     text        not null,
  avatar_color    text,
  is_dummy        boolean     not null default false,
  display_consent boolean     not null default false,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

create table public.events (
  id        uuid        primary key default gen_random_uuid(),
  name      text        not null default 'Gen AI Summit Asia 2026',
  capacity  int         not null default 3000,
  starts_at timestamptz,
  ends_at   timestamptz,
  is_live   boolean     not null default true
);

-- Performance indexes
create index idx_attendees_checked_in_at on public.attendees (checked_in_at);
create index idx_attendees_is_dummy      on public.attendees (is_dummy);
create index idx_attendees_is_active     on public.attendees (is_active);

-- Enable Supabase Realtime on attendees
alter publication supabase_realtime add table public.attendees;

-- Row-level security
alter table public.attendees enable row level security;
alter table public.events    enable row level security;

-- Attendees: anyone can read active rows; service_role can do everything
create policy "read active attendees"
  on public.attendees for select
  using (is_active = true);

create policy "service role full access attendees"
  on public.attendees for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Events: public read; service_role full access
create policy "read events"
  on public.events for select
  using (true);

create policy "service role full access events"
  on public.events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
