# Confirm dialog for deleting an OKR set

Today the X button on an OKR card deletes via the browser's native `confirm()` popup, which is easy to dismiss accidentally and doesn't match the app's look. Replace it with the same styled confirmation dialog already used for deleting an initiative.

## What changes

- The X on an OKR card opens a confirmation dialog showing the OKR number and title, a warning that key results and initiatives are deleted too, and that it cannot be undone.
- Two buttons: Cancel (default focus) and a destructive Delete. Nothing is deleted until Delete is pressed.
- The same treatment for the "Delete key result" action in the key result detail panel, which currently also uses a native `confirm()`.
- Localised in DE, FR, IT, EN.

## Technical notes

- `src/routes/index.tsx`: in `OkrCard`, replace the `confirm(...)` in the X button handler with local `confirmOpen` state driving a shadcn `AlertDialog` (already in `src/components/ui/alert-dialog.tsx`, pattern as in `EditInitiativeDialog.tsx`). Same in `KrDetailSheet` for `m.deleteKr`, keeping the existing `onClose()` after confirm.
- `src/lib/i18n-strings.ts`: add `okr.deleteConfirmBody` and `kr.deleteConfirmBody` keys (with the "cannot be undone / includes key results and initiatives" wording) in all four locales; reuse existing `okr.deleteConfirm` / `kr.deleteConfirm` as dialog titles and `common.cancel` for the cancel action.
- No changes to server functions, data model, or delete behaviour itself.

## PR note

- **Summary** — Replace native `confirm()` prompts for OKR set and key result deletion with the app's styled AlertDialog, so destructive actions require a deliberate second confirmation.
- **Changes** — UI: AlertDialog in `OkrCard` and `KrDetailSheet` (`src/routes/index.tsx`); i18n: two new body strings x 4 locales.
- **Backend / Schema Changes** — None.
- **Testing & Verification** — Typecheck; verify as an authorised editor that Cancel/Escape/overlay click do not delete, Delete removes the set, and the key result sheet closes only after confirmed deletion; check all four languages render the dialog text.
- **Risks & Rollback** — Low, confined to two handlers; revert the file changes to restore prior behaviour.
- **Follow-ups** — Initiative deletion already uses AlertDialog; no other native `confirm()` calls remain after this change.
