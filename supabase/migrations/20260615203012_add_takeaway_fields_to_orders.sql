ALTER TABLE "public"."orders"
ADD COLUMN IF NOT EXISTS "customer_phone" text,
ADD COLUMN IF NOT EXISTS "reservation_time" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "party_size" integer;
