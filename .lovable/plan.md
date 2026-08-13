# Creating work as a guided journey

Replace the single "New initiative" form with an ASPIRE-style guided journey. One
"Add work" button in the portfolio header opens a full-height sheet with a step rail;
the number of steps depends on the kind of work chosen in step 1.

## The journey

**Step 1 — What kind of work is this?**
Three large choice cards with a one-line explanation each:
- Idea — a captured thought, no dates or commitments
- Simple task — committed work with an owner and dates
- Initiative — a 90-day leg with signals, a bet and milestones

**Step 2 — Where does it belong?**
Objective and key result (grouped select, pre-filled from an active KR filter),
optional secondary key results, and team. Shown for every kind.

**Step 3 — The work itself**
- Idea: title, the idea, why now, proposed owner, size. Journey ends here.
- Simple task: title, description, owner, status, start and end dates. Ends here.
- Initiative: title, description, lead, owner, status.

**Step 4 — Aspiration and the 90-day leg** (initiative only)
Aspiration text, phase number and phase type, start and end dates, learning checkpoint.

**Step 5 — The bet** (initiative only)
"We believe that if we ___, then ___, and we'll learn ___" as three connected inputs,
plus a confidence choice (pretty confident / worth testing / wild card).

**Step 6 — Signals** (initiative only)
Repeatable rows: name, evidence type (see / hear / measure), how it's noticed,
starting point, direction. Skippable.

**Step 7 — Milestones** (initiative only)
Repeatable rows: title, owner, due date. Skippable.

**Step 8 — Review and create**
A compact one-pager preview of everything captured, mirroring the detail page layout,
with a "Create" action. Nothing is written to the database before this step.

## AI nudges

At the aspiration, bet and signals steps, editors get a "Suggest with the assistant"
button. It sends the title, description and KR context to the existing drafting service
and returns editable suggestions the user can apply into the fields or ignore. Nothing is
auto-applied and nothing is saved by the assistant.

## Behaviour details

- Back / next navigation with a clickable step rail; steps already completed can be
  revisited. Required fields per step gate "next" and show inline hints.
- A confirm dialog protects closing the sheet with unsaved progress.
- Kind can be changed on step 1 while going back; the later steps re-shape accordingly.
- After creation the user lands on the new item's detail one-pager.
- Existing edit sheet, detail page, filters and cards stay as they are.

## Technical notes

- New `src/components/okr/WorkJourney.tsx` replaces `NewInitiativeDialog.tsx`
  (deleted). Journey state lives in one local reducer; step components are small
  presentational blocks in the same folder.
- Creation runs `addInitiative` first, then the existing `addSignal` /
  `addMilestone` server functions for the child rows, then a single dashboard
  query invalidation. If a child insert fails, the item still exists and the user is
  told which parts were not saved.
- `addInitiative` currently accepts a subset of columns; its validator and insert are
  extended with the remaining planning fields (size, dates, phase, phase_type,
  aspiration, bet_*, confidence, learning_checkpoint, lead_name, secondary KR ids) so
  one call writes the whole framing.
- No schema changes — every column and child table already exists.
- AI suggestions reuse `generateOkrDrafts` from `src/lib/ai-drafts.functions.ts`;
  no new gateway code.
- New i18n keys for step titles, helper copy and the review screen, in EN/DE/FR/IT
  (Swiss German orthography).
- Styling uses the existing ICF tokens, Quicksand/Plus Jakarta Sans and current sheet,
  button, input and card components only — no new variants.

## PR note

**Summary** — Replaces the one-shot create form for portfolio work with a guided,
kind-aware ASPIRE journey that can launch a complete initiative (framing, bet, signals,
milestones) in a single pass.

**Changes**
- UI: new `WorkJourney` sheet with step rail, review screen and optional AI nudges;
  portfolio header collapses three create buttons into one "Add work";
  `NewInitiativeDialog` removed.
- Backend: `addInitiative` validator/insert extended with the remaining planning
  fields; child rows written through existing signal and milestone functions.
- Config: none.

**Backend / schema changes** — None; no migration.

**Testing & verification** — Create one of each kind end to end; verify KR filter
pre-fill, back navigation across kind changes, cancel-with-progress guard, signals and
milestones appearing on the detail page, editor-only access, and all four locales.

**Risks & rollback** — Blast radius is the create path on `/initiatives`. Reverting the
code restores the old dialog; no data migration involved.

**Follow-ups / known debt** — Creation is not transactional across parent and child
rows; no draft persistence if the sheet is closed.
