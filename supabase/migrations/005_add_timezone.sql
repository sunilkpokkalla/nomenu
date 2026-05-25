-- Migration: Add timezone to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
