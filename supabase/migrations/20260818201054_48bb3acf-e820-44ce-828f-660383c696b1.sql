DO $$
DECLARE
  p RECORD;
  new_qual TEXT;
  new_check TEXT;
  sql TEXT;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND cmd <> 'SELECT'
      AND (qual LIKE '%editor%' OR with_check LIKE '%editor%')
  LOOP
    new_qual := replace(p.qual,
      'has_role(auth.uid(), ''editor''::app_role)',
      '(has_role(auth.uid(), ''editor''::app_role) OR has_role(auth.uid(), ''admin''::app_role))');
    new_check := replace(p.with_check,
      'has_role(auth.uid(), ''editor''::app_role)',
      '(has_role(auth.uid(), ''editor''::app_role) OR has_role(auth.uid(), ''admin''::app_role))');

    sql := format('ALTER POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    IF new_qual IS NOT NULL THEN
      sql := sql || format(' USING (%s)', new_qual);
    END IF;
    IF new_check IS NOT NULL THEN
      sql := sql || format(' WITH CHECK (%s)', new_check);
    END IF;
    EXECUTE sql;
  END LOOP;
END $$;