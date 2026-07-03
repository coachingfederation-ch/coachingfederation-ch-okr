## Goal

Clicking an initiative card on `/initiatives` opens a side-sheet showing the same fields as the "New Initiative" dialog, pre-filled and editable, plus a "Delete initiative" action.

## Changes

### 1. New component `src/components/okr/EditInitiativeDialog.tsx`

Sheet-based editor mirroring `NewInitiativeDialog`'s layout:

- Fields: KR (read-only display, editing KR is out of scope), Title, Owner, Description, Status — pre-filled from the selected initiative (using `pickTranslation` for current locale).
- Save button → calls existing `updateInitiative` server fn with a patch of changed fields, `sourceLang: locale`.
- Delete button (destructive variant, left-aligned in footer) → confirms via `AlertDialog`, then calls existing `deleteInitiative` server fn.
- Both actions invalidate `["dashboard"]`, toast, close sheet.
- Only shown when `canEdit`; for viewers, open a read-only variant (same layout, inputs disabled, no Save/Delete).

### 2. `src/routes/initiatives.tsx`

- Add state `const [editing, setEditing] = useState<FlatInitiative | null>(null)`.
- Make `InitiativeCard` clickable: wrap card body in a button/role, `onClick` → `setEditing(item)`. Keep the inline status `Select` and existing `EditableText` fields working (stop propagation on those controls so clicks there don't open the sheet). Alternative: remove inline editing in favor of the dialog. **Proposal: keep inline editing, add click-to-open on non-interactive areas** (card background, title area — but title is `EditableText`, so use a dedicated "Open" affordance instead: make the OKR badge row + a chevron in the top-right open the sheet). Simpler: add a small "Open" icon button (`Maximize2` / `Pencil`) top-right of each card that opens the sheet — avoids event conflicts with inline editors.
- Render `<EditInitiativeDialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)} initiative={editing} dashboard={data} />`.

### 3. i18n strings (`src/lib/i18n-strings.ts`)

Add keys with EN/DE/FR/IT translations:

- `initiatives.editTitle` — "Edit initiative"
- `initiatives.delete` — "Delete initiative"
- `initiatives.deleteConfirmTitle` — "Delete this initiative?"
- `initiatives.deleteConfirmBody` — "This action cannot be undone."
- `initiatives.deleted` — "Initiative deleted"
- `initiatives.updated` — "Initiative updated"
- `common.save` / `common.saving` (if not present)
- `initiatives.open` — aria-label for the open button

### 4. Verification

- `bun run build`
- Playwright: sign in, open `/initiatives`, click open icon on a card, edit title, save → toast + card updates. Click delete → confirm → card disappears.

## Open question

Should the whole card be clickable (I'd remove inline `EditableText` and status `Select` from the card, moving all editing into the sheet — cleaner UX), or keep inline editing and add a small "open detail" icon button? I'll go with the **icon button** approach to preserve current inline behavior unless you prefer the full-card-clickable variant.  
  
Answer: Go with icon button