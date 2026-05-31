-- Enable Realtime for the customer_feedback table
DO $$ 
BEGIN 
    -- Check if the table is already in the publication, and add it if not
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'customer_feedback'
    ) THEN 
        ALTER PUBLICATION supabase_realtime ADD TABLE customer_feedback; 
    END IF; 
END $$;
