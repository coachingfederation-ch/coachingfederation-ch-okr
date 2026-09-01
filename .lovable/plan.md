# Teams come from the Welcome app's Operational Structure

## Where they are today

The five names in that dropdown — Board, Marketing & Communications, Events & Programmes,
Membership & Community, Coaching Excellence — are not static code. They are five rows in this
app's own `teams` table, seeded once in August and never connected to anything.

The Welcome app keeps the real thing: `op_projects`, the Operational Structure admins edit at
`/il-structure`, with a slug, a name in EN/DE/FR/IT, a sort order, an active flag and a
community flag. That becomes the source of truth.

## What changes

- Teams in the OKR dashboard are a **mirror** of the Welcome Operational Structure, matched by
  slug, refreshed automatically (nightly) and on demand from the admin `/access` page.
- Only **active projects** are imported as teams. Communities come across too but are flagged,
  and are hidden from the team filter and team grouping by default, with a toggle to include
  them.
- Team names, including the German, French and Italian versions maintained in the Welcome app,
  replace the local ones. Teams become read-only here — they are edited where they belong.
- On the first sync, existing teams are matched to imported units **by name**. Matched teams
  keep their id, so every initiative keeps its team. Teams with no match are removed and their
  initiatives fall back to "No team yet", where they can be re-assigned in the portfolio.

## Build order

1. **Welcome app** — add `src/routes/api/public/op-structure.ts`, a read-only export of active
   `op_projects` (slug, names in four languages, sort order, is_community), guarded by the same
   `ROLE_DIRECTORY_SECRET` header the role directory already uses. Nothing beyond structure
   names is exposed.
2. **Migration here** — add `external_slug` (unique, nullable), `is_community` and `is_active`
   to `teams`; add an `op_structure_sync_state` row-table mirroring `role_sync_state`
   (last run, status, error, count). Grants and RLS mirror the existing `teams` policies.
3. **Sync logic** — `src/lib/op-structure.server.ts` with `syncOpStructure()`: fetch the export,
   upsert by slug, fill `translations` with de/fr/it, deactivate or delete units that vanished,
   and on the first run bind existing teams to slugs by normalised name match.
4. **Endpoints** — `src/routes/api/public/op-structure-sync.ts` (secret-guarded, for the
   nightly pg_cron job) plus an admin-only server function for the manual button; schedule the
   cron job to run nightly.
5. **Admin surface** — an "Operational structure" card on `/access`, next to the role directory:
   last sync, unit count, error, Sync now button, and a note that teams are edited in the
   Welcome app.
6. **Portfolio UI** — the team filter and team grouping on `/initiatives` read the imported
   units in Welcome's sort order, exclude communities unless the "include communities" option is
   on, and drop any local team-editing affordance.
7. **Translations** — new labels for the sync card and the community toggle in EN/DE/FR/IT.

## Technical notes

- Two separate databases, so this is HTTP mirroring, exactly like the existing role directory —
  same shared secret, same "no PII beyond what's needed" rule (only unit names travel; no
  members, no assignments).
- `teams.id` stays the primary key that `initiatives.team_id` points at; the slug is a secondary
  identity used for matching. Nothing about the initiative schema changes.
- Name matching runs once, on the first sync, and is case- and punctuation-insensitive
  ("Events & Programmes" matches "Events and Programmes").
- If the Welcome export is unreachable, the sync fails loudly into the state row and leaves the
  existing teams untouched — the dashboard never empties itself because of a network blip.

## PR note

**Summary** — Replaces the OKR dashboard's locally seeded `teams` list with a read-only mirror
of the Welcome app's Operational Structure, synced nightly and on demand by an admin.

**Changes**
- UI: sync status card on `/access`; team filter/grouping on `/initiatives` reads mirrored units,
  communities hidden by default; local team editing removed.
- Backend: new secured export route in the Welcome app; sync helper, secured sync route and
  admin server function here; nightly cron job.
- Schema: `teams.external_slug`, `teams.is_community`, `teams.is_active`;
  new `op_structure_sync_state` table.

**Testing & verification** — first sync against the live Welcome structure with the five existing
teams present (confirm no initiative loses its team); a second sync (idempotent); a sync with a
renamed unit and a removed unit; unauthorised call returns 401; all four locales; signed-out and
editor views of `/initiatives`.

**Risks & rollback** — blast radius is the teams list and the initiatives portfolio filter. The
migration is additive; reverting the code leaves the extra columns unread. A bad sync is
recoverable because unmatched teams are deleted only after the name-binding pass, and the
initiative rows themselves are never deleted.

**Follow-ups / known debt** — assignments and role holders from the Operational Structure are not
imported; initiative owners stay free-text. Communities are imported but have no dedicated view
yet.
