ALTER TABLE menus 
ADD COLUMN IF NOT EXISTS use_custom_design boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS theme_style text,
ADD COLUMN IF NOT EXISTS primary_color text,
ADD COLUMN IF NOT EXISTS accent_color text;
