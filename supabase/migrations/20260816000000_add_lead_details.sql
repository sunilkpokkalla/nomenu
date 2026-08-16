-- Migration to add metadata columns to nomi_leads table for enriched calendar demo bookings
ALTER TABLE public.nomi_leads
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS restaurant_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS demo_time text;
