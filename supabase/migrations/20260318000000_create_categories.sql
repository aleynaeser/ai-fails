create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into public.categories (name)
values
  ('Ethical Violation'),
  ('Faulty Operation'),
  ('Security Vulnerability'),
  ('Systematic Error'),
  ('Data Corruption'),
  ('Operation Errors'),
  ('User Errors'),
  ('Request-Oriented Operation'),
  ('Other')
on conflict (name) do nothing;
