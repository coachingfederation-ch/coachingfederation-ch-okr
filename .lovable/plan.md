## Add "New initiative" button on /initiatives

A primary button in the filter bar opens a dialog to create an initiative with title, owner, description, status, and the parent Key Result. Only visible to editors (same rule as inline edits).

### UX

- Button `+ New initiative` sits on the right of the filter bar (replaces the current count area, count moves next to filters). Editors only; hidden for viewers.
- Clicking opens a shadcn `Dialog` titled "New initiative" with:
  - **Key Result** — required `Select`, grouped by OKR (`OKR N. Title` → `KR n.m`). Pre-selects the currently filtered KR if one is active, else the first KR.
  - **Title** — required `Textarea`, maxLength `LIMITS.initiative`.
  - **Owner** — optional `Input`, maxLength `LIMITS.initiativeOwner`.
  - **Description** — optional `Textarea`, maxLength `LIMITS.initiativeDescription`.
  - **Status** — `Select` (Planned / In Progress / Done / Canceled), default `planned`, uses same translated labels + colored dot as the cards.
  - Footer: `Cancel` and `Create` (disabled until title + KR present). Shows validation errors inline.
- On success: toast, close dialog, invalidate `["dashboard"]`. Card appears in the matching column.

### Technical details

- Extend `addInitiative` server fn in `src/lib/okr.functions.ts` to accept optional `owner`, `description`, `status` (reuse `initiativeCreateSchema` fields; add `owner`, `description`, `status` to that schema mirroring `initiativePatchSchema`). Insert them on the row; `translateRow` picks up owner/description automatically because `TRANSLATABLE_FIELDS.initiatives` already includes them.
- No DB migration (columns already exist).
- New component `src/components/okr/NewInitiativeDialog.tsx` — controlled open state, local form state, calls `useServerFn(addInitiative)` with `{ kr_id, text, owner?, description?, status?, sourceLang: locale }`.
- Add i18n keys to `src/lib/i18n-strings.ts` (EN/DE/FR/IT): `initiatives.new`, `initiatives.newTitle`, `initiatives.form.kr`, `initiatives.form.title`, `initiatives.form.owner`, `initiatives.form.description`, `initiatives.form.status`, `initiatives.form.selectKr`, `common.cancel`, `common.create` (reuse existing where present).
- Wire the button into `src/routes/initiatives.tsx` filter bar, gated on `canEdit`.

### Out of scope

- Creating initiatives from the main OKR page (already possible there).
- Bulk create, templates, attachments.
