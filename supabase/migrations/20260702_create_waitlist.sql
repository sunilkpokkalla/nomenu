-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1,
    phone_number TEXT,
    quoted_time_minutes INTEGER,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'seated', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Waitlist viewable by restaurant staff"
ON public.waitlist FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.restaurant_id = waitlist.restaurant_id 
        AND restaurant_staff.auth_id = auth.uid()
        AND restaurant_staff.status = 'active'
    )
    OR
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = waitlist.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
);

CREATE POLICY "Waitlist insertable by restaurant staff"
ON public.waitlist FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.restaurant_id = waitlist.restaurant_id 
        AND restaurant_staff.auth_id = auth.uid()
        AND restaurant_staff.status = 'active'
    )
    OR
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = waitlist.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
);

CREATE POLICY "Waitlist updatable by restaurant staff"
ON public.waitlist FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.restaurant_id = waitlist.restaurant_id 
        AND restaurant_staff.auth_id = auth.uid()
        AND restaurant_staff.status = 'active'
    )
    OR
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = waitlist.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_restaurant_id ON public.waitlist(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
