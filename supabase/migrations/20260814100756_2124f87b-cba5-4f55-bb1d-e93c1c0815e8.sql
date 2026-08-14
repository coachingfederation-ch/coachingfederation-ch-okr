REVOKE ALL ON public.initiative_interests FROM anon;
REVOKE ALL ON public.initiative_interests FROM authenticated;
GRANT INSERT ON public.initiative_interests TO anon;
GRANT SELECT, INSERT, DELETE ON public.initiative_interests TO authenticated;
GRANT ALL ON public.initiative_interests TO service_role;