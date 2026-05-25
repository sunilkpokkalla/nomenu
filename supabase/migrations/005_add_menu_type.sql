-- Add menu_type column to public.menus table
alter table public.menus
  add column if not exists menu_type text;
