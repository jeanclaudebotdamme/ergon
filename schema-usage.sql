-- Token Usage Tracking Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL, -- 'anthropic' or 'moonshot'
    model TEXT NOT NULL, -- 'claude-opus-4-5', 'kimi-k2.5', etc.
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cache_read_tokens INTEGER DEFAULT 0,
    cache_write_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    session_id TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_usage_provider ON token_usage(provider);
CREATE INDEX idx_usage_recorded_at ON token_usage(recorded_at);
CREATE INDEX idx_usage_provider_date ON token_usage(provider, recorded_at);

-- Enable Row Level Security
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Public read/write for now (update as needed)
CREATE POLICY "Allow all operations on token_usage" ON token_usage
    FOR ALL USING (true) WITH CHECK (true);

-- View for daily aggregates
CREATE OR REPLACE VIEW daily_usage AS
SELECT 
    DATE(recorded_at) as date,
    provider,
    model,
    SUM(input_tokens) as input_tokens,
    SUM(output_tokens) as output_tokens,
    SUM(cache_read_tokens) as cache_read_tokens,
    SUM(cache_write_tokens) as cache_write_tokens,
    SUM(total_tokens) as total_tokens,
    SUM(cost_usd) as cost_usd
FROM token_usage
GROUP BY DATE(recorded_at), provider, model
ORDER BY date DESC, provider;
