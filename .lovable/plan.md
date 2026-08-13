# Initiative Portfolio, rebuilt on the ASPIRE structure

Replace the current Initiative Portfolio (kanban board + volunteer toggle) with a single
portfolio surface modelled on ASPIRE Journeys: one list that holds ideas, simple tasks and
full initiatives, grouped by team, stacked by status, with a printable one-pager detail page
per initiative.

## What changes for the user

**One portfolio, three kinds of work**
- **Idea** — a captured thought: title, the idea, why now, proposed owner, size (small/medium).
  No dates, no signals, no bet.
- **Simple task** — committed work with an owner and dates, but no experiment framing.
- **Initiative** — the full 90-day leg: signals, a bet, milestones, learning check-ins.

Kinds are promoted in place (Idea → Simple task → Initiative), so links to key results,
history and ownership stay intact and nothing appears twice.

**Team as a first-class concept**
A new list of teams (e.g. Board, Marketing, Events, Membership). Every piece of work belongs
to one team. The portfolio is grouped into team sections, and inside each team the work is
stacked by status — Planned / In progress / Done / Canceled — so the kanban reading survives
without the four-column board.

**ASPIRE planning fields on an initiative**
- 90-day leg: start date, end date, phase number, phase type (delivery / discovery).
- Signals: up to a handful of milestone signals, each with evidence type (see / hear /
  measure), how it's noticed, starting point and direction.
- The bet: "We believe that if we ___, then ___, and we'll learn ___", with a confidence level.
- Milestones: title, owner, due date.
- Learning check-ins: dated entries with what happened, what the signals say, what surprised
  us, what we're proud of, what to do next, plus a decision (growing / tweak / surprise /
  let go).

**Filters and header**
A pill filter row for kind (All / Ideas / Simple tasks / Initiatives), plus selects for OKR,
key result, team and status. The existing key-result filter banner is kept. The "Add" button
becomes a menu: capture an idea, start a simple task, start an initiative.

**Detail route**
`/initiatives/<id>` renders an ASPIRE-style one-pager: strategic context (objective, primary
and secondary key results), aspiration, signals, bet, milestones, people, and learning
history — print-friendly, same as the board report. Editing continues to happen in the
existing dialog, opened from the detail page and from cards.

**Volunteer signals stay**
Availability, commitment, help needed and skill note are not dropped. They appear as badges
on the cards and as a field group on the detail page, and a "Looking for people" filter
surfaces the same open work the volunteer view showed today. The separate volunteer tab and
the board tab both disappear.

## Build order

1. **Database** — one migration: `teams`, `initiative_signals`, `initiative_milestones`,
   `initiative_learning_entries`, plus new columns on `initiatives` (kind, size, team_id,
   idea, why_now, proposed_owner, start_date, end_date, phase, phase_type, aspiration,
   bet_action, bet_change, bet_question, confidence, learning_checkpoint, support_needed,
   out_of_scope, lead_name). Existing rows default to kind `initiative` so nothing is lost.
   Public read, editor write, matching the policies already on `initiatives`.
2. **Data layer** — extend `okr-schemas.ts` and `okr.functions.ts` with the new fields,
   child collections and the promote / create-by-kind mutations, following the existing
   translation and `sourceLang` handling.
3. **Portfolio page** — rewrite `src/routes/initiatives.tsx` as a layout plus
   `initiatives.index.tsx`: filter row, team sections, status stacks, new preview cards
   (`IdeaCard`, `WorkCard`). Delete `VolunteerView.tsx` and the board/volunteer toggle.
4. **Detail route** — `initiatives.$initiativeId.tsx` with an `InitiativeCard` one-pager and
   print styles reused from the report route.
5. **Editing** — extend `EditInitiativeDialog` with the planning fields, grouped into
   sections; add signals, milestones and learning check-ins as repeatable blocks. Add an
   idea-capture dialog for the lightweight kind.
6. **Translations** — all new labels added to EN/DE/FR/IT in `i18n-strings.ts`, Swiss German
   orthography, in the existing key style.

## Technical notes

- `/initiatives` stays the portfolio URL; the page moves to `initiatives.index.tsx` with
  `initiatives.tsx` reduced to a layout rendering `<Outlet />`.
- Everything reuses the existing `dashboard` query and the ICF token set (Deep Blue, Blue,
  Light Blue, Bone, Yellow) plus Quicksand/Plus Jakarta Sans. No new colors, no new
  component variants beyond those in the style guide.
- Cards keep the OKR/KR context chip and secondary-KR chips, so the portfolio and the OKR
  page continue to agree on counts.
- The OKR page's link dialog, key-result counts, the report route and the assistant are not
  touched; they read the same initiative rows, and every new column is optional.
- Detail route is public-readable like the rest of the dashboard; edit affordances stay
  behind `canEdit`.

## PR note

**Summary** — Replaces the Initiative Portfolio's kanban + volunteer views with a single
ASPIRE-structured portfolio: three kinds of work, team grouping, status stacking, and a
printable per-initiative detail page.

**Changes**
- UI: new portfolio index, preview cards, filter row, detail route, extended edit dialog,
  idea-capture dialog; board and volunteer views removed.
- Backend/schema: 4 new tables, ~19 new columns on `initiatives`, RLS and grants mirroring
  existing policies; extended DTOs and server functions.
- Config: no changes.

**Backend / schema changes** — see step 1; additive only, no destructive changes to existing
initiative data.

**Testing & verification** — signed-out read, editor edit and promote flows, all four
locales, filter combinations, print rendering of the detail page, and confirmation that KR
initiative counts on `/` and the report route are unchanged.

**Risks & rollback** — blast radius is the initiatives route plus the initiatives schema. The
migration is additive, so reverting the code leaves the database safe; new columns simply go
unread.

**Follow-ups / known debt** — no drag-and-drop reordering between statuses in this pass; team
membership is a simple assignment rather than a managed roster.
