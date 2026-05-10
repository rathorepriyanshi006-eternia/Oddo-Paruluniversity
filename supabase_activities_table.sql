-- Run this in your Supabase SQL Editor

create table public.activities (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day text not null default 'Day 1',
  type text not null default 'sightseeing',
  title text not null,
  time text default 'TBD',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- No RLS for now (development mode)
alter table public.activities disable row level security;
