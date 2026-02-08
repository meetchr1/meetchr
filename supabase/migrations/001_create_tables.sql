-- ============================================================
-- MeeTchr Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with teacher-specific info
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  survey_completed boolean default false,
  matched boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. SURVEY RESPONSES TABLE
-- Stores all 41 survey question answers per teacher
-- ============================================================
create table public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,

  -- Logistics (Questions 1-9)
  district text,
  school text,
  role text not null check (role in ('mentor', 'novice')),
  grade_level text,
  elementary_grade_level text,
  subject_area text,
  district_environment text,
  district_size text,
  title_1 text,
  time_commitment text,

  -- Personality & Methodology (Questions 10-41)
  desk_situation text,
  lesson_planning_style text,
  classroom_management text,
  superpower text,
  bad_day_protocol text,
  feedback_style text,
  goal text,
  communication_style text,
  teacher_archetype text,
  professional_boundaries text,
  introvert_extrovert text,
  morning_energy text,
  red_flag text,
  conflict_style text,
  student_advocacy text,
  standards_change text,
  sunday_funday text,
  grading_marathon text,
  admin_alert text,
  meeting_vibe text,
  summer_fun text,
  respect_check text,
  pivot_potential text,
  lightbulb_moment text,
  standardized_struggle text,
  rule_follower text,
  social_battery text,
  master_of_messiness text,
  pd_preference text,
  grouping_game text,
  failed_test_funk text,
  pop_in_panic text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.survey_responses enable row level security;

-- Survey responses policies
create policy "Users can view their own survey response"
  on public.survey_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own survey response"
  on public.survey_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own survey response"
  on public.survey_responses for update
  using (auth.uid() = user_id);

-- Index for fast lookups by role (used heavily in matching)
create index idx_survey_responses_role on public.survey_responses(role);
create index idx_survey_responses_user_id on public.survey_responses(user_id);


-- 3. MATCHES TABLE
-- Pairs a mentor teacher with a novice teacher
-- ============================================================
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  novice_id uuid references public.profiles(id) on delete cascade not null,
  compatibility_score numeric(5, 2) default 0,
  status text default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
  matched_at timestamptz default now(),

  -- Ensure a teacher can only be in one active match
  constraint unique_mentor_match unique (mentor_id),
  constraint unique_novice_match unique (novice_id),
  constraint no_self_match check (mentor_id != novice_id)
);

-- Enable RLS
alter table public.matches enable row level security;

-- Match policies — teachers can see their own matches
create policy "Mentors can view their matches"
  on public.matches for select
  using (auth.uid() = mentor_id);

create policy "Novices can view their matches"
  on public.matches for select
  using (auth.uid() = novice_id);


-- 4. HELPER: Auto-update updated_at timestamps
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger survey_responses_updated_at
  before update on public.survey_responses
  for each row execute function public.update_updated_at();


-- 5. CHECK-INS TABLE
-- Weekly vibe checks: confidence & energy levels (1-10)
-- ============================================================
create table public.check_ins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  confidence integer not null check (confidence between 1 and 10),
  energy integer not null check (energy between 1 and 10),
  note text,
  week_of date not null default (date_trunc('week', now())::date),
  created_at timestamptz default now(),

  -- One check-in per user per week
  constraint unique_weekly_check_in unique (user_id, week_of)
);

-- Enable RLS
alter table public.check_ins enable row level security;

create policy "Users can view their own check-ins"
  on public.check_ins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own check-ins"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own check-ins"
  on public.check_ins for update
  using (auth.uid() = user_id);

create index idx_check_ins_user_week on public.check_ins(user_id, week_of);


-- 6. MATCHING
-- The matching algorithm now runs in the Supabase Edge Function "match-teacher"
-- using a Big Five personality model (OCEAN) with weighted scoring from the
-- Question Weighting spreadsheet. The edge function:
--   1. Fetches the novice's survey + all unmatched mentor surveys
--   2. Computes 5 trait scores per teacher (Openness, Conscientiousness,
--      Extroversion, Agreeableness, Neuroticism)
--   3. Normalizes and compares trait vectors
--   4. Adds bonuses for grade-level and subject-area matches
--   5. Returns a compatibility percentage (e.g., 94% Match)
--
-- Deploy with: supabase functions deploy match-teacher
-- ============================================================
