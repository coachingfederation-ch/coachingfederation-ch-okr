ALTER TABLE public.initiatives DROP CONSTRAINT IF EXISTS initiatives_status_check;
ALTER TABLE public.initiatives ADD CONSTRAINT initiatives_status_check
  CHECK (status IN ('proposed','planned','in_progress','done','canceled'));