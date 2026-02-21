-- Create the history table
CREATE TABLE IF NOT EXISTS history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    question TEXT,
    answer TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to see only their own history
CREATE POLICY "Users can view their own history" 
    ON history FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to insert their own history
CREATE POLICY "Users can insert their own history" 
    ON history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create an index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
