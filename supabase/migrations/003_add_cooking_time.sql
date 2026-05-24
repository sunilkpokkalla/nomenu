-- Migration to add cooking time support to menu items
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS cooking_time integer;
