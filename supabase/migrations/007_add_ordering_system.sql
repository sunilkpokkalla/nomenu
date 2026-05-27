-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number TEXT,
    customer_name TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, preparing, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time_of_order DECIMAL(10, 2) NOT NULL,
    customer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders RLS Policies
-- Restaurants can view and update their own orders
CREATE POLICY "Restaurants can view their own orders"
    ON public.orders FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.restaurants r 
        WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    ));

CREATE POLICY "Restaurants can update their own orders"
    ON public.orders FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.restaurants r 
        WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    ));

-- Anyone can insert an order (since customers are not authenticated)
CREATE POLICY "Anyone can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Order Items RLS Policies
-- Restaurants can view their own order items
CREATE POLICY "Restaurants can view their own order items"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders o
        JOIN public.restaurants r ON r.id = o.restaurant_id
        WHERE o.id = order_items.order_id AND r.owner_id = auth.uid()
    ));

-- Anyone can insert order items
CREATE POLICY "Anyone can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);
