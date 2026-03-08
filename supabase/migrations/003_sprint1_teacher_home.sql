-- Sprint 1: Teacher Home + privacy-first check-ins

-- 1) Profiles shape for Sprint 1
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists pseudonym text,
  add column if not exists role text;

-- 2) Enforce strict "own profile only" privacy
drop policy if exists "Matched partners can view each other's profile" on public.profiles;

-- 3) Daily check-ins table
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  heaviness text not null check (heaviness in ('light', 'manageable', 'heavy', 'not_ok')),
  theme text not null check (theme in ('classroom', 'planning', 'parents', 'admin', 'self')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint checkins_user_date_unique unique (user_id, date)
);

alter table public.checkins enable row level security;

create policy "Users can view their own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own checkins"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own checkins"
  on public.checkins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own checkins"
  on public.checkins for delete
  using (auth.uid() = user_id);

create index if not exists idx_checkins_user_date
  on public.checkins(user_id, date desc);

drop trigger if exists checkins_updated_at on public.checkins;
create trigger checkins_updated_at
  before update on public.checkins
  for each row execute function public.update_updated_at();
