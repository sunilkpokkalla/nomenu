alter table public.menu_items 
add column if not exists pending_ai_image boolean default false;

create table if not exists public.ai_image_jobs (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  menu_id uuid references public.menus(id) on delete cascade,
  status text not null default 'pending_payment', -- pending_payment, paid, processing, completed, failed
  total_items int not null,
  amount_cents int not null,
  created_at timestamp default now()
);

alter table public.ai_image_jobs enable row level security;

drop policy if exists "Owners can view their ai image jobs" on public.ai_image_jobs;
create policy "Owners can view their ai image jobs"
  on public.ai_image_jobs for select
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = ai_image_jobs.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

-- Only admins/service role can insert or update ai_image_jobs
