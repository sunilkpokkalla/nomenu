-- Secure Database Access: Drop Public Inserts
-- We are removing public insert privileges for customer feedback and menu scans.
-- All inserts will now be handled securely via Next.js Server Actions using the Service Role Key.

DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.customer_feedback;
DROP POLICY IF EXISTS "Public can insert scan analytics" ON public.menu_scans;
