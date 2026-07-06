# Fix invisible KR picker popover

The theme in `src/styles.css` never defines `--popover` / `--popover-foreground`, so `bg-popover` resolves to nothing and the picker renders transparent on top of the sheet — which also makes it look like scrolling is broken (the list is there, just invisible).

## Change

In `src/components/okr/EditInitiativeDialog.tsx`, on the `<PopoverContent>` used for the secondary‑KR picker:

- Add `bg-background text-foreground border shadow-lg z-[60]` to the existing className, so it paints an opaque surface above the sheet.
- Wrap the inner `<Command>` with `bg-background` (overrides the component default `bg-popover`).
- Keep the width binding but switch to Tailwind v4's `var(...)` form: `w-[var(--radix-popover-trigger-width)]`.

No changes to the underlying `ui/popover.tsx` or `ui/command.tsx` (they're shared), no data or logic changes. `CommandList` already has `max-h-[300px] overflow-y-auto`, so scrolling starts working as soon as the surface is visible.
