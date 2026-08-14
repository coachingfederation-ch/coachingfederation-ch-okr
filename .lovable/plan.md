# Work journey as a centred overlay window

Move the "Add work" journey out of the right-hand drawer and into a centred modal
overlay, so the multi-step flow gets room to breathe instead of a narrow column.

## What changes

- The journey opens as a large centred window (roughly 5xl wide, capped at ~85% of the
  screen height) over a dimmed backdrop, instead of sliding in from the right.
- Layout inside the window becomes two columns on desktop:
  - a left step rail listing the steps by name with their state (done / current / upcoming),
    clickable for already-visited steps
  - the step content on the right, scrolling on its own
  - on mobile the rail collapses back to the current compact dot row above the content
- Header keeps the eyebrow, step title and helper text; footer keeps Back / Next / Create
  pinned at the bottom of the window.
- Form fields get a two-column grid where it makes sense on the wider surface
  (context step, work framing, leg dates), keeping single column on narrow screens.
- Everything else stays: step order, validation gating, AI nudges, discard-progress
  confirm dialog, and the create behaviour.

## Technical notes

- `src/components/okr/WorkJourney.tsx` swaps `Sheet`/`SheetContent`/`SheetHeader`/
  `SheetFooter` for `Dialog`/`DialogContent`/`DialogHeader`/`DialogFooter`
  (`@/components/ui/dialog`), keeping the same `open` / `requestClose` wiring.
- `DialogContent` gets `className="flex max-h-[85vh] w-[min(100vw-2rem,64rem)] max-w-none flex-col gap-0 overflow-hidden p-0"`
  so the body is the only scroll area.
- The step rail becomes a small `StepRail` block inside the same file: `<ol>` of buttons,
  hidden below `md`, with the existing dot row shown only below `md`.
- The nested discard `AlertDialog` stays as-is; it renders above the dialog layer.
- No changes to server functions, schemas, i18n keys or styling tokens — existing
  ICF tokens and typography only.

## PR note

**Summary** — Presents the ASPIRE work-creation journey in a centred modal window with a
named step rail rather than a right-side drawer, giving the multi-step form usable width.

**Changes**
- UI: `WorkJourney.tsx` switches Sheet primitives to Dialog primitives; adds a desktop
  step rail and two-column field grids; mobile keeps the compact dot rail.

**Backend / schema changes** — None.

**Testing & verification** — Create an idea, a simple task and a full initiative end to
end; check step-rail navigation, validation gating, the discard guard, keyboard focus
trapping and Escape, plus mobile (375px) and desktop widths in all four locales.

**Risks & rollback** — Blast radius is the create path on `/initiatives`; reverting the
single component file restores the drawer.

**Follow-ups / known debt** — `EditInitiativeDialog` still uses the drawer presentation;
aligning it is a separate change.
