-- Migration: Add loyalty_reward_text to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS loyalty_reward_text TEXT DEFAULT '10 Stamps = 1 Free Item';
