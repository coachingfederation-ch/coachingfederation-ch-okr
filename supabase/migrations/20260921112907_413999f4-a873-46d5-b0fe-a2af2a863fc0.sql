ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'member';

ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS created_by uuid;

CREATE INDEX IF NOT EXISTS initiatives_created_by_idx ON public.initiatives (created_by);