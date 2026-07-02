## Problem

The "New initiative" form currently opens as a centered modal Dialog. On the current viewport it:
- overflows horizontally (Key Result select is clipped on the right)
- floats over the page content awkwardly
- pushes the Create/Cancel buttons close to the bottom edge

## Proposed fix

Replace the Dialog with a right-side **Sheet** (shadcn `Sheet` component) — a slide-in side panel. This is the best fit because:
- Fixed width (`sm:max-w-md`) with built-in vertical scroll, so long selects and textareas never clip
- Doesn't obscure the initiative list underneath — user keeps context
- Consistent pattern for "create / edit record" flows
- Works well on mobile (full width) and desktop (side panel)

A bottom Drawer was considered but is less ergonomic on desktop for a 5-field form; Sheet is the standard shadcn choice here.

## Changes

**`src/components/okr/NewInitiativeDialog.tsx`**
- Swap `Dialog` / `DialogContent` / `DialogHeader` / `DialogTitle` / `DialogDescription` / `DialogFooter` for `Sheet` / `SheetContent` (side="right") / `SheetHeader` / `SheetTitle` / `SheetDescription` / `SheetFooter`
- Content wrapper: `w-full sm:max-w-md flex flex-col` with a scrollable middle section (`flex-1 overflow-y-auto`) holding the 5 fields, and a sticky `SheetFooter` for Cancel / Create
- Keep all existing form state, validation, i18n strings, mutation logic, and trigger button unchanged
- Preserve the current field order: Key Result, Title, Owner, Description, Status

**No changes** to schemas, server functions, i18n strings, or the trigger button in `src/routes/initiatives.tsx`.

## Verification

- Open `/initiatives`, click **+ New initiative** → panel slides in from the right, no horizontal clipping
- Fields scroll independently; Create / Cancel remain visible at the bottom
- Submit still creates the initiative and closes the panel
- Check mobile viewport: panel takes full width
