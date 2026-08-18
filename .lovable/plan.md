# Fix: admins are blocked from editing (KR insert fails)

## What is happening

Adding a Key Result fails with "new row violates row-level security policy for table key_results".

Confirmed cause (verified against the live database):

- Every write rule on the OKR tables checks for the **editor** role only (`has_role(auth.uid(), 'editor')`).
- Your account currently holds the **admin** role, and only that one — the role sync gives each person exactly one role and removes the others.

So an admin passes the app's "can edit" check in the interface, but fails at the database, which is why the button is there and the save is rejected.

## Fix

1. Update the write rules on all editable tables so they accept **editor or admin**: `okr_sets`, `key_results`, `initiatives`, `initiative_secondary_krs`, `initiative_milestones`, `initiative_signals`, `initiative_learning_entries`, `initiative_interests` (editor-side delete), `alignment_rows`, `pillar_summaries`, `teams`.
2. Leave read access, the role mirror, and the sign-in flow unchanged.

## Technical notes

Single migration replacing each non-SELECT policy's expression with
`has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'admin')` (both `USING` and `WITH CHECK` where applicable). No schema or grant changes; policy names stay the same.

Alternative considered and rejected: granting admins an extra `editor` row in `user_roles`. The sync reconciles to one role per person, so it would be undone on the next sync.

## PR note

**Summary** — Admins could not write to any OKR table because every write policy required the `editor` role; policies now accept editor or admin.

**Changes**
- Backend: policy expressions widened on all editable public tables.
- UI: none.

**Backend / Schema Changes** — One migration recreating existing write policies with an added admin branch. No tables, columns, or grants change.

**Testing & Verification** — As an admin: add a Key Result, edit it, delete it; create and edit an initiative; confirm an editor still works and a signed-in user with no role still sees the read-only notice.

**Risks & Rollback** — Low blast radius; write access widens by one role only. Rollback is a migration restoring the editor-only expressions.

**Follow-ups / Known Debt** — Longer term, replace the two role checks with a single `can_edit(uid)` helper so future tables cannot drift.
