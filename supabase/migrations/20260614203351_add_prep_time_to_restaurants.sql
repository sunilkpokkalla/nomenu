-- Add prep_time_minutes to restaurants table
ALTER TABLE restaurants
ADD COLUMN prep_time_minutes INTEGER DEFAULT 20;

-- Update existing restaurants to have a prep_time_minutes of 20
UPDATE restaurants SET prep_time_minutes = 20 WHERE prep_time_minutes IS NULL;
