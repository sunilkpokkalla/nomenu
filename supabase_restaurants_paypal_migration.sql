-- Add paypal_email to restaurants table for referral cashouts
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS paypal_email TEXT;
