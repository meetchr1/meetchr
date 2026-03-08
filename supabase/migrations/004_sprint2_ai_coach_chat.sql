-- Sprint 2: AI coach chat

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('ai', 'peer')),
  status text not null default 'active',
  last_message_at timestamptz not null default now(),
  coach_summary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Users can view their own conversations"
  on public.conversations for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own conversations"
  on public.conversations for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own conversations"
  on public.conversations for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete their own conversations"
  on public.conversations for delete
  using (auth.uid() = owner_id);

create index if not exists idx_conversations_owner_last_message
  on public.conversations(owner_id, last_message_at desc);

drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
  before update on public.conversations
  for each row execute function public.update_updated_at();

-- NOTE: public.messages already exists in this repo for mentor/peer chat.
-- Sprint 2 AI coach messages are stored in public.coach_messages.
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  content_type text not null default 'text',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.coach_messages enable row level security;

create policy "Users can view coach messages in their conversations"
  on public.coach_messages for select
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = coach_messages.conversation_id
        and c.owner_id = auth.uid()
    )
  );

create policy "Users can insert coach messages in their conversations"
  on public.coach_messages for insert
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = coach_messages.conversation_id
        and c.owner_id = auth.uid()
    )
  );

create policy "Users can update coach messages in their conversations"
  on public.coach_messages for update
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = coach_messages.conversation_id
        and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = coach_messages.conversation_id
        and c.owner_id = auth.uid()
    )
  );

create policy "Users can delete coach messages in their conversations"
  on public.coach_messages for delete
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = coach_messages.conversation_id
        and c.owner_id = auth.uid()
    )
  );

create index if not exists idx_coach_messages_conversation_created
  on public.coach_messages(conversation_id, created_at asc);
