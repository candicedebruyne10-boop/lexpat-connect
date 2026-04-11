create table if not exists public.match_notification_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  recipient_role text not null check (recipient_role in ('worker', 'employer')),
  notification_type text not null check (notification_type in ('worker_new_offers', 'employer_new_talents')),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  related_count integer not null default 1 check (related_count >= 0),
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz not null default now()
);

create index if not exists match_notification_logs_recipient_type_idx
  on public.match_notification_logs(recipient_email, notification_type, sent_at desc);
