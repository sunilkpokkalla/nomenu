-- Add the new column for tracking daily sequence
ALTER TABLE public.orders 
ADD COLUMN daily_order_number INTEGER;

-- Create the function that will calculate the next sequence number for the given day
CREATE OR REPLACE FUNCTION set_daily_order_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the new daily_order_number based on the current date (UTC) and restaurant
    SELECT COALESCE(MAX(daily_order_number), 0) + 1
    INTO NEW.daily_order_number
    FROM public.orders
    WHERE restaurant_id = NEW.restaurant_id
    AND DATE(timezone('utc', created_at)) = DATE(timezone('utc', NEW.created_at));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that runs before an order is inserted
CREATE TRIGGER trg_set_daily_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_daily_order_number();
