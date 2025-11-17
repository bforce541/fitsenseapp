-- Add missing column and constraint to calorie_entries table
-- Run this in Supabase SQL Editor if needed

-- Add user_email column if it doesn't exist
ALTER TABLE calorie_entries 
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add unique constraint on (user_id, date) if it doesn't exist
-- This ensures one entry per user per day
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'calorie_entries_user_id_date_key'
  ) THEN
    ALTER TABLE calorie_entries 
    ADD CONSTRAINT calorie_entries_user_id_date_key 
    UNIQUE (user_id, date);
  END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_calorie_entries_user_id ON calorie_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_calorie_entries_date ON calorie_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_calorie_entries_user_date ON calorie_entries(user_id, date DESC);


