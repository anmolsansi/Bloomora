-- Bloomora Database Schema
-- Run this migration to set up the database

CREATE TABLE IF NOT EXISTS bouquets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_email TEXT,
  sender_email TEXT,
  message TEXT NOT NULL,
  occasion TEXT,
  selected_flowers JSONB NOT NULL DEFAULT '[]',
  arrangement_data JSONB NOT NULL DEFAULT '{}',
  style_data JSONB NOT NULL DEFAULT '{}',
  delivery_method TEXT,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_bouquets_slug ON bouquets(slug);

-- Index for cleanup of expired bouquets
CREATE INDEX IF NOT EXISTS idx_bouquets_expires_at ON bouquets(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_bouquets_updated_at
  BEFORE UPDATE ON bouquets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
