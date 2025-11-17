-- Calorie Entries Table for FitSense
-- Run this SQL in your Supabase SQL Editor
-- This matches your existing database structure

-- Create calorie_entries table for tracking daily calories
CREATE TABLE IF NOT EXISTS calorie_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  date DATE NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for calorie_entries
CREATE INDEX IF NOT EXISTS idx_calorie_entries_user_id ON calorie_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_calorie_entries_date ON calorie_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_calorie_entries_user_date ON calorie_entries(user_id, date DESC);

-- Enable Row Level Security for calorie_entries
ALTER TABLE calorie_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for calorie_entries (user-specific access only)
-- Note: Since we're using custom user_id (not Supabase Auth), we'll filter by user_id in the app
-- For now, allow users to manage their own entries (app will filter by user_id)
CREATE POLICY "Users can view their own calorie entries" ON calorie_entries
  FOR SELECT USING (true); -- App will filter by user_id

CREATE POLICY "Users can insert their own calorie entries" ON calorie_entries
  FOR INSERT WITH CHECK (true); -- App will ensure correct user_id

CREATE POLICY "Users can update their own calorie entries" ON calorie_entries
  FOR UPDATE USING (true); -- App will filter by user_id

CREATE POLICY "Users can delete their own calorie entries" ON calorie_entries
  FOR DELETE USING (true); -- App will filter by user_id

-- Create trigger for calorie_entries updated_at
CREATE TRIGGER update_calorie_entries_updated_at
  BEFORE UPDATE ON calorie_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

