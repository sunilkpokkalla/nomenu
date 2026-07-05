-- Create floor_plans table
CREATE TABLE public.floor_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  width numeric NOT NULL DEFAULT 800,
  height numeric NOT NULL DEFAULT 600,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT floor_plans_pkey PRIMARY KEY (id),
  CONSTRAINT floor_plans_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);

-- Enable RLS for floor_plans
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own restaurant's floor plans
CREATE POLICY "Users can view floor plans for their restaurant" ON public.floor_plans
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

-- Policy: Users can insert/update/delete their own restaurant's floor plans
CREATE POLICY "Users can manage floor plans for their restaurant" ON public.floor_plans
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create restaurant_tables table
CREATE TABLE public.restaurant_tables (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  floor_plan_id uuid NOT NULL,
  table_number text NOT NULL,
  capacity integer NOT NULL DEFAULT 4,
  shape text NOT NULL DEFAULT 'rectangle',
  x numeric NOT NULL DEFAULT 0,
  y numeric NOT NULL DEFAULT 0,
  width numeric NOT NULL DEFAULT 100,
  height numeric NOT NULL DEFAULT 100,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_tables_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_tables_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE
);

-- Enable RLS for restaurant_tables
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tables for their floor plans
CREATE POLICY "Users can view tables for their floor plans" ON public.restaurant_tables
  FOR SELECT USING (
    floor_plan_id IN (
      SELECT id FROM public.floor_plans WHERE restaurant_id IN (
        SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
      )
    )
  );

-- Policy: Users can insert/update/delete tables for their floor plans
CREATE POLICY "Users can manage tables for their floor plans" ON public.restaurant_tables
  FOR ALL USING (
    floor_plan_id IN (
      SELECT id FROM public.floor_plans WHERE restaurant_id IN (
        SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
      )
    )
  );
