-- Add menu_type to menus table
ALTER TABLE public.menus 
ADD COLUMN menu_type text DEFAULT 'dine_in';

-- Add reservation/pickup columns to orders table
ALTER TABLE public.orders
ADD COLUMN reservation_time timestamp with time zone,
ADD COLUMN party_size integer,
ADD COLUMN customer_phone text;
