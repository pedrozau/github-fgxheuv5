-- Create subscriptions table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  store_id uuid references stores(id) not null,
  plan_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due')),
  current_period_end timestamp with time zone not null,
  unique(store_id)
);

-- Enable RLS for subscriptions
alter table subscriptions enable row level security;

-- Subscriptions policies
create policy "Store owners can read their subscriptions"
  on subscriptions for select
  using (
    exists (
      select 1 from stores s
      where s.user_id = auth.uid()
      and s.id = subscriptions.store_id
    )
  );

create policy "Store owners can manage their subscriptions"
  on subscriptions for all
  using (
    exists (
      select 1 from stores s
      where s.user_id = auth.uid()
      and s.id = subscriptions.store_id
    )
  );