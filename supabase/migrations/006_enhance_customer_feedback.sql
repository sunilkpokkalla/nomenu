-- Migration: Enhance customer feedback with contact info and table tracking
ALTER TABLE customer_feedback 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS contact_info TEXT,
ADD COLUMN IF NOT EXISTS table_number TEXT;
