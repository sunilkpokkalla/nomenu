ALTER TABLE menus ADD COLUMN display_language text DEFAULT 'en';
ALTER TABLE restaurants DROP COLUMN IF EXISTS enable_auto_translation;
