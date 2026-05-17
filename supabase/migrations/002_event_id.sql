-- Add created_at to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Add event_id to attendees for per-event tracking
ALTER TABLE public.attendees ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES public.events(id);
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON public.attendees (event_id);

-- Backfill existing attendees to the default seeded event
UPDATE public.attendees
SET event_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
WHERE event_id IS NULL;
