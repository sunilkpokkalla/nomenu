ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS milestone_rewards JSONB DEFAULT '[]'::jsonb;
