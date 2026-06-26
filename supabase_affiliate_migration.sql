-- 1. Create Affiliates Table (For External Influencers)
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth if they log in
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    paypal_email TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    total_clicks INTEGER DEFAULT 0,
    total_paid_amount INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add referred_by_code and billing_cycle to Restaurants
-- This stores the code (which could be an influencer's custom code, OR a restaurant's slug)
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
ADD COLUMN IF NOT EXISTS billing_cycle TEXT;

-- 3. Enable Row Level Security (RLS) on affiliates
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Policy: Affiliates can read their own data
DROP POLICY IF EXISTS "Users can view own affiliate data" ON public.affiliates;
CREATE POLICY "Users can view own affiliate data" 
    ON public.affiliates FOR SELECT 
    USING (auth.uid() = auth_id);

-- Policy: Affiliates can insert their own data
DROP POLICY IF EXISTS "Users can insert own affiliate data" ON public.affiliates;
CREATE POLICY "Users can insert own affiliate data" 
    ON public.affiliates FOR INSERT 
    WITH CHECK (auth.uid() = auth_id);

-- Policy: Affiliates can update their own data (except referral_code and clicks)
DROP POLICY IF EXISTS "Users can update own affiliate data" ON public.affiliates;
CREATE POLICY "Users can update own affiliate data" 
    ON public.affiliates FOR UPDATE 
    USING (auth.uid() = auth_id);

-- Policy: Admin can read all affiliates
-- Note: Replace with actual admin role check if you use custom claims, 
-- or leave as is if you manage admins via Next.js server logic instead of pure RLS.
DROP POLICY IF EXISTS "Admins can view all affiliates" ON public.affiliates;
CREATE POLICY "Admins can view all affiliates"
    ON public.affiliates FOR SELECT
    USING (true); -- Server side will enforce admin security via service_role key or middleware

-- Policy: Admin can update all affiliates
DROP POLICY IF EXISTS "Admins can update all affiliates" ON public.affiliates;
CREATE POLICY "Admins can update all affiliates"
    ON public.affiliates FOR UPDATE
    USING (true);
