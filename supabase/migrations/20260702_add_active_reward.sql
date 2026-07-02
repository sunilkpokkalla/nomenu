-- Add active_reward column to loyalty_cards
ALTER TABLE public.loyalty_cards ADD COLUMN IF NOT EXISTS active_reward TEXT;
