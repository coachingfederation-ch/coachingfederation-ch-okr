CREATE TYPE public.kr_type AS ENUM ('metric', 'milestone');
CREATE TYPE public.milestone_status AS ENUM ('not_started', 'in_progress', 'done');

ALTER TABLE public.key_results
  ADD COLUMN kr_type public.kr_type NOT NULL DEFAULT 'metric',
  ADD COLUMN measure text NOT NULL DEFAULT '',
  ADD COLUMN instrument text NOT NULL DEFAULT '',
  ADD COLUMN baseline_2026 text NOT NULL DEFAULT '',
  ADD COLUMN baseline_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN current_value text NOT NULL DEFAULT '',
  ADD COLUMN current_as_of date,
  ADD COLUMN target_2027 text NOT NULL DEFAULT '',
  ADD COLUMN milestone_status public.milestone_status NOT NULL DEFAULT 'not_started',
  ADD COLUMN milestone_due date;