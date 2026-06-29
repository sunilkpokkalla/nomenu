ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS manager_visit_timer_minutes integer DEFAULT 5;
