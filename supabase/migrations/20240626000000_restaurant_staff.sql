-- Migration for restaurant_staff

CREATE TABLE IF NOT EXISTS public.restaurant_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('manager', 'kitchen', 'waitstaff')),
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- An email can only be invited once per restaurant
    UNIQUE(restaurant_id, email)
);

-- RLS
ALTER TABLE public.restaurant_staff ENABLE ROW LEVEL SECURITY;

-- Owner can see all staff for their restaurant
CREATE POLICY "Owner can view their restaurant staff"
ON public.restaurant_staff
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = restaurant_staff.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Owner can delete their restaurant staff
CREATE POLICY "Owner can delete their restaurant staff"
ON public.restaurant_staff
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = restaurant_staff.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Staff can view their own record
CREATE POLICY "Staff can view own record"
ON public.restaurant_staff
FOR SELECT
USING (auth_id = auth.uid());
