-- Add service recovery settings to restaurants
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS recovery_offer_text text DEFAULT '15% off your next visit with code MAKEITRIGHT15',
ADD COLUMN IF NOT EXISTS recovery_message text DEFAULT 'Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally.';
