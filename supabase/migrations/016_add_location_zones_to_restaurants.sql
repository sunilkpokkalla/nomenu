-- Migration to add location zones to restaurants for organized QR Codes
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS location_zones text[] DEFAULT '{"Main Dining"}';
