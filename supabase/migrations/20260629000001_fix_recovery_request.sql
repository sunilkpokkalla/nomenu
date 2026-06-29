ALTER TABLE customer_feedback
ADD COLUMN IF NOT EXISTS recovery_request text;
