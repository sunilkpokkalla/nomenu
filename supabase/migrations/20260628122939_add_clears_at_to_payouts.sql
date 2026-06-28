-- Add clears_at column to affiliate_payouts to enforce 60-day holding period
ALTER TABLE affiliate_payouts
ADD COLUMN clears_at timestamp with time zone;

-- For existing rows, just set them to created_at + 60 days
UPDATE affiliate_payouts
SET clears_at = created_at + interval '60 days'
WHERE clears_at IS NULL;
