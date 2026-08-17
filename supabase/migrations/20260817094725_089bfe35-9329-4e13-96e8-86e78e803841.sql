CREATE TABLE public.role_directory (
  email text PRIMARY KEY,
  role app_role NOT NULL,
  source_roles text[] NOT NULL DEFAULT '{}',
  synced_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.role_directory TO service_role;
ALTER TABLE public.role_directory ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.role_sync_state (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  last_run_at timestamptz,
  last_status text NOT NULL DEFAULT 'never',
  last_error text NOT NULL DEFAULT '',
  entry_count integer NOT NULL DEFAULT 0
);

GRANT ALL ON public.role_sync_state TO service_role;
ALTER TABLE public.role_sync_state ENABLE ROW LEVEL SECURITY;

INSERT INTO public.role_sync_state (id) VALUES (true);

GRANT ALL ON public.user_roles TO service_role;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_editor ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed_grant_editor ON auth.users;
DROP FUNCTION IF EXISTS public.grant_editor_on_signup();

INSERT INTO public.role_directory (email, role, source_roles)
VALUES
  ('hartmuth.gieldanowski@coachingfederation.ch', 'admin', ARRAY['seed']),
  ('susan.mackay@coachingfederation.ch', 'editor', ARRAY['seed']),
  ('beril.esendal@coachingfederation.ch', 'editor', ARRAY['seed']),
  ('alessandra.nunes@coachingfederation.ch', 'editor', ARRAY['seed'])
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, d.role
FROM auth.users u
JOIN public.role_directory d ON d.email = lower(u.email)
ON CONFLICT (user_id, role) DO NOTHING;