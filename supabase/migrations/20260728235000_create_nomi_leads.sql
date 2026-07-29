-- Create nomi_leads table for B2B chatbot lead capture
CREATE TABLE IF NOT EXISTS public.nomi_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.nomi_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public inserts" ON public.nomi_leads;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.nomi_leads;

-- Policy to allow anonymous/public users to submit their email
CREATE POLICY "Allow public inserts" ON public.nomi_leads
  FOR INSERT WITH CHECK (true);

-- Policy to allow authenticated admins to read leads
CREATE POLICY "Allow authenticated read" ON public.nomi_leads
  FOR SELECT TO authenticated USING (true);
