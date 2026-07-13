-- Add claim tracking columns to customer_feedback
ALTER TABLE customer_feedback ADD COLUMN IF NOT EXISTS claim_status VARCHAR(20) DEFAULT 'issued';
ALTER TABLE customer_feedback ADD COLUMN IF NOT EXISTS claim_redeemed_at TIMESTAMPTZ;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customer_feedback' AND column_name = 'recovery_offer_given') THEN
    EXECUTE 'UPDATE customer_feedback SET claim_status = ''issued'' WHERE recovery_offer_given IS NOT NULL AND claim_status IS NULL';
  END IF;
END $$;
