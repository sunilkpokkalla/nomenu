-- Remove obsolete loyalty_pin column from restaurants table
ALTER TABLE public.restaurants DROP COLUMN IF EXISTS loyalty_pin;
