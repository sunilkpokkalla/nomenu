-- Enable Realtime for the orders table
-- This allows the Supabase client to subscribe to INSERT, UPDATE, and DELETE events

BEGIN;

-- Check if the table is already in the publication, and add it if not
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'orders'
    ) THEN 
        ALTER PUBLICATION supabase_realtime ADD TABLE orders; 
    END IF; 
END $$;

COMMIT;
