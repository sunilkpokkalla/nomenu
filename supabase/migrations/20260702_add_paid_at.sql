-- Add paid_at column to track when an order was settled
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Create an index to speed up filtering completed history by payment time
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON public.orders(paid_at);

-- For existing paid orders, backfill paid_at with created_at as a fallback
UPDATE public.orders SET paid_at = created_at WHERE is_paid = true AND paid_at IS NULL;
