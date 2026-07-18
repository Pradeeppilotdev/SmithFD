-- Agent Smith dashboard schema.
-- Paste this into the Supabase SQL editor for the project and run it once.
-- This is a fixed interface boundary with the smith_2.0 (CLI/terminal) repo —
-- do not rename columns or tables without coordinating with that side.

-- One row per registered project (created via the CLI-facing API, not directly by the dashboard).
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                 -- raw project identifier the CLI sends (see note below)
  goal text,                          -- latest known goal text
  goal_updated_at timestamptz,
  created_at timestamptz not null default now(),
  last_synced_at timestamptz          -- bumped by the sync endpoint (§6.5)
);

-- Personal access tokens the CLI authenticates with. Store a HASH, never the raw token.
create table access_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,    -- sha256(token), hex-encoded
  label text,                         -- e.g. "MacBook Pro", user-supplied or auto-generated
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Every judged action, flagged or not (mirrors lib/decision-log.js on the CLI side).
create table decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  action text not null,
  contradicts boolean not null,
  reasoning text,
  created_at timestamptz not null default now()
);

-- A flagged action that got approved/forced anyway (mirrors lib/override-log.js).
create table overrides (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  action text not null,
  action_hash text,                   -- opaque, only used for CLI-side dedup, ignore on read
  created_at timestamptz not null default now()
);

-- Row Level Security

alter table projects enable row level security;
alter table decisions enable row level security;
alter table overrides enable row level security;
alter table access_tokens enable row level security;

create policy "select own projects" on projects
  for select using (auth.uid() = user_id);

create policy "select own decisions" on decisions
  for select using (exists (
    select 1 from projects p where p.id = decisions.project_id and p.user_id = auth.uid()
  ));

create policy "select own overrides" on overrides
  for select using (exists (
    select 1 from projects p where p.id = overrides.project_id and p.user_id = auth.uid()
  ));

create policy "manage own tokens" on access_tokens
  for all using (auth.uid() = user_id);
