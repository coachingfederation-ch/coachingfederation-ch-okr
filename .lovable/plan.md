# Merging the OKR dashboard into ICF Switzerland Welcome

Welcome becomes the single app. Everything on this dashboard — goals, key
results, the initiative portfolio, the report, the volunteer page, the voice
walkthrough and Aspira — moves there and lives under Welcome's own navigation
and login. This project is retired at the end, with its address forwarding to
the new pages.

This is a substantial move, so it runs in stages, each one usable on its own.

## Where the work happens

Almost all of it happens inside the Welcome project, not here. In this project
I can only prepare the material to hand over (data export, page inventory,
content) and, at the very end, switch the old address over. The building itself
has to be done with the Welcome project open.

## Stage 1 — Decide what moves as-is

An inventory of what exists today and what it becomes in Welcome:

- Goals overview, initiative portfolio, initiative detail, report — move as-is.
- Volunteer "Get involved" page — likely merges with Welcome's own member-facing
  pages rather than arriving as a separate page.
- OKR playground, style guide, voice walkthrough, Aspira the assistant — move,
  but they are candidates for dropping if Welcome should stay leaner.
- Access directory and the role mirror — disappear entirely. Once there is one
  app, roles come straight from Welcome; no mirroring, no overrides, no
  directory sync, no shared secret.

## Stage 2 — Move the data

All OKR tables (goal sets, key results, initiatives with their milestones,
signals and learning entries, teams, alignment rows, volunteer interests,
translations) are copied into Welcome's database, keeping their identifiers so
existing links and relations survive. Teams stop being a mirror of Welcome's
operational structure and simply become that structure.

Access rules are rewritten against Welcome's own roles: read for everyone,
propose for members, edit for editors and admins — the same behaviour as today,
expressed once instead of twice.

## Stage 3 — Move the pages

The pages are rebuilt in Welcome under its header, footer, language switcher and
design. Wording, the four languages, and the Aspira material come across
unchanged. Welcome's navigation gains an entry for the goals area.

## Stage 4 — Switch over

Welcome goes live with the OKR area; this project is frozen (read-only), and
`aspire.coachingfederation.ch` is pointed at the corresponding pages in Welcome
so existing links and bookmarks keep working. Once traffic has moved, this
project is archived.

## What I need from you before Stage 2

- Whether the playground, style guide, voice walkthrough and Aspira come along.
- Whether the volunteer page merges into an existing Welcome page or arrives as
  its own.
- Whether `aspire.coachingfederation.ch` should keep working (forwarding) or be
  retired.

## Technical notes

- Two separate Lovable Cloud databases: the move is an export/import of the
  public-schema OKR tables with identifiers preserved, plus the enum types
  (`app_role`, `initiative_*`, `kr_type`, `phase_type`, …) and the triggers
  (`set_updated_at`, `sync_initiative_okr_set`).
- `role_directory`, `role_overrides`, `role_sync_state`, `op_structure_sync_state`
  and the `/api/public/role-sync`, `/api/public/op-structure-sync` endpoints are
  dropped, along with `ROLE_DIRECTORY_SECRET` on both sides. `src/lib/access.*`
  collapses into Welcome's existing role check.
- `teams.external_slug` becomes the primary key relationship to Welcome's units
  rather than a matching key.
- Server functions (`okr.functions.ts`, `op-structure.functions.ts`,
  `interests.functions.ts`, `ai-drafts.functions.ts`) port directly if Welcome is
  also TanStack Start; otherwise they are rewritten against its server layer.
  Worth confirming Welcome's stack before Stage 3.
- Aspira needs `/api/chat`, the ElevenLabs voice token route and its keys in
  Welcome.
- `sitemap.xml`, `robots.txt` and `llms.txt` are merged into Welcome's versions;
  old URLs get permanent redirects to preserve search ranking.

## PR note

**Summary** — Consolidate the OKR dashboard into ICF Switzerland Welcome so one
app serves members, with Welcome's own login and roles replacing the mirrored
directory.

**Changes** — Inventory and decisions (Stage 1); data migration into Welcome
(Stage 2); page rebuild under Welcome's shell (Stage 3); cutover, redirects and
freeze of this project (Stage 4).

**Backend / schema changes** — Full OKR schema created in Welcome's database with
data copied over; role-mirror tables, sync endpoints and the shared secret
removed from both sides; RLS rewritten against Welcome's roles.

**Testing & verification** — Per stage: row counts and spot checks after import;
read/propose/edit verified as member, editor, admin and signed-out; all four
languages; old URLs verified to redirect.

**Risks & rollback** — Largest risk is data loss or identifier drift during the
import; mitigated by preserving ids and keeping this project intact and readable
until cutover is proven. Rollback before cutover is "do nothing"; after cutover,
point the domain back.

**Follow-ups / known debt** — Deciding the fate of the playground, style guide,
voice walkthrough and Aspira; Welcome's stack determines how much server code can
be ported unchanged.
