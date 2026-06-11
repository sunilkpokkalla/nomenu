-- Add Square integration columns to the restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS square_access_token TEXT,
ADD COLUMN IF NOT EXISTS square_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS square_merchant_id TEXT;
