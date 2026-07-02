## Problem

The Sheet panel renders at ~`sm:max-w-md` (~28rem), but the input fields (Key Result select, Title textarea, etc.) extend beyond the panel's right edge, overflowing outside the sheet. Root cause: the scrollable inner container is missing `min-w-0`, so its flex/grid children (full-width inputs and the long KR SelectValue text) push the container wider than the sheet.

## Fix

Constrain the form to the sheet width:

**`src/components/okr/NewInitiativeDialog.tsx`**
- Add `min-w-0` to the scrollable body wrapper and to each `grid gap-1.5` field wrapper so inputs shrink to their container.
- Add `w-full min-w-0` to the `SelectTrigger` elements (Key Result, Status) so the trigger cannot exceed the panel width, and add `truncate` to their `SelectValue` so long KR labels ellipsize instead of stretching the trigger.
- Keep `SheetContent` at `w-full sm:max-w-md` — width stays the same; content now respects it.

No changes to schemas, server functions, i18n, or the trigger button.

## Verification

- Open `/initiatives` → click **+ New initiative**
- Confirm all fields sit fully inside the sheet with no horizontal overflow
- Confirm the long KR label truncates with an ellipsis inside the select trigger
- Confirm the sheet still opens full-width on mobile
