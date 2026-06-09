-- SQL Migration for Advanced Routing

-- 1. Add columns to the restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS subdomain text,
ADD COLUMN IF NOT EXISTS custom_domain text;

-- 2. Add column to the menus table
ALTER TABLE public.menus
ADD COLUMN IF NOT EXISTS slug text;

-- 3. Create unique constraints so no two restaurants can have the same domain or slug
ALTER TABLE public.restaurants
ADD CONSTRAINT restaurants_slug_key UNIQUE (slug),
ADD CONSTRAINT restaurants_subdomain_key UNIQUE (subdomain),
ADD CONSTRAINT restaurants_custom_domain_key UNIQUE (custom_domain);

-- 4. Automatically generate a slug for existing menus if it's null (using a simple formatting trick)
-- This takes the menu name, converts to lowercase, and replaces spaces with hyphens
UPDATE public.menus
SET slug = lower(regexp_replace(name, '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 5. Automatically generate a slug for existing restaurants
UPDATE public.restaurants
SET slug = lower(regexp_replace(name, '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 6. Add is_paid column to orders for Elite plan payment tracking
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;
