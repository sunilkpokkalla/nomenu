-- Add design_config JSONB column to menus table for per-menu styling
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS design_config jsonb;
