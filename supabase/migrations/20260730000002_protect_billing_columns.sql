-- Protect billing columns (plan, stripe_customer_id, stripe_subscription_id) from client-side direct updates
CREATE OR REPLACE FUNCTION protect_restaurant_billing_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If update is initiated by a regular authenticated client user, restrict changes to billing/plan columns
  IF auth.role() = 'authenticated' THEN
    IF OLD.plan IS DISTINCT FROM NEW.plan THEN
      NEW.plan := OLD.plan;
    END IF;
    IF OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id THEN
      NEW.stripe_customer_id := OLD.stripe_customer_id;
    END IF;
    IF OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id THEN
      NEW.stripe_subscription_id := OLD.stripe_subscription_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_restaurant_billing ON public.restaurants;

CREATE TRIGGER tr_protect_restaurant_billing
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION protect_restaurant_billing_columns();
