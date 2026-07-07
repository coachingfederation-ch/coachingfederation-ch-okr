# Refactor KR ↔ Initiative relationships

## Goal

Initiatives are created and deleted exclusively from the Portfolio view (`/initiatives`). The KR detail sheet (`/`) only **links** or **unlinks** existing initiatives — no create, no delete.

## KR detail sheet changes (`src/routes/index.tsx`)

- Remove the "Add new initiative" input + button at the bottom of the Related Initiatives section.
- Remove the per-row `X` delete button on primary initiatives.
- Remove the `initDraft` state and `submitInit` handler.
- Add a **"Link initiatives"** button in the section header (editor-only) that opens a new dialog.
- Each row (primary and secondary) gets an unlink button (`X`) that:
  - For a **secondary** row on this KR → removes the secondary link only.
  - For a **primary** row → disabled with tooltip "Change primary KR in Link dialog" (unlinking primary would orphan the initiative).
- Keep the two-table layout (Primary + Secondary) already in place.

## New component: `LinkInitiativesDialog` (`src/components/okr/LinkInitiativesDialog.tsx`)

Modal opened from the KR sheet. Shows all portfolio initiatives with:

- Search box (filters by initiative text, OKR title, KR label, owner).
- One row per initiative with:
  - Initiative title + origin chip (`OKR.KR`) + owner.
  - A three-state selector for this KR: **None / Secondary / Primary** (radio group or segmented control).
    - "Primary" is exclusive across KRs — picking it re-parents the initiative (moves `initiatives.kr_id` to this KR, and drops it from `initiative_secondary_krs` for this KR if present).
    - "Secondary" adds an entry to `initiative_secondary_krs` for this KR (only allowed if the initiative's primary is a different KR).
    - "None" removes both.
- Save button batches the deltas into server calls; Cancel discards.

## Server functions (`src/lib/okr.functions.ts`)

Add a single new server function to keep the client simple:

```
setKrInitiativeLinks({
  kr_id,
  primary_initiative_ids: string[],   // initiatives whose kr_id must equal kr_id after the call
  secondary_initiative_ids: string[], // initiatives that must have a secondary link to kr_id after the call
})
```

Handler (editor-only, `requireSupabaseAuth`):

1. Load current primaries for `kr_id` (from `initiatives.kr_id`) and current secondary links (`initiative_secondary_krs` where `kr_id = kr_id`).
2. Compute diffs:
   - Primary added → `UPDATE initiatives SET kr_id = :kr_id WHERE id IN (added)` (trigger `sync_initiative_okr_set` already keeps `okr_set_id` in sync).
   - Primary removed → these initiatives now need a new primary. Since re-parenting only happens through this same dialog (which sets primary explicitly), the "removed" set here should always be empty; if not, reject with a clear error.
   - Secondary added → INSERT rows into `initiative_secondary_krs`.
   - Secondary removed → DELETE those rows.
3. If an initiative is set as primary here, also delete its secondary row for this KR (mutually exclusive).

Keep `deleteInitiative` as-is (Portfolio still uses it). Remove no server function.

## Portfolio view (`src/routes/initiatives.tsx` + `EditInitiativeDialog`)

- Portfolio already creates initiatives via `NewInitiativeDialog` — no change.
- Ensure `EditInitiativeDialog` exposes **Delete initiative** (it already does, per prior turns — verify and keep).
- No behavioral change otherwise.

## i18n strings (`src/lib/i18n-strings.ts`)

Add EN/DE/FR/IT for:

- `initiative.link` — "Link initiatives"
- `initiative.linkDialog.title` — "Link initiatives to KR {kr}"
- `initiative.linkDialog.search` — "Search initiatives…"
- `initiative.linkDialog.role.none` / `.secondary` / `.primary`
- `initiative.linkDialog.primaryHint` — "Setting an initiative as Primary moves it from its current KR."
- `initiative.unlinkPrimaryDisabled` — tooltip on disabled primary unlink button.
- `initiative.createInPortfolio` — small helper text shown where the old "Add" input used to be: "New initiatives are created in the Portfolio."

## Files touched

- `src/routes/index.tsx` — KR sheet section rewrite, dialog wiring.
- `src/components/okr/LinkInitiativesDialog.tsx` — new.
- `src/lib/okr.functions.ts` — add `setKrInitiativeLinks`.
- `src/lib/i18n-strings.ts` — new keys.

No schema migration needed — existing `initiatives.kr_id` + `initiative_secondary_krs` cover both link types.
