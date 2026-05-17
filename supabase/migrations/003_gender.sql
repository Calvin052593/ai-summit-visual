-- Add gender column to attendees table
ALTER TABLE attendees
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));
