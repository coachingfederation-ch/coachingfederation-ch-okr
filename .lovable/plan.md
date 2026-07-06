# Add Secondary Key Results to Initiatives

Each initiative keeps one primary KR (`kr_id`) and gains a list of additional "secondary" KRs — any KR from any OKR set. Managed in the Edit Initiative dialog with `+` / `−` controls. Cards and filters are unchanged.

## Data model

New junction table `public.initiative_secondary_krs`:
- `initiative_id uuid → initiatives.id` (cascade delete)
- `kr_id uuid → key_results.id` (cascade delete)
- `created_at timestamptz`
- PK `(initiative_id, kr_id)` (prevents duplicates)
- CHECK `kr_id <> (select ... )` isn't safe (subquery), so enforce "not equal to primary KR" in the server function instead.
- GRANTs to `authenticated` / `service_role`; RLS: SELECT for anyone who can read initiatives (mirror existing initiative SELECT policy — likely `TO anon, authenticated`); INSERT/DELETE restricted to editors (mirror initiatives write policy using `has_role`).

## Backend (`src/lib/okr.functions.ts`)

- Dashboard loader: fetch all rows from `initiative_secondary_krs`, group by `initiative_id`, attach `secondary_kr_ids: string[]` to each `InitiativeDTO`.
- New server fn `setInitiativeSecondaryKrs({ id, kr_ids })` (auth required, editor role): validates each `kr_id` exists, filters out the initiative's primary `kr_id`, replaces the set atomically (delete + insert).
- Schemas (`src/lib/okr-schemas.ts`): add `secondary_kr_ids: string[]` to `InitiativeDTO`; export a zod schema for the setter.

## UI (`src/components/okr/EditInitiativeDialog.tsx`)

Below the existing primary KR block, add a "Secondary Key Results" section:
- List of currently selected secondary KRs, each rendered like the primary KR chip (OKR number.KR label + OKR title + KR text), with a `−` button to remove.
- A `+` button opens a searchable picker (Command/Popover) listing every KR across all OKR sets, grouped by OKR, with the primary KR and already-selected ones disabled.
- Local state `secondaryKrIds: string[]`, initialized from `initiative.secondary_kr_ids`, saved via the new server fn alongside the existing update on Save. On success, invalidate `["dashboard"]`.
- Add i18n keys: `initiatives.form.secondaryKrs`, `initiatives.form.addSecondaryKr`, `initiatives.form.noSecondaryKrs`.

## Out of scope

- No changes to initiative cards on `/initiatives` or the KR filter.
- No translations for the link table (it stores only ids).

```text
initiatives ──1──*── initiative_secondary_krs ──*──1── key_results
                     (initiative_id, kr_id) PK
```
