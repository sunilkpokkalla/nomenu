-- Revoke the overly permissive public insert policies for orders and order_items
-- Since orders are now submitted securely via Next.js Server Actions (which use the Service Role key),
-- the public no longer needs direct insert access to the database.

-- 1. Drop the public insert policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

-- 2. (Optional) We leave the SELECT and UPDATE policies intact for restaurants
-- so they can still manage their orders via the authenticated dashboard.
