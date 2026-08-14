# Calmer key result side panel

Redesign the key result detail panel that opens from an OKR card so it reads as a few quiet, clearly separated sections instead of one long list of labels. Presentation only — same fields, same order of meaning, same inline editing, no data, route or i18n-key changes. Palette (Deep Blue, Blue, Light Blue, Yellow, Bone, White) and the Quicksand / Plus Jakarta Sans pairing stay as they are.

## Direction: quiet section rhythm

The panel becomes a fixed header, a scrolling body of three named sections, and a fixed footer for the destructive action.

**Header (sticky)**
- KR chip plus a muted parent-objective line above the key result text.
- Key result text in Quicksand at panel-title size; still inline-editable.
- Short description line and, for editors, the two assistant buttons stay below it.
- A hairline border separates it from the scrolling body.

**Section 1 — Definition**
- Small blue uppercase section heading.
- Lead, KR number, Type, Measure, Instrument as soft Bone-tinted field tiles in a two-column grid (Measure spans both columns since it is the longest). Each tile keeps its label plus its editable value.

**Section 2 — Measurement**
- One white card with a light border holding the whole measurement story: Baseline 2026 / Current / Target 2027 across one row, with Current emphasised as a Light-Blue pill, the thin progress bar underneath, and the "as at" date and baseline-lock control kept in place.
- The original 2026 target note moves inside this card as a quiet footnote row separated by a hairline, rather than a separate boxed panel.
- Milestone key results show status and due date in the same card shell instead of the triplet.

**Section 3 — Related initiatives**
- Section heading with the count and the "Link initiatives" action on the same line.
- Initiatives as flat white rows with a small status dot, a chevron affordance, and hover in Light Blue — replacing the current striped table look. The "new initiatives are created in the Portfolio" note stays as small muted text under the list.

**Footer**
- "Delete key result" pinned at the bottom on a faint Bone strip, so it no longer sits inline after the content.

Calm comes from fewer surface types (Bone tiles for definition, one white card for measurement, plain rows for initiatives), consistent 11px blue section headings, and more vertical breathing room between the three groups.

## Technical notes

- All changes in `KrDetailSheet` inside `src/routes/index.tsx`, plus a small layout adjustment in `src/components/okr/KrMeasurement.tsx` if the full variant needs the new card shell.
- Sheet body becomes a flex column: header, `flex-1 overflow-y-auto` content, footer.
- Only existing semantic tokens (`bg-surface`, `bg-card`, `text-primary`, `border-border`, `highlight`, `warning`) — no new colours, no hardcoded hex.
- No changes to mutations, `EditableText`, `PlainSelect`, `PlainDate`, `LinkInitiativesDialog`, or translation keys.

## PR note

- **Summary** — Visual restructure of the key result detail side panel for calmer, clearer grouping; presentation only.
- **Changes** — UI only: `src/routes/index.tsx` (`KrDetailSheet` header/sections/footer), possibly `src/components/okr/KrMeasurement.tsx` (full variant shell).
- **Backend / schema changes** — None.
- **Testing & verification** — Open the panel signed out and as an editor; confirm every field still shows and saves inline, metric and milestone key results both render, baseline lock and "as at" date work, linking initiatives still opens, delete still works, and DE/FR/IT labels do not clip at tablet and mobile widths.
- **Risks & rollback** — Low; revert the two files.
- **Follow-ups** — The initiative detail one-pager keeps its current styling; align later if wanted.
