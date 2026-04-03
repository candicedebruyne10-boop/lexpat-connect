create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  job_offer_id uuid not null references public.job_offers(id) on delete cascade,
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  score integer not null default 0 check (score >= 0 and score <= 100),
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_offer_id, worker_profile_id)
);

create index if not exists matches_job_offer_id_idx on public.matches(job_offer_id);
create index if not exists matches_worker_profile_id_idx on public.matches(worker_profile_id);
create index if not exists matches_score_idx on public.matches(score desc);

create or replace function public.set_matches_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_matches on public.matches;

create trigger set_updated_at_matches
before update on public.matches
for each row execute procedure public.set_matches_updated_at();

