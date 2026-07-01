ALTER TABLE restaurants
ADD COLUMN reward_templates jsonb DEFAULT '[]'::jsonb;
