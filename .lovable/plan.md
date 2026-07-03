## Goal
When a Key Result filter is active on `/initiatives`, surface the KR's title (and its parent OKR context) so the user sees what they're filtering by, instead of just "KR 1.2".

## Change
`src/routes/initiatives.tsx` — inside `InitiativesContent`, below the filter toolbar card (still inside the same `<section>`), render a contextual banner when `krFilter !== "all"`:

- Resolve the selected KR from `data.okr_sets` (find the OKR set containing `krFilter`, then the KR).
- Display: OKR number + OKR title (small, uppercase, muted) on top, then `KR <label> — <kr text>` as a heading line, using `pickTranslation` for the current locale.
- Style: light card matching the filter bar (`rounded-2xl border bg-card px-4 py-3 mt-3`), with a small "Clear" text-button that resets `krFilter` to `"all"`.
- When only `okrFilter` is set (no KR filter), no banner — the OKR select value already shows the OKR title.

No new i18n keys needed beyond reusing existing labels; the KR text itself is localized data.

## Verification
- Build passes.
- Playwright: open `/initiatives`, choose a KR from the filter, screenshot to confirm the KR title appears above the kanban columns; click Clear and confirm it disappears.