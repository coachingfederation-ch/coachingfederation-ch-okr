
-- Enums
CREATE TYPE public.app_role AS ENUM ('editor', 'admin');
CREATE TYPE public.contribution AS ENUM ('none', 'secondary', 'primary');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================================================
-- user_roles
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Auto-grant editor to every new user (internal-team default)
CREATE OR REPLACE FUNCTION public.grant_editor_on_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'editor')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_grant_editor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_editor_on_signup();

-- =========================================================
-- pillar_summaries
-- =========================================================
CREATE TABLE public.pillar_summaries (
  code TEXT PRIMARY KEY CHECK (code IN ('SG','OE','CE')),
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pillar_summaries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pillar_summaries TO authenticated;
GRANT ALL ON public.pillar_summaries TO service_role;
ALTER TABLE public.pillar_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pillars" ON public.pillar_summaries FOR SELECT USING (true);
CREATE POLICY "Editors can update pillars" ON public.pillar_summaries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE TRIGGER pillars_set_updated_at BEFORE UPDATE ON public.pillar_summaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- okr_sets
-- =========================================================
CREATE TABLE public.okr_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled OKR',
  role_label TEXT NOT NULL DEFAULT 'Owner',
  role_name TEXT NOT NULL DEFAULT '',
  customer TEXT NOT NULL DEFAULT '',
  pillars TEXT[] NOT NULL DEFAULT '{}',
  objective TEXT NOT NULL DEFAULT '',
  alignment TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.okr_sets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.okr_sets TO authenticated;
GRANT ALL ON public.okr_sets TO service_role;
ALTER TABLE public.okr_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view okr_sets" ON public.okr_sets FOR SELECT USING (true);
CREATE POLICY "Editors can insert okr_sets" ON public.okr_sets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can update okr_sets" ON public.okr_sets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can delete okr_sets" ON public.okr_sets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'editor'));
CREATE TRIGGER okr_sets_set_updated_at BEFORE UPDATE ON public.okr_sets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX okr_sets_sort_idx ON public.okr_sets (sort_order);

-- =========================================================
-- key_results
-- =========================================================
CREATE TABLE public.key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_set_id UUID NOT NULL REFERENCES public.okr_sets(id) ON DELETE CASCADE,
  kr TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  target TEXT NOT NULL DEFAULT '',
  lead TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.key_results TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.key_results TO authenticated;
GRANT ALL ON public.key_results TO service_role;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view key_results" ON public.key_results FOR SELECT USING (true);
CREATE POLICY "Editors can insert key_results" ON public.key_results FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can update key_results" ON public.key_results FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can delete key_results" ON public.key_results FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'editor'));
CREATE TRIGGER key_results_set_updated_at BEFORE UPDATE ON public.key_results
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX key_results_set_sort_idx ON public.key_results (okr_set_id, sort_order);

-- =========================================================
-- initiatives
-- =========================================================
CREATE TABLE public.initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_set_id UUID NOT NULL REFERENCES public.okr_sets(id) ON DELETE CASCADE,
  text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.initiatives TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.initiatives TO authenticated;
GRANT ALL ON public.initiatives TO service_role;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view initiatives" ON public.initiatives FOR SELECT USING (true);
CREATE POLICY "Editors can insert initiatives" ON public.initiatives FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can update initiatives" ON public.initiatives FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can delete initiatives" ON public.initiatives FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'editor'));
CREATE TRIGGER initiatives_set_updated_at BEFORE UPDATE ON public.initiatives
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX initiatives_set_sort_idx ON public.initiatives (okr_set_id, sort_order);

-- =========================================================
-- alignment_rows
-- =========================================================
CREATE TABLE public.alignment_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar TEXT NOT NULL,
  sg public.contribution NOT NULL DEFAULT 'none',
  oe public.contribution NOT NULL DEFAULT 'none',
  ce public.contribution NOT NULL DEFAULT 'none',
  how TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.alignment_rows TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.alignment_rows TO authenticated;
GRANT ALL ON public.alignment_rows TO service_role;
ALTER TABLE public.alignment_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view alignment_rows" ON public.alignment_rows FOR SELECT USING (true);
CREATE POLICY "Editors can insert alignment_rows" ON public.alignment_rows FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can update alignment_rows" ON public.alignment_rows FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'editor'));
CREATE POLICY "Editors can delete alignment_rows" ON public.alignment_rows FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'editor'));
CREATE TRIGGER alignment_rows_set_updated_at BEFORE UPDATE ON public.alignment_rows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
