ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS external_slug text,
  ADD COLUMN IF NOT EXISTS is_community boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS teams_external_slug_key
  ON public.teams (external_slug) WHERE external_slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.op_structure_sync_state (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  last_run_at timestamptz,
  last_status text NOT NULL DEFAULT 'never',
  last_error text NOT NULL DEFAULT '',
  entry_count integer NOT NULL DEFAULT 0
);

GRANT ALL ON public.op_structure_sync_state TO service_role;

ALTER TABLE public.op_structure_sync_state ENABLE ROW LEVEL SECURITY;

INSERT INTO public.op_structure_sync_state (id) VALUES (true)
ON CONFLICT (id) DO NOTHING;