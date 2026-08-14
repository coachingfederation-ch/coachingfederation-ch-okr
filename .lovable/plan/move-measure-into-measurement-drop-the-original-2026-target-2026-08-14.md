# Move "Measure" into Measurement, drop the original 2026 target

Two presentation changes in the key result side panel.

## What changes

**Measure moves**
- The "Measure" description (e.g. "Pilot delivered in 2026, two sessions per year in 2027") leaves the Definition block and becomes the first item inside the Measurement block, above the value tiles, separated by a hairline divider.
- Definition keeps Lead, KR number, Type and Instrument in its two-column grid.
- Editing behaviour, character limit and translation handling stay exactly as they are.

**Original 2026 target removed**
- The "Original 2026 target (from source document)" tile disappears from both the metric layout and the milestone layout.
- The unused label is removed from all four languages (EN, DE, FR, IT).
- The underlying legacy `target` column and its schema entry are left untouched, so nothing is lost in the database — only the panel stops displaying it.

## Technical notes

- All edits are in the `KrDetailSheet` section of `src/routes/okrs.tsx` (Definition block around the measure field; both measurement grids), plus removal of the `kr.originalTarget` key and its type union entry in `src/lib/i18n-strings.ts`.
- The now-unused `krTarget` local is removed from the sheet.
- No data, query, mutation or migration changes.

## PR note

**Summary** — Relocate the key result "Measure" text into the Measurement segment and remove the legacy original-2026-target field from the panel.

**Changes**
- UI: `src/routes/okrs.tsx` — Measure moved from Definition to Measurement; original-target tiles removed from metric and milestone layouts.
- i18n: `src/lib/i18n-strings.ts` — `kr.originalTarget` removed from the key union and all four locales.

**Backend / schema changes** — None. The legacy `target` column stays in place, unused by the UI.

**Testing & verification** — Open the panel for a metric KR and a milestone KR, signed out and signed in; confirm Measure is editable in its new position, no original-target tile remains, and DE/FR/IT labels still fit.

**Risks & rollback** — Low; presentation only. Revert the two files.

**Follow-ups** — The legacy `target` column can be dropped in a later cleanup migration once confirmed unused elsewhere.
