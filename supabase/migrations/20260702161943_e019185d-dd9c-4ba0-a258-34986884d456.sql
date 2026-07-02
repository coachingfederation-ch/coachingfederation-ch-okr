ALTER TABLE public.initiatives
  ADD COLUMN IF NOT EXISTS owner TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'planned';

ALTER TABLE public.initiatives
  DROP CONSTRAINT IF EXISTS initiatives_status_check;

ALTER TABLE public.initiatives
  ADD CONSTRAINT initiatives_status_check
  CHECK (status IN ('planned','in_progress','done','canceled'));