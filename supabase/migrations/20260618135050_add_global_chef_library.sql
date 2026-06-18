CREATE TABLE IF NOT EXISTS global_chef_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT,
  image_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indices for fast searching
CREATE INDEX IF NOT EXISTS idx_global_chef_library_name ON global_chef_library USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_global_chef_library_category ON global_chef_library (category_id);

ALTER TABLE global_chef_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read global_chef_library"
  ON global_chef_library
  FOR SELECT
  USING (true);
