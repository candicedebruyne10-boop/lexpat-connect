alter table public.test_feedback enable row level security;

-- No direct client access is needed for this table.
-- Inserts are performed server-side through the API route using the service role.

revoke all on public.test_feedback from anon;
revoke all on public.test_feedback from authenticated;

