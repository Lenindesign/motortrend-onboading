-- Journey Builder Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: journey_layouts
-- Stores the 8 experience layouts
-- ============================================
CREATE TABLE IF NOT EXISTS journey_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layout_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    experience TEXT NOT NULL,
    is_shopper BOOLEAN NOT NULL DEFAULT false,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_journey_layouts_layout_key ON journey_layouts(layout_key);

-- ============================================
-- Table: layout_versions
-- Stores version history for rollback
-- ============================================
CREATE TABLE IF NOT EXISTS layout_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layout_id UUID NOT NULL REFERENCES journey_layouts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    sections JSONB NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    change_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_layout_versions_layout_id ON layout_versions(layout_id);
CREATE INDEX IF NOT EXISTS idx_layout_versions_created_at ON layout_versions(created_at DESC);

-- Unique constraint for version numbers per layout
CREATE UNIQUE INDEX IF NOT EXISTS idx_layout_versions_unique ON layout_versions(layout_id, version_number);

-- ============================================
-- Function: Auto-increment version number
-- ============================================
CREATE OR REPLACE FUNCTION get_next_version_number(p_layout_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO next_version
    FROM layout_versions
    WHERE layout_id = p_layout_id;
    
    RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: Create version on layout update
-- ============================================
CREATE OR REPLACE FUNCTION create_layout_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if sections changed
    IF OLD.sections IS DISTINCT FROM NEW.sections THEN
        INSERT INTO layout_versions (
            layout_id,
            version_number,
            sections,
            changed_by,
            change_description
        ) VALUES (
            NEW.id,
            get_next_version_number(NEW.id),
            OLD.sections,
            NEW.updated_by,
            'Auto-saved version before update'
        );
    END IF;
    
    -- Update timestamp
    NEW.updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Trigger: Auto-create version on update
-- ============================================
DROP TRIGGER IF EXISTS trigger_create_layout_version ON journey_layouts;
CREATE TRIGGER trigger_create_layout_version
    BEFORE UPDATE ON journey_layouts
    FOR EACH ROW
    EXECUTE FUNCTION create_layout_version();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE journey_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE layout_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read layouts (public read)
CREATE POLICY "Anyone can read layouts"
    ON journey_layouts
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can update layouts
CREATE POLICY "Authenticated users can update layouts"
    ON journey_layouts
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert layouts
CREATE POLICY "Authenticated users can insert layouts"
    ON journey_layouts
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anyone can read versions (public read)
CREATE POLICY "Anyone can read versions"
    ON layout_versions
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert versions
CREATE POLICY "Authenticated users can insert versions"
    ON layout_versions
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Seed Data: Initial 8 layouts
-- ============================================
INSERT INTO journey_layouts (layout_key, name, description, experience, is_shopper, sections)
VALUES 
    ('A-shopper', 'Experience A - Shopper', 'User has wanted vehicle AND owned vehicle, actively shopping', 'A', true, '[]'::jsonb),
    ('A-browser', 'Experience A - Browser', 'User has wanted vehicle AND owned vehicle, just browsing', 'A', false, '[]'::jsonb),
    ('B-shopper', 'Experience B - Shopper', 'User has wanted vehicle but NO owned vehicle, actively shopping', 'B', true, '[]'::jsonb),
    ('B-browser', 'Experience B - Browser', 'User has wanted vehicle but NO owned vehicle, just browsing', 'B', false, '[]'::jsonb),
    ('C-shopper', 'Experience C - Shopper', 'User has NO wanted vehicle but HAS owned vehicle, actively shopping', 'C', true, '[]'::jsonb),
    ('C-browser', 'Experience C - Browser', 'User has NO wanted vehicle but HAS owned vehicle, just browsing', 'C', false, '[]'::jsonb),
    ('D-shopper', 'Experience D - Shopper', 'User has NO wanted vehicle AND NO owned vehicle, actively shopping', 'D', true, '[]'::jsonb),
    ('D-browser', 'Experience D - Browser', 'User has NO wanted vehicle AND NO owned vehicle, just browsing', 'D', false, '[]'::jsonb)
ON CONFLICT (layout_key) DO NOTHING;

-- ============================================
-- Grant permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON journey_layouts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON journey_layouts TO authenticated;
GRANT SELECT ON layout_versions TO anon, authenticated;
GRANT SELECT, INSERT ON layout_versions TO authenticated;

