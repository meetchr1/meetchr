-- Sprint 3: Peer help network

create table if not exists public.mentor_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  specialties text[] not null default '{}',
  availability_status text not null default 'available',
  response_time_estimate text not null default 'within_24h',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mentor_profiles enable row level security;

create policy "Users can view mentor profiles"
  on public.mentor_profiles for select
  using (auth.uid() is not null);

create policy "Users can insert own mentor profile"
  on public.mentor_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mentor profile"
  on public.mentor_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own mentor profile"
  on public.mentor_profiles for delete
  using (auth.uid() = user_id);

drop trigger if exists mentor_profiles_updated_at on public.mentor_profiles;
create trigger mentor_profiles_updated_at
  before update on public.mentor_profiles
  for each row execute function public.update_updated_at();

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  format text not null check (format in ('async', 'micro_session')),
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.help_requests enable row level security;

create policy "Requester can view own help requests"
  on public.help_requests for select
  using (auth.uid() = requester_id);

create policy "Requester can create own help requests"
  on public.help_requests for insert
  with check (auth.uid() = requester_id);

create policy "Requester can update own help requests"
  on public.help_requests for update
  using (auth.uid() = requester_id)
  with check (auth.uid() = requester_id);

create policy "Requester can delete own help requests"
  on public.help_requests for delete
  using (auth.uid() = requester_id);

drop trigger if exists help_requests_updated_at on public.help_requests;
create trigger help_requests_updated_at
  before update on public.help_requests
  for each row execute function public.update_updated_at();

-- Existing public.matches is used by mentorship matching, so peer-help uses peer_matches.
create table if not exists public.peer_matches (
  id uuid primary key default gen_random_uuid(),
  help_request_id uuid not null references public.help_requests(id) on delete cascade,
  matched_user_id uuid not null references public.profiles(id) on delete cascade,
  rank integer not null check (rank > 0),
  reason_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (help_request_id, matched_user_id)
);

alter table public.peer_matches enable row level security;

create policy "Requester can read own peer matches"
  on public.peer_matches for select
  using (
    exists (
      select 1
      from public.help_requests hr
      where hr.id = peer_matches.help_request_id
        and hr.requester_id = auth.uid()
    )
  );

create policy "Matched coaches can read their peer matches"
  on public.peer_matches for select
  using (matched_user_id = auth.uid());

create policy "Requester can insert peer matches for own requests"
  on public.peer_matches for insert
  with check (
    exists (
      select 1
      from public.help_requests hr
      where hr.id = peer_matches.help_request_id
        and hr.requester_id = auth.uid()
    )
  );

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

alter table public.conversation_participants enable row level security;

create policy "Participants can view conversation participants"
  on public.conversation_participants for select
  using (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "Users can add participants to own peer conversations"
  on public.conversation_participants for insert
  with check (
    auth.uid() = user_id
    or exists (
      select 1
      from public.conversations c
      where c.id = conversation_participants.conversation_id
        and c.owner_id = auth.uid()
        and c.provider = 'peer'
    )
  );

create policy "Participants can remove themselves"
  on public.conversation_participants for delete
  using (auth.uid() = user_id);

-- Keep existing owner-based policies; add participant access for peer conversations.
create policy "Participants can read peer conversations"
  on public.conversations for select
  using (
    provider = 'peer'
    and exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = conversations.id
        and cp.user_id = auth.uid()
    )
  );

create policy "Participants can update peer conversations"
  on public.conversations for update
  using (
    provider = 'peer'
    and exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = conversations.id
        and cp.user_id = auth.uid()
    )
  )
  with check (
    provider = 'peer'
    and exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = conversations.id
        and cp.user_id = auth.uid()
    )
  );

create table if not exists public.peer_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  content_type text not null default 'text',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.peer_messages enable row level security;

create policy "Participants can read peer messages"
  on public.peer_messages for select
  using (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = peer_messages.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "Participants can send peer messages"
  on public.peer_messages for insert
  with check (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = peer_messages.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "Participants can update peer messages"
  on public.peer_messages for update
  using (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = peer_messages.conversation_id
        and cp.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = peer_messages.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "Participants can delete peer messages"
  on public.peer_messages for delete
  using (
    exists (
      select 1
      from public.conversation_participants cp
      where cp.conversation_id = peer_messages.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create index if not exists idx_help_requests_requester_status
  on public.help_requests(requester_id, status, created_at desc);

create index if not exists idx_peer_matches_help_request_rank
  on public.peer_matches(help_request_id, rank asc);

create index if not exists idx_peer_messages_conversation_created
  on public.peer_messages(conversation_id, created_at asc);

create index if not exists idx_mentor_profiles_specialties
  on public.mentor_profiles using gin(specialties);
