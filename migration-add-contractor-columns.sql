-- Migration: Add missing columns to contractors table
-- Run this in your Supabase SQL editor

-- Add hourly_rate column
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 75.00;

-- Add currency column  
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'CAD';

-- Update existing records to have default values (if any exist)
UPDATE contractors 
SET 
  hourly_rate = 75.00,
  currency = 'CAD'
WHERE hourly_rate IS NULL OR currency IS NULL;
