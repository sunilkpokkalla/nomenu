-- Create Affiliate Payouts Table
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_code TEXT NOT NULL, -- The code that was used (belongs to affiliate or restaurant)
    referred_restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL, -- The new restaurant that signed up
    amount INTEGER NOT NULL, -- Dollar amount owed
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'credited')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Admins can read and update payouts
DROP POLICY IF EXISTS "Admins can manage payouts" ON public.affiliate_payouts;
CREATE POLICY "Admins can manage payouts"
    ON public.affiliate_payouts FOR ALL
    USING (true);

-- (If you want affiliates/restaurants to see their payouts later, you can add policies checking their codes against the referrer_code)
