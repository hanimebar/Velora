-- ===================================================================
-- Velora — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.
-- All tables use uuid primary keys and timestamptz created_at.
-- ===================================================================

-- Enable UUID extension (should already be enabled)
create extension if not exists "uuid-ossp";

-- ===================================================================
-- TABLES
-- ===================================================================

-- Studios
create table if not exists studios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  timezone text not null default 'Europe/Stockholm',
  stripe_customer_id text,
  currency text not null default 'SEK',
  logo_url text,
  description text,
  contact_email text,
  is_active boolean not null default true
);

create index if not exists studios_owner_id_idx on studios(owner_id);
create index if not exists studios_slug_idx on studios(slug);

-- Class types
create table if not exists class_types (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  studio_id uuid not null references studios(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 60,
  color text not null default '#698C60'
);

create index if not exists class_types_studio_id_idx on class_types(studio_id);

-- Class sessions
create table if not exists class_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  studio_id uuid not null references studios(id) on delete cascade,
  class_type_id uuid not null references class_types(id) on delete restrict,
  instructor_name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 12,
  is_cancelled boolean not null default false,
  cancellation_note text,
  recurrence_rule text
);

create index if not exists class_sessions_studio_id_idx on class_sessions(studio_id);
create index if not exists class_sessions_starts_at_idx on class_sessions(starts_at);
create index if not exists class_sessions_studio_starts_at_idx on class_sessions(studio_id, starts_at);

-- Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  studio_id uuid not null references studios(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  stripe_customer_id text,
  imported_from text not null default 'manual' check (imported_from in ('manual', 'mindbody_csv')),
  source_id text,
  unique(studio_id, email)
);

create index if not exists clients_studio_id_idx on clients(studio_id);
create index if not exists clients_email_idx on clients(email);
create index if not exists clients_studio_email_idx on clients(studio_id, email);

-- Memberships (product definitions)
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  studio_id uuid not null references studios(id) on delete cascade,
  name text not null,
  description text,
  price_per_period integer not null,
  currency text not null default 'SEK',
  billing_interval text not null check (billing_interval in ('month', 'year')),
  stripe_price_id text,
  stripe_product_id text,
  is_active boolean not null default true,
  classes_per_period integer
);

create index if not exists memberships_studio_id_idx on memberships(studio_id);

-- Class packs (product definitions)
create table if not exists class_packs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  studio_id uuid not null references studios(id) on delete cascade,
  name text not null,
  class_count integer not null,
  price integer not null,
  currency text not null default 'SEK',
  stripe_price_id text,
  stripe_product_id text,
  validity_days integer not null default 90,
  is_active boolean not null default true
);

create index if not exists class_packs_studio_id_idx on class_packs(studio_id);

-- Client memberships (per-client subscription instances)
create table if not exists client_memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  studio_id uuid not null references studios(id) on delete cascade,
  membership_id uuid not null references memberships(id) on delete restrict,
  stripe_subscription_id text not null,
  status text not null check (status in ('active', 'paused', 'cancelled', 'past_due')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  classes_used_this_period integer not null default 0
);

create index if not exists client_memberships_client_id_idx on client_memberships(client_id);
create index if not exists client_memberships_studio_id_idx on client_memberships(studio_id);
create index if not exists client_memberships_subscription_id_idx on client_memberships(stripe_subscription_id);

-- Client packs (per-client pack purchases)
create table if not exists client_packs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  studio_id uuid not null references studios(id) on delete cascade,
  class_pack_id uuid not null references class_packs(id) on delete restrict,
  stripe_payment_intent_id text,
  classes_total integer not null,
  classes_used integer not null default 0,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null check (status in ('active', 'exhausted', 'expired')) default 'active'
);

create index if not exists client_packs_client_id_idx on client_packs(client_id);
create index if not exists client_packs_studio_id_idx on client_packs(studio_id);

-- Bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null references class_sessions(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  studio_id uuid not null references studios(id) on delete cascade,
  status text not null check (status in ('confirmed', 'cancelled', 'waitlisted', 'attended', 'no_show')) default 'waitlisted',
  booked_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancellation_token uuid not null default gen_random_uuid(),
  charged_from text check (charged_from in ('membership', 'pack')),
  client_pack_id uuid references client_packs(id),
  client_membership_id uuid references client_memberships(id),
  unique(session_id, client_id)
);

create index if not exists bookings_session_id_idx on bookings(session_id);
create index if not exists bookings_client_id_idx on bookings(client_id);
create index if not exists bookings_studio_id_idx on bookings(studio_id);
create index if not exists bookings_cancellation_token_idx on bookings(cancellation_token);
create index if not exists bookings_status_idx on bookings(status);

-- ===================================================================
-- ROW LEVEL SECURITY
-- ===================================================================

alter table studios enable row level security;
alter table class_types enable row level security;
alter table class_sessions enable row level security;
alter table clients enable row level security;
alter table memberships enable row level security;
alter table class_packs enable row level security;
alter table client_memberships enable row level security;
alter table client_packs enable row level security;
alter table bookings enable row level security;

-- Studios: owner only
create policy "studios_owner_select" on studios for select using (owner_id = auth.uid());
create policy "studios_owner_insert" on studios for insert with check (owner_id = auth.uid());
create policy "studios_owner_update" on studios for update using (owner_id = auth.uid());
create policy "studios_owner_delete" on studios for delete using (owner_id = auth.uid());

-- Class types: owner only
create policy "class_types_owner_all" on class_types for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Class sessions: owner write + public read
create policy "class_sessions_public_select" on class_sessions for select using (true);
create policy "class_sessions_owner_insert" on class_sessions for insert
  with check (studio_id in (select id from studios where owner_id = auth.uid()));
create policy "class_sessions_owner_update" on class_sessions for update
  using (studio_id in (select id from studios where owner_id = auth.uid()));
create policy "class_sessions_owner_delete" on class_sessions for delete
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Clients: owner only (service role used for public inserts in API routes)
create policy "clients_owner_all" on clients for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Memberships: owner only
create policy "memberships_owner_all" on memberships for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Class packs: owner only
create policy "class_packs_owner_all" on class_packs for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Client memberships: owner only
create policy "client_memberships_owner_all" on client_memberships for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Client packs: owner only
create policy "client_packs_owner_all" on client_packs for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- Bookings: owner only (service role for public booking inserts)
create policy "bookings_owner_all" on bookings for all
  using (studio_id in (select id from studios where owner_id = auth.uid()));

-- ===================================================================
-- Notes:
--
-- Service role key (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS and is
-- used in server-side API routes for:
--   - Creating clients from the booking flow
--   - Creating bookings from the booking flow
--   - Stripe webhook handlers
--   - CSV import
--
-- Never expose the service role key to the browser.
-- ===================================================================
