# Drag and drop on the Initiative Portfolio

Let editors and admins move cards around the portfolio with the mouse (and keyboard),
instead of opening each card to change its status or team.

## What changes for the user

- Grab a card and drop it into another status column — Planned, In progress, Done,
  Canceled — and the change is saved immediately.
- Drop a card into a different team section and it is reassigned to that team.
- Drop a card between two other cards in a column to set its order; the order is
  stored, so everyone sees the same sequence.
- While dragging, the card follows the cursor and the target column is highlighted.
  Empty columns stay droppable.
- Keyboard: focus a card's drag handle, press space, move with the arrow keys, press
  space again to drop. Screen readers get spoken feedback on pick-up and drop.
- Signed-out visitors and read-only viewers see the board exactly as today — no drag
  handles, no accidental moves. Cards still open their detail page on click.
- If a save fails, the card snaps back and a short error message appears.

## Build order

1. **Ordering data** — a small migration to make card order per column reliable:
   backfill `sort_order` on `initiatives` so existing cards keep their current
   sequence. No new tables.
2. **Move mutation** — one new server function `moveInitiative` (status, team, new
   order position) next to the existing initiative mutations, guarded the same way as
   the other editor writes, reusing the existing row-level rules.
3. **Board interaction** — add the drag library and wrap the team sections and status
   columns in `src/routes/initiatives.index.tsx` as drop targets, with `WorkCard`
   becoming draggable when the viewer can edit.
4. **Optimistic update** — the card moves instantly in the view, then the dashboard
   data is refreshed; on error the previous state is restored and a toast explains.
5. **Translations** — new drag announcements and the error message added for EN, DE,
   FR, IT.

## Technical notes

- Library: `@dnd-kit/core` + `@dnd-kit/sortable` (keyboard and screen-reader support
  built in, works with the existing card markup).
- Droppable id encodes `teamId::status`; the sortable context inside each column holds
  the initiative ids in `sort_order` sequence.
- `moveInitiative` writes `status`, `team_id` and a recomputed `sort_order` for the
  cards in the destination column in one call; ordering stays global per initiative
  row, which matches how the dashboard already sorts.
- The card's full-card link stays, but pointer activation uses a small distance
  constraint so a click still navigates and only a deliberate drag starts a move.
- `canEdit` from `useAuth` gates both the draggable behaviour and the handle.
- Filters stay untouched; dragging while a filter is active still writes the real
  status/team, and the reordering applies to the filtered column's visible sequence.
- Nothing on the OKR page, report or detail route changes; they read the same rows.

## PR note

**Summary** — Adds drag-and-drop to the Initiative Portfolio so editors can change a
card's status, team and order directly on the board.

**Changes**
- UI: draggable cards, droppable status columns and team sections, drag overlay,
  optimistic updates, new announcements.
- Backend/schema: `moveInitiative` server function; migration backfilling
  `sort_order` on `initiatives`.
- Deps: `@dnd-kit/core`, `@dnd-kit/sortable`.

**Backend / schema changes** — backfill of `sort_order` only; no new tables or
columns, no policy changes (existing editor/admin update policy covers the write).

**Testing & verification** — drag across statuses, across teams, reorder within a
column, keyboard drag, signed-out read-only view, filtered view, and confirmation that
key-result initiative counts elsewhere are unchanged.

**Risks & rollback** — blast radius is the portfolio page plus one mutation. Reverting
the code leaves the data valid; `sort_order` values simply stay as written.

**Follow-ups / known debt** — no multi-card selection, no undo beyond re-dragging.
