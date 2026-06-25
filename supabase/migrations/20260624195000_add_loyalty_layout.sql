-- Add customizable loyalty layout field to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS loyalty_card_layout TEXT DEFAULT 'classic';
