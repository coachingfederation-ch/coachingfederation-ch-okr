ALTER TABLE public.okr_sets
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS source_lang text NOT NULL DEFAULT 'en';

ALTER TABLE public.key_results
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS source_lang text NOT NULL DEFAULT 'en';

ALTER TABLE public.initiatives
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS source_lang text NOT NULL DEFAULT 'en';

ALTER TABLE public.alignment_rows
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS source_lang text NOT NULL DEFAULT 'en';

ALTER TABLE public.pillar_summaries
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS source_lang text NOT NULL DEFAULT 'en';