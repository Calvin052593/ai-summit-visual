-- Add character_id to attendees table for sprite pool assignment
ALTER TABLE attendees ADD COLUMN IF NOT EXISTS character_id integer;
