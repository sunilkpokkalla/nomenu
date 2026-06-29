-- Add new hybrid role
DO $$
DECLARE
    con_name text;
BEGIN
    -- Find the check constraint on the role column
    SELECT conname INTO con_name
    FROM pg_constraint
    WHERE conrelid = 'public.restaurant_staff'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%role%';

    IF con_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.restaurant_staff DROP CONSTRAINT ' || quote_ident(con_name);
    END IF;
    
    -- Add the new constraint
    ALTER TABLE public.restaurant_staff ADD CONSTRAINT restaurant_staff_role_check 
        CHECK (role IN ('manager', 'kitchen', 'waitstaff', 'kitchen_waitstaff'));
END $$;
