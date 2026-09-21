WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY sort_order NULLS LAST, updated_at NULLS LAST, id) * 10 AS new_order
  FROM public.initiatives
)
UPDATE public.initiatives i
SET sort_order = r.new_order
FROM ranked r
WHERE i.id = r.id;