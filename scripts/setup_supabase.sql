-- One-shot schema for GrandChef (courses + ai_requests + admin users)

create extension if not exists "pgcrypto";

-- ===== Courses =====
drop table if exists public.courses cascade;
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor text default 'GrandChef AI',
  category text default 'Técnicas',
  tier text not null check (tier in ('FREE', 'PRO', 'PREMIUM')),
  days_required integer not null default 1,
  reading_time text default '15 min',
  modules jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.courses enable row level security;
drop policy if exists "Permitir lectura pública" on public.courses;
create policy "Permitir lectura pública" on public.courses for select using (true);
create index if not exists idx_courses_tier on public.courses(tier);
create index if not exists idx_courses_days on public.courses(days_required);

-- ===== AI requests =====
drop table if exists public.ai_requests cascade;
create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  instruction text not null,
  days_to_generate integer default 7,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.ai_requests enable row level security;
-- Keep select public if you want (demo). For production, restrict this.
drop policy if exists "Public read ai_requests" on public.ai_requests;
create policy "Public read ai_requests" on public.ai_requests for select using (true);
-- Insert needs WITH CHECK under RLS; again, for production restrict to admin only.
drop policy if exists "Public insert ai_requests" on public.ai_requests;
create policy "Public insert ai_requests" on public.ai_requests for insert with check (true);

create index if not exists idx_ai_requests_created_at on public.ai_requests(created_at desc);
create index if not exists idx_ai_requests_status on public.ai_requests(status);

-- ===== Admin-managed users (demo CRM) =====
drop table if exists public.giveaway_winners cascade;
drop table if exists public.giveaways cascade;
drop table if exists public.user_rewards cascade;
drop table if exists public.app_users cascade;

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  status text not null default 'active' check (status in ('active', 'blocked', 'suspended')),
  plan text not null default 'FREE' check (plan in ('FREE', 'PRO', 'PREMIUM')),
  billing jsonb not null default '{}'::jsonb,
  plan_override jsonb,
  notes text not null default '',
  created_at timestamptz default now()
);

create table public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  type text not null,
  label text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table public.giveaways (
  id uuid primary key default gen_random_uuid(),
  eligibility text not null,
  prize_label text not null,
  winner_count integer not null default 1,
  created_at timestamptz default now()
);

create table public.giveaway_winners (
  giveaway_id uuid not null references public.giveaways(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  name text not null,
  email text not null,
  primary key (giveaway_id, user_id)
);

create index if not exists idx_app_users_name on public.app_users(name);
create index if not exists idx_user_rewards_user on public.user_rewards(user_id, created_at desc);
create index if not exists idx_giveaways_created on public.giveaways(created_at desc);

alter table public.app_users enable row level security;
alter table public.user_rewards enable row level security;
alter table public.giveaways enable row level security;
alter table public.giveaway_winners enable row level security;

-- No public policies here. Access these tables via Service Role in server routes.

-- ===== Seed demo users (optional) =====
insert into public.app_users (name, email, status, plan, billing, notes)
values
  ('Carlos Martín', 'carlos@chef.com', 'active', 'PRO', jsonb_build_object('lastPaidAt', now() - interval '10 days', 'nextDueAt', now() + interval '20 days'), ''),
  ('Ana García', 'ana@cocina.es', 'active', 'PREMIUM', jsonb_build_object('lastPaidAt', now() - interval '5 days', 'nextDueAt', now() + interval '25 days'), ''),
  ('Luis Rodríguez', 'luis@gastro.com', 'suspended', 'PRO', jsonb_build_object('lastPaidAt', now() - interval '75 days', 'nextDueAt', now() - interval '45 days'), 'Caso en revisión'),
  ('Marta López', 'marta@chef.io', 'blocked', 'PREMIUM', jsonb_build_object('lastPaidAt', now() - interval '95 days', 'nextDueAt', now() - interval '65 days'), 'Bloqueo por impago'),
  ('Pedro Sánchez', 'pedro@rest.com', 'active', 'FREE', '{}'::jsonb, '')
on conflict (email) do nothing;
