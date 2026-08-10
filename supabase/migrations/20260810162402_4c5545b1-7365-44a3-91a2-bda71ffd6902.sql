CREATE TYPE public.initiative_availability AS ENUM ('open','blocked','parked');
CREATE TYPE public.initiative_commitment AS ENUM ('one_off','recurring','workstream');
CREATE TYPE public.initiative_help_needed AS ENUM ('lead','helpers','skill');

ALTER TABLE public.initiatives
  ADD COLUMN availability public.initiative_availability NOT NULL DEFAULT 'open',
  ADD COLUMN blocked_reason text NOT NULL DEFAULT '',
  ADD COLUMN commitment public.initiative_commitment,
  ADD COLUMN help_needed public.initiative_help_needed,
  ADD COLUMN skill_note text NOT NULL DEFAULT '';