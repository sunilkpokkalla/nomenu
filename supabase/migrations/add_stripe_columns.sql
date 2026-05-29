-- Add Stripe Connect columns to restaurants
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS stripe_account_id text,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete boolean DEFAULT false;

-- Add payment_intent_id to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_intent_id text;
