-- create extension if not exists pgcrypto; -- Not needed in Postgres 13+ as gen_random_uuid() is built-in.

create table if not exists public.restaurants (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users,
  name text not null,
  logo_url text,
  cover_image_url text,
  cuisine_type text,
  address text,
  phone text,
  wifi_password text,
  currency text default 'USD',
  primary_color text default '#2563EB',
  accent_color text default '#F59E0B',
  plan text default 'free',
  subscription_status text default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp default now()
);

create table if not exists public.menus (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  schedule_type text default 'always',
  schedule_start time,
  schedule_end time,
  created_at timestamp default now()
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  menu_id uuid references public.menus(id) on delete cascade,
  name text not null,
  description text,
  sort_order int default 0
);

create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id),
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  is_available boolean default true,
  is_popular boolean default false,
  is_vegetarian boolean default false,
  is_vegan boolean default false,
  is_gluten_free boolean default false,
  is_spicy boolean default false,
  allergens text[],
  calories int,
  sort_order int default 0,
  created_at timestamp default now()
);

create table if not exists public.qr_codes (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id),
  menu_id uuid references public.menus(id),
  label text,
  scan_count int default 0,
  created_at timestamp default now()
);

create table if not exists public.menu_scans (
  id uuid default gen_random_uuid() primary key,
  qr_code_id uuid references public.qr_codes(id),
  restaurant_id uuid references public.restaurants(id),
  scanned_at timestamp default now(),
  device_type text,
  country text
);

alter table public.restaurants enable row level security;
alter table public.menus enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.qr_codes enable row level security;
alter table public.menu_scans enable row level security;

create policy "Owners can manage restaurants"
  on public.restaurants for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can manage menus"
  on public.menus for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menus.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menus.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners can manage categories"
  on public.categories for all
  using (
    exists (
      select 1
      from public.menus
      join public.restaurants on restaurants.id = menus.restaurant_id
      where menus.id = categories.menu_id
      and restaurants.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.menus
      join public.restaurants on restaurants.id = menus.restaurant_id
      where menus.id = categories.menu_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners can manage menu items"
  on public.menu_items for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menu_items.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menu_items.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners can manage QR codes"
  on public.qr_codes for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = qr_codes.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.restaurants
      where restaurants.id = qr_codes.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners can read menu scans"
  on public.menu_scans for select
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menu_scans.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Public can read active menus"
  on public.menus for select
  using (is_active = true);

create policy "Public can read menu categories"
  on public.categories for select
  using (
    exists (
      select 1 from public.menus
      where menus.id = categories.menu_id
      and menus.is_active = true
    )
  );

create policy "Public can read available menu items"
  on public.menu_items for select
  using (is_available = true);

create policy "Public can read restaurant branding"
  on public.restaurants for select
  using (true);

create policy "Public can insert scan analytics"
  on public.menu_scans for insert
  with check (true);
