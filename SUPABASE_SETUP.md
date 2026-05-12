
# PROBO LAW FIRM - Supabase Setup

To complete the transfer to Supabase, you must run the following SQL in your Supabase SQL Editor:

```sql
-- Create Agents Table
create table public.agents (
  id text primary key,
  name text not null,
  role text,
  team text,
  vortex_injected boolean default true,
  last_trained timestamp with time zone default now(),
  status text default 'Active'
);

-- Create Dossiers Table
create table public.dossiers (
  id text primary key,
  title text not null,
  case_type text,
  jurisdiction text,
  description text,
  report text,
  status text default 'Complete',
  payment_committed boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Optional for now, but recommended for production)
-- For testing, you can allow all access:
alter table public.agents enable row level security;
create policy "Allow public access" on public.agents for all using (true);

alter table public.dossiers enable row level security;
create policy "Allow public access" on public.dossiers for all using (true);
```
