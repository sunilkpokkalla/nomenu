CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Restaurant owners can view their tickets" ON public.support_tickets
    FOR SELECT USING (
        restaurant_id IN (
            SELECT r.id FROM public.restaurants r WHERE r.owner_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners can insert tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (
        restaurant_id IN (
            SELECT r.id FROM public.restaurants r WHERE r.owner_id = auth.uid()
        )
    );
