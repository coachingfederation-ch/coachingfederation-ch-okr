CREATE TABLE public.role_overrides (
  email text PRIMARY KEY,
  role public.app_role NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.role_overrides TO service_role;
ALTER TABLE public.role_overrides ENABLE ROW LEVEL SECURITY;
INSERT INTO public.role_overrides (email, role, note) VALUES
  ('hartmuth.gieldanowski@coachingfederation.ch', 'admin', 'Chapter address for an admin listed in Welcome under a personal address');
