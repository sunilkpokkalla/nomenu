-- Add opening_time to restaurants
ALTER TABLE restaurants
ADD COLUMN opening_time TIME WITHOUT TIME ZONE DEFAULT '09:00:00';

-- Force all existing restaurants to have a default opening time of 09:00 if they were NULL
UPDATE restaurants SET opening_time = '09:00:00' WHERE opening_time IS NULL;
