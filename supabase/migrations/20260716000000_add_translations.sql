-- Add enable_auto_translation to restaurants
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS enable_auto_translation BOOLEAN DEFAULT false;

-- Add translations column to menu_items (cache)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add translations column to categories (cache)
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
