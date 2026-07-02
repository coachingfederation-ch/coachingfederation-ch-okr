## Overview

Turn the current hardcoded dashboard into a live, editable one. Anyone can still view `/`; signed-in users get inline edit affordances everywhere (objective, KRs, initiatives, alignment analysis, pillar summaries). Edits save to a shared Lovable Cloud database with optimistic updates.

## Assumptions

- Anyone signed in counts as an editor (internal team use). Locking this to a curated allowlist can come later — the schema already has a `user_roles` table for it.
- No profile fields are needed (name, avatar, etc.). Users are identified by their Supabase `auth.users` row.
- Auth methods: email/password + Google. `/auth` is the sign-in page; no protected routes (dashboard stays public).
- One shared dataset. There is no per-user copy of the OKRs.

## Data model (Lovable Cloud)

```text
pillar_summaries      code(PK 'SG'|'OE'|'CE'), label, description
okr_sets              id, number, title, role_label, role_name, customer,
                      pillars text[], objective, alignment, sort_order, updated_at
key_results           id, okr_set_id (fk cascade), kr, text, target, lead, sort_order
initiatives           id, okr_set_id (fk cascade), text, sort_order
alignment_rows        id, pillar, sg, oe, ce (enum none|secondary|primary),
                      how, sort_order
user_roles            id, user_id (fk auth.users), role app_role  -- 'editor'|'admin'
```

Migration seeds the exact content currently rendered in `src/routes/index.tsx`.

## RLS + grants

- `SELECT` on all content tables: `TO anon, authenticated` (dashboard is public).
- `INSERT/UPDATE/DELETE`: `TO authenticated USING (public.has_role(auth.uid(),'editor'))`.
- `user_roles`: `SELECT` for `authenticated`; managed via SQL (no client writes).
- Auto-grant trigger on `auth.users` insert: give every new user the `editor` role. Revoke later via SQL if needed.
- `has_role(uuid, app_role)` security-definer function per the standard pattern.

## Routes / files

- `src/routes/index.tsx` — dashboard, now data-driven. Loader primes queries via `ensureQueryData`; component reads with `useSuspenseQuery`. Renders editable or read-only cells based on the auth context.
- `src/routes/auth.tsx` — email/password + Google sign-in card. Redirects to `/` on success.
- `src/routes/__root.tsx` — adds a small header with "Sign in" / user email + "Sign out". Wires the single `onAuthStateChange` listener; feeds `auth` into router context.
- `src/lib/okr.functions.ts` — `createServerFn` reads + mutations (`getDashboard`, `updateOkrSet`, `addKeyResult`, `updateKeyResult`, `deleteKeyResult`, `addInitiative`, `updateInitiative`, `deleteInitiative`, `addOkrSet`, `deleteOkrSet`, `updateAlignmentRow`, `updatePillarSummary`). Reads use the server publishable client (public data). Writes use `requireSupabaseAuth` and rely on RLS.
- `src/lib/okr-schemas.ts` — shared zod schemas (length caps, trims) reused client- and server-side.
- `src/components/okr/EditableText.tsx` — click-to-edit text with save-on-blur/Enter, cancel-on-Escape, length validation.
- `src/components/okr/EditableTable.tsx` — inline row editing for KRs (add/edit/delete).
- `src/components/okr/EditableList.tsx` — initiatives list add/edit/delete.
- `src/components/okr/AuthBadge.tsx` — header sign-in/sign-out control.

## Inline editing behavior

- Click any editable field → becomes an input/textarea in place.
- Save on blur or Enter (Shift+Enter for newline in multi-line fields). Escape reverts.
- Optimistic update via TanStack Query mutation; on error, revert and toast.
- "×" delete buttons on KRs/initiatives, existing "+ Add key result" / "Add" / "+ Add OKR set" buttons become functional.
- The `Steward/Owner/Contact` label is a small select (three fixed values).
- Pillar chips (SG/OE/CE) toggle active on click.
- Alignment analysis dots become a 3-state cycle (none → secondary → primary).
- For non-editors: the dashboard renders unchanged (read-only, no add/delete buttons, no edit affordances).

## Validation

All text fields are trimmed with sensible max lengths (title 120, objective/alignment 1000, KR text 500, target 200, lead 100, initiative 300). Enforced client-side with zod + server-side inside each server function's `inputValidator`.

## Steps

1. Enable Lovable Cloud.
2. Create migration: enums (`app_role`, `contribution`), tables above, `has_role` function, RLS policies, grants, auto-role trigger. Seed all current dashboard content.
3. Build `src/lib/okr-schemas.ts` and `src/lib/okr.functions.ts` (reads + mutations).
4. Add `/auth` route with email/password + Google (`supabase--configure_social_auth` for Google).
5. Update `src/routes/__root.tsx`: `AuthBadge` in a slim top bar, `auth` on router context, single `onAuthStateChange` subscriber.
6. Rewrite `src/routes/index.tsx` to load from server functions and render read-only vs editable based on auth. Extract card into `OkrCard` with editable primitives.
7. Add `EditableText`, `EditableTable`, `EditableList` components using the existing design tokens (no new colors).
8. Wire mutations with optimistic updates + toasts (existing `sonner`).
9. Verify with Playwright: view as guest (read-only), sign in, edit a field, add/delete a KR, add/delete an initiative, add a new OKR set, sign out.

## Out of scope

- Role management UI (grant/revoke editor). Handled via SQL for now.
- Drag-and-drop reordering. Sort order is set on create; can be added later.
- Change history / audit log.
- Multi-language content.
