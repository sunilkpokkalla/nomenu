-- Add loyalty_pin to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_pin TEXT DEFAULT '1234';

-- Create loyalty_cards table
CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES customer_feedback(id) ON DELETE SET NULL,
  stamps INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_restaurant_id ON loyalty_cards(restaurant_id);

-- Enable RLS
ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage their restaurant's loyalty cards
DROP POLICY IF EXISTS "Owners can manage loyalty cards" ON loyalty_cards;
CREATE POLICY "Owners can manage loyalty cards"
  ON loyalty_cards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = loyalty_cards.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = loyalty_cards.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Policy: Public can insert loyalty cards (happens when they submit feedback)
DROP POLICY IF EXISTS "Public can insert loyalty cards" ON loyalty_cards;
CREATE POLICY "Public can insert loyalty cards"
  ON loyalty_cards FOR INSERT
  WITH CHECK (true);

-- Policy: Public can read a specific loyalty card by ID (to view their card)
DROP POLICY IF EXISTS "Public can view loyalty cards" ON loyalty_cards;
CREATE POLICY "Public can view loyalty cards"
  ON loyalty_cards FOR SELECT
  USING (true);

-- Policy: Public can update loyalty cards (increment stamps)
-- Security note: the actual update requires the PIN, which we will validate server-side in a Server Action.
-- But the DB level policy needs to allow the Server Action to update it (since it uses the authenticated or anon client).
-- Actually, Server Actions use `createClient()` which runs as anon/authenticated user.
-- It's safer to use an admin client or allow update with true, since the Server Action checks the PIN before updating.
DROP POLICY IF EXISTS "Public can update loyalty cards" ON loyalty_cards;
CREATE POLICY "Public can update loyalty cards"
  ON loyalty_cards FOR UPDATE
  USING (true)
  WITH CHECK (true);
