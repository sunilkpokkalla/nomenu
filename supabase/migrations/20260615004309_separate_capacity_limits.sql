-- Add new capacity columns to restaurants table
ALTER TABLE restaurants
ADD COLUMN max_takeaway_per_slot INTEGER DEFAULT 5;

ALTER TABLE restaurants
ADD COLUMN max_reserve_per_slot INTEGER DEFAULT 2;

-- Update existing restaurants to have defaults
UPDATE restaurants SET max_takeaway_per_slot = 5 WHERE max_takeaway_per_slot IS NULL;
UPDATE restaurants SET max_reserve_per_slot = 2 WHERE max_reserve_per_slot IS NULL;

-- Remove the old combined column
ALTER TABLE restaurants
DROP COLUMN max_orders_per_slot;
