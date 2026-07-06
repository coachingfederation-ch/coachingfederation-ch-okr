CREATE TABLE public.initiative_secondary_krs (
  initiative_id uuid NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  kr_id uuid NOT NULL REFERENCES public.key_results(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (initiative_id, kr_id)
);

CREATE INDEX initiative_secondary_krs_kr_idx ON public.initiative_secondary_krs(kr_id);

GRANT SELECT ON public.initiative_secondary_krs TO anon;
GRANT SELECT, INSERT, DELETE ON public.initiative_secondary_krs TO authenticated;
GRANT ALL ON public.initiative_secondary_krs TO service_role;

ALTER TABLE public.initiative_secondary_krs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view secondary krs"
  ON public.initiative_secondary_krs FOR SELECT
  USING (true);

CREATE POLICY "Editors can insert secondary krs"
  ON public.initiative_secondary_krs FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete secondary krs"
  ON public.initiative_secondary_krs FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role));