-- Enable pg_cron extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Schedule the job to run every day at 3:00 AM
-- This will cancel any pending or preparing order that is older than 24 hours
SELECT cron.schedule(
  'auto-clear-stale-orders',
  '0 3 * * *',
  $$
    UPDATE public.orders 
    SET status = 'cancelled'
    WHERE status IN ('pending', 'preparing') 
    AND created_at < NOW() - INTERVAL '24 hours';
  $$
);
