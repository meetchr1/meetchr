-- ============================================================
-- MeeTchr Feature Tables Migration
-- Adds all tables needed for Chat, Video, Workspace, Resources,
-- Scheduling, Goals, Notes, Achievements, and more.
--
-- Run AFTER 001_create_tables.sql
-- ============================================================


-- ============================================================
-- 0. HELPER FUNCTION: Check if current user is part of a match
--    Used by RLS policies on all match-scoped tables
-- ============================================================
create or replace function public.is_match_member(match_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from public.matches
    where id = match_uuid
    and (mentor_id = auth.uid() or novice_id = auth.uid())
    and status in ('pending', 'active')
  );
$$ language sql security definer stable;


-- ============================================================
-- 1. EXTEND PROFILES TABLE
--    Add fields for Profile page: location, bio, avatar, etc.
-- ============================================================
alter table public.profiles
  add column if not exists location text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists years_experience integer,
  add column if not exists teaching_focus text[] default '{}',
  add column if not exists availability text,
  add column if not exists preferred_meeting_type text default 'both'
    check (preferred_meeting_type in ('video', 'chat', 'both'));

-- Allow matched partners to view each other's profile
create policy "Matched partners can view each other's profile"
  on public.profiles for select
  using (
    exists (
      select 1 from public.matches
      where status in ('pending', 'active')
      and (
        (mentor_id = auth.uid() and novice_id = profiles.id)
        or (novice_id = auth.uid() and mentor_id = profiles.id)
      )
    )
  );


-- ============================================================
-- 2. MESSAGES TABLE
--    Chat messages between matched pairs (Chat.tsx)
-- ============================================================
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  message_type text default 'normal' check (message_type in ('normal', 'sos')),
  sos_category text check (
    sos_category is null or sos_category in (
      'vent_session', 'email_proofread', 'lesson_pivot',
      'classroom_crisis', 'observation_prep', 'tech_support', 'fresh_eyes_review'
    )
  ),
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Match members can view messages"
  on public.messages for select
  using (public.is_match_member(match_id));

create policy "Match members can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and public.is_match_member(match_id)
  );

create policy "Recipients can mark messages as read"
  on public.messages for update
  using (
    public.is_match_member(match_id)
    and sender_id != auth.uid()
  );

create index idx_messages_match_id on public.messages(match_id, created_at desc);
create index idx_messages_sender_id on public.messages(sender_id);


-- ============================================================
-- 3. VIDEO SESSIONS TABLE
--    Video call records (VideoCall.tsx)
-- ============================================================
create table public.video_sessions (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  initiated_by uuid references public.profiles(id) on delete set null,
  room_url text,
  room_id text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  status text default 'pending' check (status in ('pending', 'active', 'ended', 'cancelled')),
  created_at timestamptz default now()
);

alter table public.video_sessions enable row level security;

create policy "Match members can view video sessions"
  on public.video_sessions for select
  using (public.is_match_member(match_id));

create policy "Match members can create video sessions"
  on public.video_sessions for insert
  with check (
    auth.uid() = initiated_by
    and public.is_match_member(match_id)
  );

create policy "Match members can update video sessions"
  on public.video_sessions for update
  using (public.is_match_member(match_id));

create index idx_video_sessions_match_id on public.video_sessions(match_id, created_at desc);


-- ============================================================
-- 4. SHARED FILES TABLE
--    Files uploaded to the workspace (Workspace.tsx / SharedFiles)
--    Actual file blobs live in Supabase Storage; this stores metadata.
-- ============================================================
create table public.shared_files (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete set null not null,
  file_name text not null,
  file_type text check (file_type in ('document', 'image', 'spreadsheet', 'presentation', 'pdf', 'other')),
  mime_type text,
  file_size_bytes bigint,
  storage_path text not null,
  created_at timestamptz default now()
);

alter table public.shared_files enable row level security;

create policy "Match members can view shared files"
  on public.shared_files for select
  using (public.is_match_member(match_id));

create policy "Match members can upload files"
  on public.shared_files for insert
  with check (
    auth.uid() = uploaded_by
    and public.is_match_member(match_id)
  );

create policy "Uploader can delete their files"
  on public.shared_files for delete
  using (auth.uid() = uploaded_by);

create index idx_shared_files_match_id on public.shared_files(match_id, created_at desc);


-- ============================================================
-- 5. RESOURCES TABLE (system-wide content)
--    Curated resource library for all teachers (ResourceLibrary.tsx)
-- ============================================================
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text check (type in ('article', 'video', 'guide', 'template', 'link')),
  category text not null,
  url text,
  duration text,
  is_featured boolean default false,
  is_new boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.resources enable row level security;

-- Resources are readable by any authenticated user
create policy "Authenticated users can view resources"
  on public.resources for select
  using (auth.uid() is not null);

create index idx_resources_category on public.resources(category);


-- ============================================================
-- 6. RESOURCE BOOKMARKS TABLE
--    User bookmarks/favorites on resources
-- ============================================================
create table public.resource_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  resource_id uuid references public.resources(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, resource_id)
);

alter table public.resource_bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on public.resource_bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create bookmarks"
  on public.resource_bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.resource_bookmarks for delete
  using (auth.uid() = user_id);

create index idx_resource_bookmarks_user on public.resource_bookmarks(user_id);


-- ============================================================
-- 7. SCHEDULED SESSIONS TABLE
--    Calendar events between matched pairs (Schedule.tsx)
-- ============================================================
create table public.scheduled_sessions (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  created_by uuid references public.profiles(id) on delete set null not null,
  title text not null,
  session_type text check (session_type in ('video', 'chat', 'check-in', 'observation', 'planning', 'open')),
  scheduled_date date not null,
  scheduled_time time not null,
  duration_minutes integer default 30,
  status text default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  reminder text default 'none' check (reminder in ('none', '15min', '30min', '1hr', '1day')),
  confirmed boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.scheduled_sessions enable row level security;

create policy "Match members can view scheduled sessions"
  on public.scheduled_sessions for select
  using (public.is_match_member(match_id));

create policy "Match members can create sessions"
  on public.scheduled_sessions for insert
  with check (
    auth.uid() = created_by
    and public.is_match_member(match_id)
  );

create policy "Match members can update sessions"
  on public.scheduled_sessions for update
  using (public.is_match_member(match_id));

create policy "Creator can delete sessions"
  on public.scheduled_sessions for delete
  using (auth.uid() = created_by);

create index idx_scheduled_sessions_match on public.scheduled_sessions(match_id, scheduled_date);
create index idx_scheduled_sessions_date on public.scheduled_sessions(scheduled_date, scheduled_time);


-- ============================================================
-- 8. GOALS TABLE
--    Goal tracking for matched pairs (Goals.tsx)
-- ============================================================
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  created_by uuid references public.profiles(id) on delete set null not null,
  title text not null,
  description text,
  category text check (category in (
    'classroom-management', 'instruction', 'student-relationships',
    'professional-development', 'other'
  )),
  target_date date,
  progress integer default 0 check (progress between 0 and 100),
  status text default 'in-progress' check (status in ('in-progress', 'completed', 'overdue')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.goals enable row level security;

create policy "Match members can view goals"
  on public.goals for select
  using (public.is_match_member(match_id));

create policy "Match members can create goals"
  on public.goals for insert
  with check (
    auth.uid() = created_by
    and public.is_match_member(match_id)
  );

create policy "Match members can update goals"
  on public.goals for update
  using (public.is_match_member(match_id));

create policy "Creator can delete goals"
  on public.goals for delete
  using (auth.uid() = created_by);

create index idx_goals_match on public.goals(match_id);
create index idx_goals_status on public.goals(status);


-- ============================================================
-- 9. GOAL MILESTONES TABLE
--    Steps / milestones within a goal
-- ============================================================
create table public.goal_milestones (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  completed_at timestamptz,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.goal_milestones enable row level security;

-- Inherit access from parent goal via match membership
create policy "Match members can view goal milestones"
  on public.goal_milestones for select
  using (
    exists (
      select 1 from public.goals g
      where g.id = goal_milestones.goal_id
      and public.is_match_member(g.match_id)
    )
  );

create policy "Match members can create goal milestones"
  on public.goal_milestones for insert
  with check (
    exists (
      select 1 from public.goals g
      where g.id = goal_milestones.goal_id
      and public.is_match_member(g.match_id)
    )
  );

create policy "Match members can update goal milestones"
  on public.goal_milestones for update
  using (
    exists (
      select 1 from public.goals g
      where g.id = goal_milestones.goal_id
      and public.is_match_member(g.match_id)
    )
  );

create policy "Match members can delete goal milestones"
  on public.goal_milestones for delete
  using (
    exists (
      select 1 from public.goals g
      where g.id = goal_milestones.goal_id
      and public.is_match_member(g.match_id)
    )
  );

create index idx_goal_milestones_goal on public.goal_milestones(goal_id, sort_order);


-- ============================================================
-- 10. SESSION NOTES TABLE
--     Notes taken during or after mentoring sessions (Notes.tsx)
--     Uses arrays/jsonb for topics, takeaways, action items
-- ============================================================
create table public.session_notes (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  created_by uuid references public.profiles(id) on delete set null not null,
  session_date date not null,
  session_type text check (session_type in ('video', 'chat')),
  duration_minutes integer,
  topics text[] default '{}',
  summary text,
  key_takeaways text[] default '{}',
  action_items jsonb default '[]'::jsonb,
  -- action_items format: [{"text": "...", "completed": false}]
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.session_notes enable row level security;

create policy "Match members can view session notes"
  on public.session_notes for select
  using (public.is_match_member(match_id));

create policy "Match members can create session notes"
  on public.session_notes for insert
  with check (
    auth.uid() = created_by
    and public.is_match_member(match_id)
  );

create policy "Creator can update their notes"
  on public.session_notes for update
  using (auth.uid() = created_by);

create policy "Creator can delete their notes"
  on public.session_notes for delete
  using (auth.uid() = created_by);

create index idx_session_notes_match on public.session_notes(match_id, session_date desc);


-- ============================================================
-- 11. GUIDED PROMPT CATEGORIES TABLE
--     Categories for conversation starters (GuidedPrompts.tsx)
-- ============================================================
create table public.guided_prompt_categories (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  label text not null,
  icon_name text,
  color text,
  bg_color text,
  sort_order integer default 0
);

alter table public.guided_prompt_categories enable row level security;

create policy "Authenticated users can view prompt categories"
  on public.guided_prompt_categories for select
  using (auth.uid() is not null);


-- ============================================================
-- 12. GUIDED PROMPTS TABLE
--     Individual conversation prompts
-- ============================================================
create table public.guided_prompts (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.guided_prompt_categories(id) on delete cascade not null,
  prompt_text text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.guided_prompts enable row level security;

create policy "Authenticated users can view prompts"
  on public.guided_prompts for select
  using (auth.uid() is not null);


-- ============================================================
-- 13. ACHIEVEMENTS TABLE
--     Badges / milestones earned by users (Portal dashboard)
-- ============================================================
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_key text not null,
  -- e.g. first_week, great_communicator, goal_setter, face_time_pro, etc.
  title text not null,
  description text,
  earned_at timestamptz default now(),
  unique(user_id, achievement_key)
);

alter table public.achievements enable row level security;

create policy "Users can view their own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);

-- Allow match partner to see achievements too (for dashboard)
create policy "Matched partners can view achievements"
  on public.achievements for select
  using (
    exists (
      select 1 from public.matches
      where status in ('pending', 'active')
      and (
        (mentor_id = auth.uid() and novice_id = achievements.user_id)
        or (novice_id = auth.uid() and mentor_id = achievements.user_id)
      )
    )
  );

-- System inserts achievements (via API / edge functions)
create policy "System can insert achievements"
  on public.achievements for insert
  with check (auth.uid() = user_id);

create index idx_achievements_user on public.achievements(user_id);


-- ============================================================
-- 14. MATCH REQUESTS TABLE
--     Request a new match / rematch (Profile.tsx)
-- ============================================================
create table public.match_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  current_match_id uuid references public.matches(id) on delete set null,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'approved', 'denied')),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.match_requests enable row level security;

create policy "Users can view their own match requests"
  on public.match_requests for select
  using (auth.uid() = user_id);

create policy "Users can submit match requests"
  on public.match_requests for insert
  with check (auth.uid() = user_id);

create index idx_match_requests_user on public.match_requests(user_id);
create index idx_match_requests_status on public.match_requests(status);


-- ============================================================
-- 15. NOTIFICATION PREFERENCES TABLE
--     Per-user notification settings (Profile.tsx)
-- ============================================================
create table public.notification_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  email_notifications boolean default true,
  session_reminders boolean default true,
  weekly_progress boolean default true,
  sos_alerts boolean default true,
  updated_at timestamptz default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users can view their own notification preferences"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their notification preferences"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their notification preferences"
  on public.notification_preferences for update
  using (auth.uid() = user_id);


-- ============================================================
-- 16. PARTNERSHIP STATS TABLE
--     Aggregated statistics for the dashboard (Portal.tsx)
-- ============================================================
create table public.partnership_stats (
  match_id uuid references public.matches(id) on delete cascade primary key,
  total_messages integer default 0,
  total_video_calls integer default 0,
  total_video_minutes integer default 0,
  total_files_shared integer default 0,
  total_sessions_completed integer default 0,
  total_goals_completed integer default 0,
  current_streak_weeks integer default 0,
  longest_streak_weeks integer default 0,
  last_activity_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.partnership_stats enable row level security;

create policy "Match members can view partnership stats"
  on public.partnership_stats for select
  using (public.is_match_member(match_id));

-- Stats are updated by triggers / edge functions
create policy "Match members can update partnership stats"
  on public.partnership_stats for update
  using (public.is_match_member(match_id));

create policy "System can insert partnership stats"
  on public.partnership_stats for insert
  with check (public.is_match_member(match_id));


-- ============================================================
-- 17. AUTO-UPDATE TIMESTAMPS
--     Add updated_at triggers for all new tables that have it
-- ============================================================
create trigger resources_updated_at
  before update on public.resources
  for each row execute function public.update_updated_at();

create trigger scheduled_sessions_updated_at
  before update on public.scheduled_sessions
  for each row execute function public.update_updated_at();

create trigger goals_updated_at
  before update on public.goals
  for each row execute function public.update_updated_at();

create trigger session_notes_updated_at
  before update on public.session_notes
  for each row execute function public.update_updated_at();

create trigger notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute function public.update_updated_at();

create trigger partnership_stats_updated_at
  before update on public.partnership_stats
  for each row execute function public.update_updated_at();


-- ============================================================
-- 18. AUTO-CREATE PARTNERSHIP STATS ON NEW MATCH
-- ============================================================
create or replace function public.handle_new_match()
returns trigger as $$
begin
  insert into public.partnership_stats (match_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_match_created
  after insert on public.matches
  for each row execute function public.handle_new_match();


-- ============================================================
-- 19. AUTO-CREATE NOTIFICATION PREFERENCES ON NEW USER
-- ============================================================
create or replace function public.handle_new_profile_defaults()
returns trigger as $$
begin
  insert into public.notification_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_defaults
  after insert on public.profiles
  for each row execute function public.handle_new_profile_defaults();


-- ============================================================
-- 20. INCREMENT STATS TRIGGERS
--     Automatically update partnership_stats when data changes
-- ============================================================

-- Increment message count on new message
create or replace function public.increment_message_count()
returns trigger as $$
begin
  update public.partnership_stats
  set total_messages = total_messages + 1,
      last_activity_at = now()
  where match_id = new.match_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_message_sent
  after insert on public.messages
  for each row execute function public.increment_message_count();

-- Increment video call count when a session ends
create or replace function public.increment_video_count()
returns trigger as $$
begin
  if new.status = 'ended' and old.status != 'ended' then
    update public.partnership_stats
    set total_video_calls = total_video_calls + 1,
        total_video_minutes = total_video_minutes + coalesce(new.duration_seconds / 60, 0),
        last_activity_at = now()
    where match_id = new.match_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_video_session_ended
  after update on public.video_sessions
  for each row execute function public.increment_video_count();

-- Increment file count on upload
create or replace function public.increment_file_count()
returns trigger as $$
begin
  update public.partnership_stats
  set total_files_shared = total_files_shared + 1,
      last_activity_at = now()
  where match_id = new.match_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_file_uploaded
  after insert on public.shared_files
  for each row execute function public.increment_file_count();

-- Increment goal completed count
create or replace function public.increment_goal_completed()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.partnership_stats
    set total_goals_completed = total_goals_completed + 1,
        last_activity_at = now()
    where match_id = new.match_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_goal_completed
  after update on public.goals
  for each row execute function public.increment_goal_completed();


-- ============================================================
-- 21. SEED GUIDED PROMPTS (system content)
--     Pre-populate the prompt categories and prompts
-- ============================================================
insert into public.guided_prompt_categories (key, label, icon_name, color, bg_color, sort_order) values
  ('icebreakers',      'Icebreakers',         'Sparkles',     'text-pink-600',   'bg-pink-50',   1),
  ('classroom',        'Classroom Talk',      'BookOpen',     'text-blue-600',   'bg-blue-50',   2),
  ('growth',           'Growth & Goals',      'Target',       'text-green-600',  'bg-green-50',  3),
  ('wellbeing',        'Well-being',          'Heart',        'text-red-600',    'bg-red-50',    4),
  ('reflection',       'Reflection',          'MessageCircle','text-purple-600', 'bg-purple-50', 5);

insert into public.guided_prompts (category_id, prompt_text, sort_order) values
  ((select id from public.guided_prompt_categories where key = 'icebreakers'), 'What''s one thing that happened this week that made you smile?', 1),
  ((select id from public.guided_prompt_categories where key = 'icebreakers'), 'If you could teach any subject for a day, what would it be?', 2),
  ((select id from public.guided_prompt_categories where key = 'icebreakers'), 'What''s your favorite part of the school day and why?', 3),
  ((select id from public.guided_prompt_categories where key = 'classroom'),   'What classroom management strategy has worked best for you lately?', 1),
  ((select id from public.guided_prompt_categories where key = 'classroom'),   'How do you handle a student who seems disengaged?', 2),
  ((select id from public.guided_prompt_categories where key = 'classroom'),   'What''s one lesson that didn''t go as planned? What did you learn?', 3),
  ((select id from public.guided_prompt_categories where key = 'growth'),      'What''s one professional goal you''re working toward this semester?', 1),
  ((select id from public.guided_prompt_categories where key = 'growth'),      'What skill do you most want to develop as a teacher?', 2),
  ((select id from public.guided_prompt_categories where key = 'growth'),      'How do you measure your own growth as an educator?', 3),
  ((select id from public.guided_prompt_categories where key = 'wellbeing'),   'How are you really doing this week? (No teacher-brave-face required!)', 1),
  ((select id from public.guided_prompt_categories where key = 'wellbeing'),   'What do you do to recharge after a tough day?', 2),
  ((select id from public.guided_prompt_categories where key = 'wellbeing'),   'What boundaries have you set (or want to set) to protect your energy?', 3),
  ((select id from public.guided_prompt_categories where key = 'reflection'),  'What''s one thing you''d tell your first-year-teacher self?', 1),
  ((select id from public.guided_prompt_categories where key = 'reflection'),  'Describe a moment when you knew you made a difference for a student.', 2),
  ((select id from public.guided_prompt_categories where key = 'reflection'),  'What teaching moment are you most proud of this year?', 3);


-- ============================================================
-- 22. SEED DEFAULT RESOURCES (system content)
--     Pre-populate the resource library
-- ============================================================
insert into public.resources (title, description, type, category, url, is_featured, is_new) values
  ('Classroom Management 101',    'Essential strategies for maintaining an effective learning environment.',           'guide',    'Classroom Management', null, true,  false),
  ('Differentiated Instruction',  'How to adapt your teaching to reach every learner in your classroom.',             'article',  'Instruction',          null, false, true),
  ('Building Student Rapport',    'Techniques for creating meaningful connections with your students.',                'video',    'Student Relationships', null, false, false),
  ('Formative Assessment Toolkit','Quick and effective ways to check student understanding during lessons.',           'template', 'Assessment',           null, true,  false),
  ('Parent Communication Guide',  'Best practices for keeping families informed and involved.',                        'guide',    'Communication',        null, false, true),
  ('New Teacher Survival Guide',  'Everything you need to know to thrive in your first year of teaching.',            'guide',    'Getting Started',      null, true,  true),
  ('Supporting Struggling Learners','Strategies for identifying and helping students who need extra support.',         'article',  'Student Support',      null, false, false),
  ('Teacher Self-Care Playbook',  'Practical tips for avoiding burnout and maintaining your passion for teaching.',    'guide',    'Self-Care',            null, false, true),
  ('Setting Up Your Classroom',   'A step-by-step guide to creating an organized, welcoming learning space.',         'template', 'Classroom Setup',      null, false, false),
  ('Data-Driven Instruction',     'Using student data to inform and improve your teaching practice.',                  'article',  'Instruction',          null, false, false);


-- ============================================================
-- 23. SUPABASE STORAGE BUCKET
--     Create a storage bucket for shared workspace files
--     (Run separately in Supabase Dashboard if not using CLI)
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('shared-files', 'shared-files', false);

-- Storage policies would be:
-- create policy "Match members can upload files"
--   on storage.objects for insert
--   with check (bucket_id = 'shared-files' and auth.uid() is not null);
--
-- create policy "Match members can view files"
--   on storage.objects for select
--   using (bucket_id = 'shared-files' and auth.uid() is not null);


-- ============================================================
-- 24. REALTIME SUBSCRIPTIONS
--     Enable realtime for tables that need live updates
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.video_sessions;
alter publication supabase_realtime add table public.scheduled_sessions;
alter publication supabase_realtime add table public.check_ins;
