-- Ergon Kanban Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Columns table (Kanban columns)
CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    status_key TEXT UNIQUE, -- e.g., 'backlog', 'progress', 'jason', 'jc', 'done'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    assignee TEXT, -- 'jason', 'jc', or NULL
    notes TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    priority BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_position ON tasks(position);
CREATE INDEX idx_columns_position ON columns(position);

-- Enable Row Level Security
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now - update as needed)
CREATE POLICY "Allow all operations on columns" ON columns
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default columns
INSERT INTO columns (name, position, status_key) VALUES
    ('Backlog', 0, 'backlog'),
    ('In Progress', 1, 'progress'),
    ('Needs Jason', 2, 'jason'),
    ('Needs JC', 3, 'jc'),
    ('Done', 4, 'done');

-- Sample tasks (optional - for testing)
INSERT INTO tasks (title, column_id, assignee, notes, position, priority) VALUES
    ('Research Supabase auth patterns', (SELECT id FROM columns WHERE status_key = 'backlog'), 'jc', NULL, 0, FALSE),
    ('Explore calendar API options', (SELECT id FROM columns WHERE status_key = 'backlog'), 'jason', NULL, 1, FALSE),
    ('Build Ergon dashboard MVP', (SELECT id FROM columns WHERE status_key = 'progress'), 'jc', NULL, 0, TRUE),
    ('Gmail OAuth setup', (SELECT id FROM columns WHERE status_key = 'progress'), 'jason', NULL, 1, FALSE),
    ('Document Growth Machina functions', (SELECT id FROM columns WHERE status_key = 'progress'), 'jason', NULL, 2, FALSE),
    ('Create Supabase project & share keys', (SELECT id FROM columns WHERE status_key = 'jason'), 'jason', NULL, 0, FALSE),
    ('Review Growth Machina MD files', (SELECT id FROM columns WHERE status_key = 'jc'), 'jc', NULL, 0, FALSE),
    ('Initial OpenClaw setup', (SELECT id FROM columns WHERE status_key = 'done'), 'jason', NULL, 0, FALSE),
    ('Define Ergon MVP requirements', (SELECT id FROM columns WHERE status_key = 'done'), 'jason', 'Both team members involved', 1, FALSE);
