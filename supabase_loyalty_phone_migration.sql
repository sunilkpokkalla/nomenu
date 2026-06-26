-- Add phone_number to loyalty_cards
ALTER TABLE public.loyalty_cards ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Index for faster phone number lookups
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_phone_number ON public.loyalty_cards(phone_number);
