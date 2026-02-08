-- Supabase Setup SQL for Portfolio
-- Run this in your Supabase SQL Editor

-- 1. Portfolio Content Table (for editable content)
CREATE TABLE IF NOT EXISTS portfolio_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    content JSONB DEFAULT '{}',
    styles JSONB DEFAULT '{}',
    sections JSONB DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Visitor Logs Table (for analytics)
CREATE TABLE IF NOT EXISTS visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip TEXT,
    location TEXT,
    path TEXT,
    user_agent TEXT,
    device TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_content_updated_at ON portfolio_content(updated_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public read access
CREATE POLICY "Allow public read access to content"
    ON portfolio_content FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert for visitor logs"
    ON visitor_logs FOR INSERT
    WITH CHECK (true);

-- 6. Create policy for authenticated write access to content
CREATE POLICY "Allow authenticated write to content"
    ON portfolio_content FOR ALL
    USING (auth.role() = 'authenticated');

-- Note: For visitor logs admin access, use the service role key server-side
