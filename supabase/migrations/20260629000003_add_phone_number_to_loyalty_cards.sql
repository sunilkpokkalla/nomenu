-- Add phone_number to loyalty_cards
ALTER TABLE loyalty_cards ADD COLUMN IF NOT EXISTS phone_number TEXT;
