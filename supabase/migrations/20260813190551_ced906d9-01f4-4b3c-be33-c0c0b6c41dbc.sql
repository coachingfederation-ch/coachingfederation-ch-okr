-- Enums
CREATE TYPE public.initiative_kind AS ENUM ('candidate', 'simple_task', 'initiative');
CREATE TYPE public.work_size AS ENUM ('small', 'medium');
CREATE TYPE public.phase_type AS ENUM ('delivery', 'discovery');
CREATE TYPE public.bet_confidence AS ENUM ('pretty_confident', 'worth_testing', 'wild_card');
CREATE TYPE public.evidence_type AS ENUM ('see', 'hear', 'measure');
CREATE TYPE public.signal_direction AS ENUM ('up', 'down');
CREATE TYPE public.learning_decision AS ENUM ('growing', 'tweak', 'surprise', 'let_go');

-- Teams
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.teams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Editors can insert teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can update teams" ON public.teams FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can delete teams" ON public.teams FOR DELETE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role));
CREATE TRIGGER teams_set_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.teams (name, position) VALUES
  ('Board', 1),
  ('Marketing & Communications', 2),
  ('Events & Programmes', 3),
  ('Membership & Community', 4),
  ('Coaching Excellence', 5);

-- Initiative planning fields
ALTER TABLE public.initiatives
  ADD COLUMN kind public.initiative_kind NOT NULL DEFAULT 'initiative',
  ADD COLUMN size public.work_size,
  ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  ADD COLUMN idea text NOT NULL DEFAULT '',
  ADD COLUMN why_now text NOT NULL DEFAULT '',
  ADD COLUMN proposed_owner text NOT NULL DEFAULT '',
  ADD COLUMN start_date date,
  ADD COLUMN end_date date,
  ADD COLUMN phase integer NOT NULL DEFAULT 1,
  ADD COLUMN phase_type public.phase_type,
  ADD COLUMN aspiration text NOT NULL DEFAULT '',
  ADD COLUMN bet_action text NOT NULL DEFAULT '',
  ADD COLUMN bet_change text NOT NULL DEFAULT '',
  ADD COLUMN bet_question text NOT NULL DEFAULT '',
  ADD COLUMN confidence public.bet_confidence,
  ADD COLUMN learning_checkpoint date,
  ADD COLUMN support_needed text NOT NULL DEFAULT '',
  ADD COLUMN out_of_scope text NOT NULL DEFAULT '',
  ADD COLUMN lead_name text NOT NULL DEFAULT '';

CREATE INDEX initiatives_team_id_idx ON public.initiatives (team_id);
CREATE INDEX initiatives_kind_idx ON public.initiatives (kind);

-- Signals
CREATE TABLE public.initiative_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  evidence public.evidence_type NOT NULL DEFAULT 'see',
  how_noticed text NOT NULL DEFAULT '',
  starting_point text NOT NULL DEFAULT '',
  direction public.signal_direction,
  sort_order integer NOT NULL DEFAULT 0,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.initiative_signals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.initiative_signals TO authenticated;
GRANT ALL ON public.initiative_signals TO service_role;
ALTER TABLE public.initiative_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view initiative signals" ON public.initiative_signals FOR SELECT USING (true);
CREATE POLICY "Editors can insert initiative signals" ON public.initiative_signals FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can update initiative signals" ON public.initiative_signals FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can delete initiative signals" ON public.initiative_signals FOR DELETE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role));
CREATE INDEX initiative_signals_initiative_id_idx ON public.initiative_signals (initiative_id);
CREATE TRIGGER initiative_signals_set_updated_at BEFORE UPDATE ON public.initiative_signals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Milestones
CREATE TABLE public.initiative_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  owner text NOT NULL DEFAULT '',
  due_date date,
  sort_order integer NOT NULL DEFAULT 0,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.initiative_milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.initiative_milestones TO authenticated;
GRANT ALL ON public.initiative_milestones TO service_role;
ALTER TABLE public.initiative_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view initiative milestones" ON public.initiative_milestones FOR SELECT USING (true);
CREATE POLICY "Editors can insert initiative milestones" ON public.initiative_milestones FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can update initiative milestones" ON public.initiative_milestones FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can delete initiative milestones" ON public.initiative_milestones FOR DELETE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role));
CREATE INDEX initiative_milestones_initiative_id_idx ON public.initiative_milestones (initiative_id);
CREATE TRIGGER initiative_milestones_set_updated_at BEFORE UPDATE ON public.initiative_milestones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Learning check-ins
CREATE TABLE public.initiative_learning_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT current_date,
  author_name text NOT NULL DEFAULT '',
  decision public.learning_decision NOT NULL DEFAULT 'growing',
  what_happened text NOT NULL DEFAULT '',
  signals_telling text NOT NULL DEFAULT '',
  surprised_us text NOT NULL DEFAULT '',
  proud_of text NOT NULL DEFAULT '',
  do_next text NOT NULL DEFAULT '',
  next_move text NOT NULL DEFAULT '',
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.initiative_learning_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.initiative_learning_entries TO authenticated;
GRANT ALL ON public.initiative_learning_entries TO service_role;
ALTER TABLE public.initiative_learning_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view initiative learning" ON public.initiative_learning_entries FOR SELECT USING (true);
CREATE POLICY "Editors can insert initiative learning" ON public.initiative_learning_entries FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can update initiative learning" ON public.initiative_learning_entries FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can delete initiative learning" ON public.initiative_learning_entries FOR DELETE TO authenticated USING (has_role(auth.uid(), 'editor'::app_role));
CREATE INDEX initiative_learning_entries_initiative_id_idx ON public.initiative_learning_entries (initiative_id);
CREATE TRIGGER initiative_learning_entries_set_updated_at BEFORE UPDATE ON public.initiative_learning_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
