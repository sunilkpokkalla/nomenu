-- Add tracking fields for annual subscriptions to the restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN is_annual_plan BOOLEAN DEFAULT false,
ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE;
