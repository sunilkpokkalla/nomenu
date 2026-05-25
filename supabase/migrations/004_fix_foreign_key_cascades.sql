-- Drop restrictive foreign keys and recreate them with ON DELETE CASCADE

-- 1. Fix foreign key constraints on public.qr_codes
alter table public.qr_codes
  drop constraint if exists qr_codes_menu_id_fkey,
  add constraint qr_codes_menu_id_fkey
    foreign key (menu_id)
    references public.menus(id)
    on delete cascade;

alter table public.qr_codes
  drop constraint if exists qr_codes_restaurant_id_fkey,
  add constraint qr_codes_restaurant_id_fkey
    foreign key (restaurant_id)
    references public.restaurants(id)
    on delete cascade;

-- 2. Fix foreign key constraints on public.menu_items
alter table public.menu_items
  drop constraint if exists menu_items_restaurant_id_fkey,
  add constraint menu_items_restaurant_id_fkey
    foreign key (restaurant_id)
    references public.restaurants(id)
    on delete cascade;

-- 3. Fix foreign key constraints on public.menu_scans
alter table public.menu_scans
  drop constraint if exists menu_scans_qr_code_id_fkey,
  add constraint menu_scans_qr_code_id_fkey
    foreign key (qr_code_id)
    references public.qr_codes(id)
    on delete cascade;

alter table public.menu_scans
  drop constraint if exists menu_scans_restaurant_id_fkey,
  add constraint menu_scans_restaurant_id_fkey
    foreign key (restaurant_id)
    references public.restaurants(id)
    on delete cascade;
