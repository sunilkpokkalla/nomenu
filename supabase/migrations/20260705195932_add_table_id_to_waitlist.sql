-- Add table_id to waitlist table
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS table_id uuid REFERENCES public.restaurant_tables(id) ON DELETE SET NULL;
