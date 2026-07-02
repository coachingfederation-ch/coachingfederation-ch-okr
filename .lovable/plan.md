# KR cards + per-KR initiatives

Reshape each OKR so key results are the primary unit: a responsive grid of KR cards, each owning its initiatives, opened in a side sheet for editing/details. The alignment analysis re-renders off the same reactive state.

## Data model

- Add `kr_id uuid` to `public.initiatives`, FK to `public.key_results(id) ON DELETE CASCADE`, indexed.
- Backfill: for each existing initiative, set `kr_id` = first KR (by `position`, then `created_at`) of its `okr_set_id`. Orphans (sets with no KRs) get deleted.
- Make `kr_id NOT NULL` after backfill. Keep `okr_set_id` for now (denormalized convenience, faster set-level queries) and add a trigger that keeps it in sync with `kr_id`'s parent set — or drop it if we prefer strict normalization. Plan: **keep `okr_set_id`**, enforce consistency via a `BEFORE INSERT/UPDATE` trigger.
- RLS/grants unchanged — inherits current initiative policies.

## Server functions (`src/lib/okr.functions.ts` or equivalent)

- `addInitiative` input gains `kr_id` (required); `okr_set_id` derived server-side from the KR.
- `updateInitiative` allows moving an initiative between KRs of the same set (optional now; can defer).
- Loader payload nests initiatives under each KR: `OkrSetDTO.key_results[i].initiatives: InitiativeDTO[]`. Remove the top-level `set.initiatives` array (or leave as computed for a brief migration).

## UI — `src/routes/index.tsx`

- Replace the KR table inside `OkrCard` with a responsive grid: `grid gap-4 sm:grid-cols-2 xl:grid-cols-3` of `KrCard` components.
- `KrCard` shows: KR number badge, title/text (truncate to ~3 lines), target, lead, initiative count, and a "Open" affordance (whole card is a button).
- Remove the "Related projects & initiatives" section from `OkrCard`.
- New `KrDetailSheet` (shadcn `Sheet`, right side, ~520px): editable KR fields (text, target, lead), and an initiatives table with inline add/edit/delete — same interaction model already used elsewhere. Closing the sheet returns to the dashboard.
- Alignment analysis: since it reads from the same query cache, invalidation on KR/initiative mutations auto-refreshes it. No structural change needed beyond pointing it at the nested shape.

## Detail view: sheet vs route

Chosen: **modal side sheet** (per your answer). State is local to the dashboard; no URL change. If deep-linking is wanted later, we can add `?kr=<id>` search-param sync in a follow-up.

## Out of scope

- Moving initiatives between KRs via drag/drop.
- Deep-linkable KR URLs.
- Per-KR permissions or owners beyond the existing `lead` field.

## Files touched

- `supabase/migrations/<new>.sql` — add `kr_id`, backfill, NOT NULL, trigger, index.
- `src/lib/okr.functions.ts` (or the current initiatives module) — signatures + loader shape.
- `src/routes/index.tsx` — `OkrCard` grid, new `KrCard`, new `KrDetailSheet`, remove old initiatives block.
- Types regenerated after migration approval.
