create table if not exists public.test_feedback (
  id uuid primary key default gen_random_uuid(),
  tester_name text not null,
  page_label text not null,
  feedback_type text not null,
  priority text not null,
  device text,
  browser text,
  summary text not null,
  details text not null,
  expected_result text,
  suggested_fix text,
  created_at timestamptz not null default now()
);

create index if not exists test_feedback_created_at_idx on public.test_feedback(created_at desc);
