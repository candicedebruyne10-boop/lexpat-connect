-- ═══════════════════════════════════════════════════════════════════════════
-- LEXPAT Connect — Migration 004 : Messagerie
-- Tables : conversations, messages, conversation_actions
-- Règle : une conversation ne s'ouvre que si les deux parties ont validé
--         (match.status = 'contacted')
-- ═══════════════════════════════════════════════════════════════════════════

-- ── conversations ───────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  match_id      uuid not null unique references public.matches(id) on delete cascade,
  employer_id   uuid not null references public.employer_profiles(id) on delete cascade,
  worker_id     uuid not null references public.worker_profiles(id) on delete cascade,
  status        text not null default 'match_confirmed'
                  check (status in (
                    'match_confirmed',
                    'first_message_sent',
                    'discussion_active',
                    'interview_requested',
                    'legal_review_needed',
                    'closed'
                  )),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists conversations_employer_id_idx on public.conversations(employer_id);
create index if not exists conversations_worker_id_idx   on public.conversations(worker_id);
create index if not exists conversations_match_id_idx    on public.conversations(match_id);

-- ── messages ────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type     text not null check (sender_type in ('employer', 'worker')),
  sender_id       uuid not null,   -- employer_profile_id or worker_profile_id
  content         text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages(conversation_id, created_at);

-- ── conversation_actions ────────────────────────────────────────────────────
create table if not exists public.conversation_actions (
  conversation_id      uuid primary key references public.conversations(id) on delete cascade,
  legal_review_needed  boolean not null default false,
  interview_requested  boolean not null default false,
  archived             boolean not null default false,
  updated_at           timestamptz not null default now()
);

-- ── updated_at triggers ─────────────────────────────────────────────────────
create or replace function public.set_conversations_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists set_updated_at_conversations on public.conversations;
create trigger set_updated_at_conversations
  before update on public.conversations
  for each row execute procedure public.set_conversations_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.conversations      enable row level security;
alter table public.messages           enable row level security;
alter table public.conversation_actions enable row level security;

-- Conversations : visible par l'employeur ET le travailleur du match
create policy "conversation participants can view"
  on public.conversations for select
  using (
    exists (
      select 1 from public.employer_members em
      where em.employer_profile_id = employer_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

create policy "conversation participants can insert"
  on public.conversations for insert
  with check (
    exists (
      select 1 from public.employer_members em
      where em.employer_profile_id = employer_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

create policy "conversation participants can update"
  on public.conversations for update
  using (
    exists (
      select 1 from public.employer_members em
      where em.employer_profile_id = employer_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

-- Messages : visible par les participants de la conversation
create policy "message participants can view"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      join public.employer_members em on em.employer_profile_id = c.employer_id
      where c.id = conversation_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.conversations c
      join public.worker_profiles wp on wp.id = c.worker_id
      where c.id = conversation_id and wp.user_id = auth.uid()
    )
  );

create policy "message participants can insert"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      join public.employer_members em on em.employer_profile_id = c.employer_id
      where c.id = conversation_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.conversations c
      join public.worker_profiles wp on wp.id = c.worker_id
      where c.id = conversation_id and wp.user_id = auth.uid()
    )
  );

create policy "message participants can update read status"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      join public.employer_members em on em.employer_profile_id = c.employer_id
      where c.id = conversation_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.conversations c
      join public.worker_profiles wp on wp.id = c.worker_id
      where c.id = conversation_id and wp.user_id = auth.uid()
    )
  );

-- conversation_actions : mêmes droits
create policy "actions participants can manage"
  on public.conversation_actions for all
  using (
    exists (
      select 1 from public.conversations c
      join public.employer_members em on em.employer_profile_id = c.employer_id
      where c.id = conversation_id and em.user_id = auth.uid()
    )
    or exists (
      select 1 from public.conversations c
      join public.worker_profiles wp on wp.id = c.worker_id
      where c.id = conversation_id and wp.user_id = auth.uid()
    )
  );
