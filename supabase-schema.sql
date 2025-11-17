-- FitSense Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  supports INTEGER DEFAULT 0,
  dont_supports INTEGER DEFAULT 0,
  user_id TEXT,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table to track user votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('support', 'dont_support')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  user_email TEXT,
  questions_asked INTEGER DEFAULT 0,
  supports_given INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_supports ON questions(supports DESC);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_question_id ON votes(question_id);

-- Enable Row Level Security (RLS)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update questions" ON questions
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read user_stats" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert user_stats" ON user_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update user_stats" ON user_stats
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_stats
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

