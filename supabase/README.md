# Supabase structure for LEXPAT Connect

This folder contains the first database foundation for the platform.

## Files

- `001_initial_schema.sql`: initial schema for workers, employers, job offers, applications, legal referrals, and worker documents.

## Product logic covered

### Worker side

- One authenticated user can own one `worker_profile`
- A worker profile stores the main candidate information
- CV details are stored in `worker_cv_items`
- Uploaded files are stored in `worker_documents`

### Employer side

- One employer organization is stored in `employer_profiles`
- Several authenticated users can belong to the same employer through `employer_members`
- The owner can manage the company profile and membership
- Job postings are stored in `job_offers`

### Matching and follow-up

- Applications are stored in `job_applications`
- A legal handoff can be tracked in `legal_referrals`

## Recommended next implementation order

1. Add Supabase auth
2. Create a worker profile automatically after worker sign-up
3. Create an employer profile + owner membership after employer sign-up
4. Save the current worker and employer spaces into the corresponding tables
5. Add upload support for worker CV documents
6. Add the first real job offer create/edit flow

## Environment variables

Use these variables in Vercel and in local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The current `.env.example` can expose both old and new names during transition if needed.
