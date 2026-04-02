-- Solar Webapp Database Schema for Supabase
-- Run these in the Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists projects (
  id text primary key,
  customer text not null,
  city text,
  size text,
  status text,
  progress int default 0,
  value numeric default 0,
  expenses numeric default 0,
  start_date text,
  created_at timestamptz default now()
);

create table if not exists quotations (
  id text primary key,
  customer text not null,
  city text,
  size text,
  date text,
  status text default 'Sent',
  total text,
  created_at timestamptz default now()
);

create table if not exists amc_contracts (
  id text primary key,
  customer text not null,
  city text,
  size text,
  phone text,
  last_service text,
  next_service text,
  status text default 'Active',
  created_at timestamptz default now()
);

create table if not exists inventory_items (
  id text primary key,
  name text not null,
  category text,
  stock int default 0,
  unit text default 'Nos',
  min_stock int default 0,
  price numeric default 0,
  created_at timestamptz default now()
);

create table if not exists reminders (
  id text primary key,
  type text not null,
  customer text,
  date text,
  notes text,
  status text default 'Pending',
  created_at timestamptz default now()
);

create table if not exists finance_data (
  id text primary key,
  name text,
  month text,
  revenue numeric default 0,
  expenses numeric default 0,
  profit numeric default 0,
  created_at timestamptz default now()
);

create table if not exists gallery_images (
  id text primary key,
  url text not null,
  category text,
  title text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional but recommended)
-- alter table projects enable row level security;
-- alter table quotations enable row level security;
-- etc.
