# Initiative Portfolio — Kanban view

New public route `/initiatives` with a 4-column Kanban of all initiatives across all OKR sets. Cards show title, owner, description, and a status dropdown. Editors can edit inline; viewers read-only. Owner and description auto-translate on save, matching the existing OKR content flow.

## 1. Database

Migration adds three columns to `public.initiatives`:
- `owner TEXT NOT NULL DEFAULT ''`
- `description TEXT NOT NULL DEFAULT ''`
- `status TEXT NOT NULL DEFAULT 'planned'` with a CHECK constraint on `('planned','in_progress','done','canceled')`

Extend `TRANSLATABLE_FIELDS.initiatives` in `src/lib/okr-schemas.ts` to `["text", "owner", "description"]` — status is an enum (labels come from the i18n dictionary, not translated).

No new tables → no new GRANTs/policies needed; existing initiative RLS applies.

## 2. Server functions (`src/lib/okr.functions.ts`)

- Extend `initiativePatchSchema` with optional `owner` (max 100), `description` (max 2000), `status` (enum).
- `getDashboard`: select the three new columns; add them to `InitiativeDTO`.
- `updateInitiative` already routes through `translateRow` — the new translatable fields are picked up automatically via `TRANSLATABLE_FIELDS`.
- `addInitiative`: unchanged (defaults handle new columns).

## 3. i18n dictionary (`src/lib/i18n-strings.ts`)

Add keys in all 4 languages:
- `nav.okrs`, `nav.initiatives`
- `initiatives.title` ("Initiative Portfolio")
- `initiatives.subtitle`
- `initiatives.filterAll`, `initiatives.filterByOkr`, `initiatives.filterByKr`
- `initiatives.owner`, `initiatives.description`, `initiatives.status`
- `initiatives.status.planned`, `.in_progress`, `.done`, `.canceled`
- `initiatives.empty` (per column)
- `initiatives.addOwner`, `initiatives.addDescription` (placeholders)

## 4. New route `src/routes/initiatives.tsx`

Public route (SSR on), same auth model as `/`. Uses the existing `getDashboard` query (single source of truth — no new server fn needed for reads).

Layout:
- Reuses the hero header pattern from `index.tsx` (logo, title, language switcher, auth badge, link back to `/`).
- Filter bar: two `<Select>`s — OKR set (populated from dashboard data) and Key Result (dependent on selected set). "All" option in each.
- 4-column grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`, `gap-4`). Each column: header with status label + count, then vertical stack of `<InitiativeCard>`s.
- Card: KR badge (e.g. "1.2"), initiative title (existing `EditableText`), owner (`EditableText`, small), description (`EditableText`, multiline), status `<Select>` at the bottom. Card uses `Card` from `@/components/ui/card` with a colored left border per status.
- Editors see edit affordances (via existing `isEditor` from `useAuth`); non-editors see plain text and a disabled Select.
- Uses `pickTranslation(initiative, field, fallback, locale)` for rendering; writes call `updateInitiative` with `sourceLang: locale`.

Add nav header to `src/routes/index.tsx` too: two-tab pill switcher between "OKRs" and "Initiative Portfolio" so users can discover the new page.

## 5. Header nav component

Small shared `<TopNav>` used in both routes (defined inline or under `src/components/okr/TopNav.tsx`) with two `<Link>`s using `activeProps` for the active tab styling. Keeps the language switcher on the right.

## 6. SEO

`head()` on `/initiatives` sets a route-specific title ("Initiative Portfolio — ICF Switzerland") and description. No og:image (matches current `/` behavior).

## Out of scope
- Drag-and-drop reordering between columns (per your choice).
- Backfilling translations for existing rows (they translate on next edit, matching current behavior).
- Bulk edit or CSV export.
- Deep-link filters via URL search params (can add later if wanted).

## Rollout order
1. Migration (adds columns).
2. Schema + server-fn updates (`okr-schemas.ts`, `okr.functions.ts`).
3. i18n string additions.
4. New route + shared TopNav + link from index.
5. Verify build + Playwright screenshot of the board with sample data.
