-- Add customizable loyalty design fields to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS loyalty_stamp_color TEXT DEFAULT 'amber',
ADD COLUMN IF NOT EXISTS loyalty_stamp_icon TEXT DEFAULT 'star';
