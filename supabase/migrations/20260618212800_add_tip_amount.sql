CREATE TABLE IF NOT EXISTS public.orders (
    -- Dummy schema just to ensure IF NOT EXISTS doesn't fail if table doesn't exist yet, but it does.
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tip_amount DECIMAL(10, 2) DEFAULT 0.00;
