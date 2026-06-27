-- Add wait_time_status to restaurants to inform customers of delays before ordering
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS wait_time_status TEXT DEFAULT 'normal';
