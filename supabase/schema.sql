-- SystemLab Live - initial Supabase schema
-- Run in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[0-9]{6}$'),
  active_activity text,
  status text not null default 'waiting'
    check (status in ('waiting', 'active', 'results', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 24),
  joined_at timestamptz not null default now(),
  unique (session_id, nickname)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  activity_id text not null,
  score integer not null default 0 check (score >= 0),
  payload jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  unique (participant_id, activity_id)
);

create index if not exists participants_session_id_idx
  on public.participants(session_id);

create index if not exists submissions_session_id_idx
  on public.submissions(session_id);

create index if not exists submissions_participant_id_idx
  on public.submissions(participant_id);

alter table public.sessions enable row level security;
alter table public.participants enable row level security;
alter table public.submissions enable row level security;

-- MVP policies. These will be tightened before classroom deployment.
-- Students must know a valid session identifier/code to participate.
create policy "sessions readable"
  on public.sessions for select
  using (true);

create policy "participants readable"
  on public.participants for select
  using (true);

create policy "participants insertable"
  on public.participants for insert
  with check (true);

create policy "submissions readable"
  on public.submissions for select
  using (true);

create policy "submissions insertable"
  on public.submissions for insert
  with check (true);

create policy "submissions updatable"
  on public.submissions for update
  using (true)
  with check (true);

-- Realtime tables
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.submissions;
