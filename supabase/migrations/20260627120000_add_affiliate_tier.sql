-- Add tier to affiliates to distinguish between founding (lifetime) and standard (one-time)
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard';
