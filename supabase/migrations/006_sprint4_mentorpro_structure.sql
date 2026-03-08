-- Sprint 4: MentorPRO-style structure

-- ============================================================
-- A) Academy micro-courses
-- ============================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text not null,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, sort_order)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "Authenticated users can view courses" on public.courses;
create policy "Authenticated users can view courses"
  on public.courses for select
  using (auth.uid() is not null and published = true);

drop policy if exists "Authenticated users can view lessons" on public.lessons;
create policy "Authenticated users can view lessons"
  on public.lessons for select
  using (auth.uid() is not null);

drop policy if exists "Users can view own enrollments" on public.enrollments;
create policy "Users can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own enrollments" on public.enrollments;
create policy "Users can insert own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own enrollments" on public.enrollments;
create policy "Users can update own enrollments"
  on public.enrollments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own lesson progress" on public.lesson_progress;
create policy "Users can view own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own lesson progress" on public.lesson_progress;
create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own lesson progress" on public.lesson_progress;
create policy "Users can update own lesson progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.update_updated_at();

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.update_updated_at();

drop trigger if exists lesson_progress_updated_at on public.lesson_progress;
create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.update_updated_at();

insert into public.courses (slug, title, description)
values
  ('calm-classroom-resets', 'Calm Classroom Resets', 'Fast de-escalation routines you can use in 2-5 minutes.'),
  ('family-comms-under-pressure', 'Family Communication Under Pressure', 'Practical scripts for difficult parent communication.'),
  ('planning-when-overwhelmed', 'Planning When Overwhelmed', 'Simple planning systems for high-load teaching weeks.')
on conflict (slug) do nothing;

insert into public.lessons (course_id, title, content, sort_order)
select c.id, l.title, l.content, l.sort_order
from (
  values
    ('calm-classroom-resets', 1, '2-Minute Nervous-System Reset', 'Use a short breathing + transition script before redirecting behavior.'),
    ('calm-classroom-resets', 2, 'Neutral Language Reframes', 'Replace escalation language with concise neutral cues.'),
    ('family-comms-under-pressure', 1, 'One-Message Parent Framework', 'Lead with observation, impact, and one concrete next step.'),
    ('family-comms-under-pressure', 2, 'Boundary-Preserving Follow-ups', 'Set communication boundaries while staying warm and clear.'),
    ('planning-when-overwhelmed', 1, 'Minimum Viable Lesson Plan', 'Plan outcomes, checks, and one extension first.'),
    ('planning-when-overwhelmed', 2, 'Weekly Triage for Teachers', 'Sort tasks into must/should/can to protect planning time.')
) as l(course_slug, sort_order, title, content)
join public.courses c on c.slug = l.course_slug
on conflict (course_id, sort_order) do nothing;

-- ============================================================
-- B) Surveys
-- ============================================================
create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  prompt text not null,
  kind text not null check (kind in ('likert', 'free_text')),
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  unique (survey_id, sort_order)
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  respondent_id uuid not null references public.profiles(id) on delete cascade,
  likert_value integer check (likert_value between 1 and 5),
  free_text text,
  created_at timestamptz not null default now(),
  unique (question_id, respondent_id)
);

alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.responses enable row level security;

drop policy if exists "Authenticated users can view active surveys" on public.surveys;
create policy "Authenticated users can view active surveys"
  on public.surveys for select
  using (auth.uid() is not null and is_active = true);

drop policy if exists "Authenticated users can view survey questions" on public.questions;
create policy "Authenticated users can view survey questions"
  on public.questions for select
  using (auth.uid() is not null);

drop policy if exists "Users can view own responses" on public.responses;
create policy "Users can view own responses"
  on public.responses for select
  using (auth.uid() = respondent_id);

drop policy if exists "Users can insert own responses" on public.responses;
create policy "Users can insert own responses"
  on public.responses for insert
  with check (auth.uid() = respondent_id);

drop policy if exists "Users can update own responses" on public.responses;
create policy "Users can update own responses"
  on public.responses for update
  using (auth.uid() = respondent_id)
  with check (auth.uid() = respondent_id);

-- ============================================================
-- C) Admin aggregate-only RPCs (never expose free-text/raw notes)
-- ============================================================
create or replace function public.require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  ) then
    raise exception 'forbidden';
  end if;
end;
$$;

create or replace function public.get_admin_dashboard_aggregates()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  heaviness_trends jsonb;
  top_help_categories jsonb;
  course_enrollment_counts jsonb;
  survey_completion jsonb;
begin
  perform public.require_admin();

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'date', t.date,
        'heaviness', t.heaviness,
        'count', t.cnt
      )
      order by t.date desc, t.heaviness
    ),
    '[]'::jsonb
  )
  into heaviness_trends
  from (
    select c.date, c.heaviness, count(*) as cnt
    from public.checkins c
    where c.date >= current_date - interval '30 days'
    group by c.date, c.heaviness
  ) t;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('category', t.category, 'count', t.cnt)
      order by t.cnt desc
    ),
    '[]'::jsonb
  )
  into top_help_categories
  from (
    select hr.category, count(*) as cnt
    from public.help_requests hr
    group by hr.category
    order by cnt desc
    limit 10
  ) t;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('course', t.title, 'count', t.cnt)
      order by t.cnt desc
    ),
    '[]'::jsonb
  )
  into course_enrollment_counts
  from (
    select c.title, count(e.id) as cnt
    from public.courses c
    left join public.enrollments e on e.course_id = c.id
    group by c.id, c.title
  ) t;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'survey', t.title,
        'responses', t.responses_count,
        'respondents', t.respondents_count
      )
      order by t.title
    ),
    '[]'::jsonb
  )
  into survey_completion
  from (
    select s.title,
      count(r.id) as responses_count,
      count(distinct r.respondent_id) as respondents_count
    from public.surveys s
    left join public.responses r on r.survey_id = s.id
    group by s.id, s.title
  ) t;

  return jsonb_build_object(
    'heaviness_trends', heaviness_trends,
    'top_help_categories', top_help_categories,
    'course_enrollment_counts', course_enrollment_counts,
    'survey_completion', survey_completion
  );
end;
$$;

create or replace function public.get_admin_survey_likert_aggregates()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.require_admin();

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'survey', t.survey,
        'question_id', t.question_id,
        'prompt', t.prompt,
        'likert_value', t.likert_value,
        'count', t.cnt
      )
      order by t.survey, t.question_id, t.likert_value
    ),
    '[]'::jsonb
  )
  into result
  from (
    select s.title as survey, q.id as question_id, q.prompt, r.likert_value, count(*) as cnt
    from public.responses r
    join public.questions q on q.id = r.question_id
    join public.surveys s on s.id = q.survey_id
    where q.kind = 'likert'
      and r.likert_value is not null
    group by s.title, q.id, q.prompt, r.likert_value
  ) t;

  return result;
end;
$$;

grant execute on function public.require_admin() to authenticated;
grant execute on function public.get_admin_dashboard_aggregates() to authenticated;
grant execute on function public.get_admin_survey_likert_aggregates() to authenticated;
