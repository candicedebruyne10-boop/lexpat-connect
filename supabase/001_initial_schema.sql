create extension if not exists pgcrypto;

create type public.app_role as enum ('worker', 'employer', 'admin');
create type public.profile_visibility as enum ('visible', 'review', 'hidden');
create type public.region_code as enum ('brussels', 'wallonia', 'flanders', 'multi_region');
create type public.offer_status as enum ('draft', 'review', 'published', 'paused', 'closed');
create type public.application_status as enum ('submitted', 'reviewing', 'shortlisted', 'contacted', 'rejected', 'hired');
create type public.cv_item_type as enum ('education', 'experience', 'certificate', 'skill');

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  birth_date date,
  gender text,
  phone text,
  email text,
  country_of_residence text,
  preferred_region public.region_code,
  preferred_city text,
  target_sector text,
  target_job text,
  target_job_other text,
  availability text,
  languages text[] not null default '{}',
  admin_status text,
  salary_expectation text,
  experience_level text,
  qualification text,
  profile_visibility public.profile_visibility not null default 'review',
  headline text,
  summary text,
  linkedin_url text,
  other_link_url text,
  address text,
  current_location text,
  profile_completion integer not null default 0 check (profile_completion >= 0 and profile_completion <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worker_cv_items (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  item_type public.cv_item_type not null,
  title text not null,
  organization text,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worker_documents (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  storage_path text not null unique,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table public.employer_profiles (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_slug text unique,
  sector text,
  company_website text,
  company_description text,
  company_size text,
  region public.region_code,
  location text,
  languages_required text[] not null default '{}',
  profile_completion integer not null default 0 check (profile_completion >= 0 and profile_completion <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employer_members (
  id uuid primary key default gen_random_uuid(),
  employer_profile_id uuid not null references public.employer_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  work_email text,
  phone text,
  role_label text,
  is_owner boolean not null default false,
  created_at timestamptz not null default now(),
  unique (employer_profile_id, user_id)
);

create table public.job_offers (
  id uuid primary key default gen_random_uuid(),
  employer_profile_id uuid not null references public.employer_profiles(id) on delete cascade,
  title text not null,
  region public.region_code,
  city text,
  sector text,
  shortage_job text,
  shortage_job_other text,
  contract_type text,
  weekly_hours text,
  urgency text,
  missions text,
  requirements text,
  salary_range text,
  status public.offer_status not null default 'draft',
  legal_attention_needed boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_offer_id uuid not null references public.job_offers(id) on delete cascade,
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  status public.application_status not null default 'submitted',
  cover_note text,
  employer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_offer_id, worker_profile_id)
);

create table public.legal_referrals (
  id uuid primary key default gen_random_uuid(),
  referral_type text not null,
  employer_profile_id uuid references public.employer_profiles(id) on delete set null,
  worker_profile_id uuid references public.worker_profiles(id) on delete set null,
  job_offer_id uuid references public.job_offers(id) on delete set null,
  application_id uuid references public.job_applications(id) on delete set null,
  reason text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_user_roles
before update on public.user_roles
for each row execute procedure public.set_updated_at();

create trigger set_updated_at_worker_profiles
before update on public.worker_profiles
for each row execute procedure public.set_updated_at();

create trigger set_updated_at_worker_cv_items
before update on public.worker_cv_items
for each row execute procedure public.set_updated_at();

create trigger set_updated_at_employer_profiles
before update on public.employer_profiles
for each row execute procedure public.set_updated_at();

create trigger set_updated_at_job_offers
before update on public.job_offers
for each row execute procedure public.set_updated_at();

create trigger set_updated_at_job_applications
before update on public.job_applications
for each row execute procedure public.set_updated_at();

create index worker_profiles_user_id_idx on public.worker_profiles(user_id);
create index worker_cv_items_worker_profile_id_idx on public.worker_cv_items(worker_profile_id, item_type);
create index worker_documents_worker_profile_id_idx on public.worker_documents(worker_profile_id);
create index employer_members_user_id_idx on public.employer_members(user_id);
create index employer_members_employer_profile_id_idx on public.employer_members(employer_profile_id);
create index job_offers_employer_profile_id_idx on public.job_offers(employer_profile_id, status);
create index job_applications_offer_id_idx on public.job_applications(job_offer_id, status);
create index job_applications_worker_profile_id_idx on public.job_applications(worker_profile_id, status);
create index legal_referrals_created_at_idx on public.legal_referrals(created_at desc);

alter table public.user_roles enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.worker_cv_items enable row level security;
alter table public.worker_documents enable row level security;
alter table public.employer_profiles enable row level security;
alter table public.employer_members enable row level security;
alter table public.job_offers enable row level security;
alter table public.job_applications enable row level security;
alter table public.legal_referrals enable row level security;

create policy "users manage their own role row"
on public.user_roles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "workers manage their own profile"
on public.worker_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "workers manage their cv items"
on public.worker_cv_items
for all
using (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
);

create policy "workers manage their documents"
on public.worker_documents
for all
using (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
);

create policy "employer members can view employer profile"
on public.employer_profiles
for select
using (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = id
      and em.user_id = auth.uid()
  )
);

create policy "employer owners can update employer profile"
on public.employer_profiles
for update
using (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = id
      and em.user_id = auth.uid()
      and em.is_owner = true
  )
)
with check (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = id
      and em.user_id = auth.uid()
      and em.is_owner = true
  )
);

create policy "users see their employer memberships"
on public.employer_members
for select
using (auth.uid() = user_id);

create policy "employer owners manage memberships"
on public.employer_members
for all
using (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = employer_profile_id
      and em.user_id = auth.uid()
      and em.is_owner = true
  )
)
with check (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = employer_profile_id
      and em.user_id = auth.uid()
      and em.is_owner = true
  )
);

create policy "employer members manage offers"
on public.job_offers
for all
using (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = employer_profile_id
      and em.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = employer_profile_id
      and em.user_id = auth.uid()
  )
);

create policy "workers can see published offers"
on public.job_offers
for select
using (status = 'published');

create policy "workers manage their own applications"
on public.job_applications
for all
using (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
);

create policy "employer members view applications on their offers"
on public.job_applications
for select
using (
  exists (
    select 1
    from public.job_offers jo
    join public.employer_members em on em.employer_profile_id = jo.employer_profile_id
    where jo.id = job_offer_id
      and em.user_id = auth.uid()
  )
);

create policy "employer members update applications on their offers"
on public.job_applications
for update
using (
  exists (
    select 1
    from public.job_offers jo
    join public.employer_members em on em.employer_profile_id = jo.employer_profile_id
    where jo.id = job_offer_id
      and em.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.job_offers jo
    join public.employer_members em on em.employer_profile_id = jo.employer_profile_id
    where jo.id = job_offer_id
      and em.user_id = auth.uid()
  )
);

create policy "only linked users can view legal referrals"
on public.legal_referrals
for select
using (
  exists (
    select 1
    from public.employer_members em
    where em.employer_profile_id = employer_profile_id
      and em.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_profile_id
      and wp.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('worker-documents', 'worker-documents', false)
on conflict (id) do nothing;

create policy "workers upload their own documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "workers read their own documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "workers delete their own documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
