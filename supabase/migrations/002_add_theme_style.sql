-- Migration to add theme style support to restaurants
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS theme_style text DEFAULT 'bistro';
