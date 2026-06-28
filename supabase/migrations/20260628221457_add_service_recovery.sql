ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS service_recovery_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS service_recovery_message text DEFAULT 'We are so sorry your experience wasn''t perfect. Our manager has been alerted and is looking into this immediately. In case we miss you before you leave, please let us know how we can make this right:',
ADD COLUMN IF NOT EXISTS offer_manager_visit boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS offer_compensation boolean DEFAULT false;

ALTER TABLE feedback
ADD COLUMN IF NOT EXISTS recovery_request text;