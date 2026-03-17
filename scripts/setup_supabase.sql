-- One-shot schema for GrandChef (courses + ai_requests + admin users)

create extension if not exists "pgcrypto";

-- ===== Courses =====
drop table if exists public.courses cascade;
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor text default 'Grand Chef',
  category text default 'Técnicas',
  tier text not null check (tier in ('FREE', 'PRO', 'PREMIUM')),
  days_required integer not null default 1,
  reading_time text default '',
  modules jsonb not null default '[]'::jsonb,
  generation_cycle_id text,
  full_content text,
  created_at timestamptz default now()
);

-- One course per tier/day (seed scripts use this)
alter table public.courses add constraint courses_unique_tier_day unique (tier, days_required);

alter table public.courses enable row level security;
-- Drop legacy policy names (encoding variants), then apply the current one
drop policy if exists "Permitir lectura publica" on public.courses;
drop policy if exists "Permitir lectura pública" on public.courses;
drop policy if exists "Permitir lectura publica" on public.courses;
drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses" on public.courses for select using (true);
create index if not exists idx_courses_tier on public.courses(tier);
create index if not exists idx_courses_days on public.courses(days_required);
create index if not exists idx_courses_cycle_id on public.courses(generation_cycle_id);

-- ===== Course Tests =====
drop table if exists public.course_tests cascade;
create table public.course_tests (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  questions jsonb not null default '[]'::jsonb,
  answers_visible boolean default false,
  release_answers_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.course_tests enable row level security;
drop policy if exists "Public read course_tests" on public.course_tests;
create policy "Public read course_tests" on public.course_tests for select using (true);
create index if not exists idx_course_tests_course_id on public.course_tests(course_id);

-- ===== Engine Cycles =====
drop table if exists public.engine_cycles cascade;
create table public.engine_cycles (
  id uuid primary key default gen_random_uuid(),
  cycle_id text unique not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.engine_cycles enable row level security;
-- No public policies: service role only for admin routes.
create index if not exists idx_engine_cycles_status on public.engine_cycles(status);

-- ===== Engine Jobs (scheduled post-build generation) =====
drop table if exists public.engine_jobs cascade;
create table public.engine_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- e.g. 'course_cycle'
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'canceled')),
  run_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  last_error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.engine_jobs enable row level security;
-- No public policies: service role only.
create index if not exists idx_engine_jobs_status_run_at on public.engine_jobs(status, run_at);

-- ===== Ingredients =====
drop table if exists public.ingredients cascade;
create table public.ingredients (
  id text primary key,
  name text not null,
  category text not null,
  family text not null,
  description text not null,
  pairing_notes jsonb not null default '[]'::jsonb,
  stories jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.ingredients enable row level security;
drop policy if exists "Permitir lectura publica" on public.ingredients;
drop policy if exists "Permitir lectura pública" on public.ingredients;
drop policy if exists "Permitir lectura publica" on public.ingredients;
drop policy if exists "Public read ingredients" on public.ingredients;
create policy "Public read ingredients" on public.ingredients for select using (true);
create index if not exists idx_ingredients_family on public.ingredients(family);
create index if not exists idx_ingredients_name on public.ingredients(name);

-- ===== Techniques =====
drop table if exists public.techniques cascade;
create table public.techniques (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  difficulty text not null,
  equipment jsonb not null default '[]'::jsonb,
  reagents jsonb not null default '[]'::jsonb,
  pairing_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.techniques enable row level security;
drop policy if exists "Permitir lectura publica" on public.techniques;
drop policy if exists "Permitir lectura pública" on public.techniques;
drop policy if exists "Permitir lectura publica" on public.techniques;
drop policy if exists "Public read techniques" on public.techniques;
create policy "Public read techniques" on public.techniques for select using (true);
create index if not exists idx_techniques_category on public.techniques(category);

-- ===== Recipes =====
drop table if exists public.recipes cascade;
create table public.recipes (
  id text primary key,
  title text not null,
  source text not null default 'Grand Chef',
  tier text not null check (tier in ('FREE', 'PRO', 'PREMIUM')),
  difficulty text not null default 'Basico' check (difficulty in ('Basico', 'Intermedio', 'Avanzado', 'Maestro')),
  servings integer not null default 2,
  times jsonb not null default '{"prepMin":10,"cookMin":10}'::jsonb,
  description text not null default '',
  utensils jsonb not null default '[]'::jsonb,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  techniques jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.recipes enable row level security;
drop policy if exists "Public read recipes" on public.recipes;
create policy "Public read recipes" on public.recipes for select using (true);
create index if not exists idx_recipes_tier on public.recipes(tier);
create index if not exists idx_recipes_created_at on public.recipes(created_at desc);

-- ===== AI requests =====
drop table if exists public.ai_requests cascade;
create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'courses',
  instruction text not null,
  payload jsonb not null default '{}'::jsonb,
  days_to_generate integer default 7,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.ai_requests enable row level security;
-- Keep select public if you want (demo). For production, restrict this.
drop policy if exists "Public read ai_requests" on public.ai_requests;
-- No public policies: access via Service Role in server routes.
-- Insert needs WITH CHECK under RLS; again, for production restrict to admin only.
drop policy if exists "Public insert ai_requests" on public.ai_requests;
-- No public policies: access via Service Role in server routes.

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
  prize_meta jsonb not null default '{}'::jsonb,
  status text not null default 'completed' check (status in ('draft', 'completed', 'revoked')),
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
  ('Carlos Martin', 'carlos@chef.com', 'active', 'PRO', jsonb_build_object('lastPaidAt', now() - interval '10 days', 'nextDueAt', now() + interval '20 days'), ''),
  ('Ana Garcia', 'ana@cocina.es', 'active', 'PREMIUM', jsonb_build_object('lastPaidAt', now() - interval '5 days', 'nextDueAt', now() + interval '25 days'), ''),
  ('Luis Rodriguez', 'luis@gastro.com', 'suspended', 'PRO', jsonb_build_object('lastPaidAt', now() - interval '75 days', 'nextDueAt', now() - interval '45 days'), 'Caso en revision'),
  ('Marta Lopez', 'marta@chef.io', 'blocked', 'PREMIUM', jsonb_build_object('lastPaidAt', now() - interval '95 days', 'nextDueAt', now() - interval '65 days'), 'Bloqueo por impago'),
  ('Pedro Sanchez', 'pedro@rest.com', 'active', 'FREE', '{}'::jsonb, '')
on conflict (email) do nothing;

