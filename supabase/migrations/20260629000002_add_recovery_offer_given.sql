ALTER TABLE customer_feedback
ADD COLUMN IF NOT EXISTS recovery_offer_given text;
