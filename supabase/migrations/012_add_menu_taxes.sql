-- Add tax and service fee settings to menus
ALTER TABLE public.menus
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS service_charge DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS service_charge_type TEXT DEFAULT 'percentage' CHECK (service_charge_type IN ('percentage', 'flat'));
