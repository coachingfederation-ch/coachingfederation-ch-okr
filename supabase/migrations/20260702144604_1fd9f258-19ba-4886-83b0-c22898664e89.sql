
-- 1. Add kr_id (nullable first for backfill)
ALTER TABLE public.initiatives
  ADD COLUMN kr_id uuid REFERENCES public.key_results(id) ON DELETE CASCADE;

-- 2. Backfill: pick first KR (by sort_order, then created_at) of each set
WITH first_kr AS (
  SELECT DISTINCT ON (okr_set_id) okr_set_id, id
  FROM public.key_results
  ORDER BY okr_set_id, sort_order ASC, created_at ASC
)
UPDATE public.initiatives i
SET kr_id = fk.id
FROM first_kr fk
WHERE i.okr_set_id = fk.okr_set_id
  AND i.kr_id IS NULL;

-- 3. Delete orphans (sets with no KRs)
DELETE FROM public.initiatives WHERE kr_id IS NULL;

-- 4. NOT NULL + index
ALTER TABLE public.initiatives ALTER COLUMN kr_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS initiatives_kr_id_idx ON public.initiatives(kr_id);

-- 5. Trigger: keep okr_set_id in sync with kr_id's parent set
CREATE OR REPLACE FUNCTION public.sync_initiative_okr_set()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  parent_set uuid;
BEGIN
  SELECT okr_set_id INTO parent_set FROM public.key_results WHERE id = NEW.kr_id;
  IF parent_set IS NULL THEN
    RAISE EXCEPTION 'kr_id % does not exist', NEW.kr_id;
  END IF;
  NEW.okr_set_id := parent_set;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS initiatives_sync_okr_set ON public.initiatives;
CREATE TRIGGER initiatives_sync_okr_set
BEFORE INSERT OR UPDATE OF kr_id ON public.initiatives
FOR EACH ROW EXECUTE FUNCTION public.sync_initiative_okr_set();
