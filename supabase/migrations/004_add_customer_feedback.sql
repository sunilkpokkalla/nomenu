-- Migration: Add customer feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on restaurant_id for faster queries
CREATE INDEX IF NOT EXISTS customer_feedback_restaurant_id_idx ON customer_feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS customer_feedback_created_at_idx ON customer_feedback(created_at DESC);

-- Enable RLS
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert feedback
CREATE POLICY "Anyone can insert feedback" 
ON customer_feedback FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow restaurant owners to select their own feedback
CREATE POLICY "Restaurant owners can view their feedback" 
ON customer_feedback FOR SELECT 
TO authenticated 
USING (
    restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
);
