CREATE POLICY "Members can propose initiatives"
  ON public.initiatives FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'member'::app_role)
    AND status = 'proposed'
    AND created_by = auth.uid()
  );

CREATE POLICY "Members can edit own proposals"
  ON public.initiatives FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'member'::app_role)
    AND created_by = auth.uid()
    AND status = 'proposed'
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'member'::app_role)
    AND created_by = auth.uid()
    AND status = 'proposed'
  );

CREATE POLICY "Members can withdraw own proposals"
  ON public.initiatives FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'member'::app_role)
    AND created_by = auth.uid()
    AND status = 'proposed'
  );