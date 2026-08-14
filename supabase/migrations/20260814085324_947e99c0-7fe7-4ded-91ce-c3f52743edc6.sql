CREATE TABLE public.initiative_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_id uuid NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX initiative_interests_initiative_id_idx ON public.initiative_interests(initiative_id);

GRANT INSERT ON public.initiative_interests TO anon;
GRANT SELECT, INSERT, DELETE ON public.initiative_interests TO authenticated;
GRANT ALL ON public.initiative_interests TO service_role;

ALTER TABLE public.initiative_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
  ON public.initiative_interests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 100
    AND length(btrim(email)) BETWEEN 3 AND 255
    AND length(message) <= 1000
  );

CREATE POLICY "Editors can view interests"
  ON public.initiative_interests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete interests"
  ON public.initiative_interests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER set_initiative_interests_updated_at
  BEFORE UPDATE ON public.initiative_interests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();