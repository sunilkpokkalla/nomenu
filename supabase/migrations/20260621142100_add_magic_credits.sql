-- Add magic_credits column to restaurants to track AI generation balance
ALTER TABLE "public"."restaurants" ADD COLUMN IF NOT EXISTS "magic_credits" INTEGER DEFAULT 10;
