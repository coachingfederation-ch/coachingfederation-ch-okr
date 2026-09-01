DROP INDEX IF EXISTS public.teams_external_slug_key;
ALTER TABLE public.teams
  ADD CONSTRAINT teams_external_slug_key UNIQUE (external_slug);