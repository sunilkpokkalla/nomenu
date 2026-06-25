-- Migration: Add specific contact fields for Loyalty Program
ALTER TABLE public.customer_feedback 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;
