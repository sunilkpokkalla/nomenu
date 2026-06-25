-- Create loyalty scan tokens table
CREATE TABLE IF NOT EXISTS public.loyalty_scan_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.loyalty_scan_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for loyalty_scan_tokens
CREATE POLICY "Public read access for loyalty scan tokens"
    ON public.loyalty_scan_tokens
    FOR SELECT
    USING (true);

CREATE POLICY "Owners can manage their loyalty scan tokens"
    ON public.loyalty_scan_tokens
    FOR ALL
    USING (restaurant_id IN (
        SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    ));
