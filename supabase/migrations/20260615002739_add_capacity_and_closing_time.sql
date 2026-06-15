-- Add max_orders_per_slot to restaurants table (default 5)
ALTER TABLE restaurants
ADD COLUMN max_orders_per_slot INTEGER DEFAULT 5;

-- Add closing_time to restaurants table (default 23:00)
ALTER TABLE restaurants
ADD COLUMN closing_time TIME DEFAULT '23:00:00';

-- Update existing restaurants to have defaults
UPDATE restaurants SET max_orders_per_slot = 5 WHERE max_orders_per_slot IS NULL;
UPDATE restaurants SET closing_time = '23:00:00' WHERE closing_time IS NULL;
