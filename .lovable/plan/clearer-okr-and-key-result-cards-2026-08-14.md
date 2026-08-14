# Clearer OKR and Key Result cards

Goal: make the OKR card easier to scan, cut the amount of detail shown on a Key Result card, and make the Objective → Key Result hierarchy visually obvious. Presentation only — no data, route, or workflow changes. Palette (Deep Blue, Blue, Light Blue, Yellow, Bone, White) and the Quicksand / Plus Jakarta Sans pairing stay exactly as they are.

## Objective card (parent)

- Give the card a Deep Blue header band: large objective number, objective title in Quicksand, steward / customer and focus-area chips on one restrained metadata line underneath.
- Promote the objective statement to the strongest text on the card, directly under the band, on white — remove the extra grey box around it so it reads as the card's headline rather than one more panel.
- Demote "Global alignment" to a collapsible / muted supporting block so it no longer competes with the objective and key results.
- Keep the delete control, "Create with Assistant", "Add key result" and all edit affordances where they are.

## Key result cards (children)

Visually nest them: the key results grid sits in a Bone-tinted, inset area with a Blue left rail, so every KR reads as belonging to the objective above it.

Each KR card shows only:
1. KR code chip (e.g. KR 1.1) — Blue, smaller than the objective's number.
2. The key result text (up to 2 lines).
3. One progress signal: the thin progress bar with a percentage for metric KRs, or the status pill plus due date for milestone KRs.
4. Initiative count.

Moved off the card into the existing KR detail sheet (nothing is lost, only relocated): the measure sentence, the instrument line, the Baseline 2026 / Current / Target 2027 triplet, the "as at / stale" note, the "not yet measurable" note, and the Lead row. Warnings such as a missing baseline or a stale value become a single small amber dot on the card, explained in the sheet.

Hover/focus keeps opening the detail sheet exactly as today.

## Technical notes

- `src/routes/index.tsx`: restructure `OkrCard` header, objective and alignment sections, and the key results wrapper; slim down `KrCard`.
- `src/components/okr/KrMeasurement.tsx`: add a `variant="compact"` (bar + percent, or status + due date, plus a warning dot) used by `KrCard`; the detail sheet keeps the full variant.
- Only existing semantic tokens are used; no new colours or fonts, no changes to `KrDetailSheet` data handling, mutations, or i18n keys beyond reusing existing ones.

## PR note

- **Summary** — Visual refactor of the OKR and Key Result cards on `/` for clearer hierarchy and lower information density on KR cards.
- **Changes** — UI only: `src/routes/index.tsx` (OkrCard header band, objective emphasis, alignment demoted, nested KR area, slimmer KrCard), `src/components/okr/KrMeasurement.tsx` (compact variant).
- **Backend / schema changes** — None.
- **Testing & verification** — Check `/` as signed-out visitor and as editor; confirm KR detail sheet still shows all relocated fields, inline editing still saves, milestone and metric KRs both render, and DE/FR/IT labels do not clip at tablet and mobile widths.
- **Risks & rollback** — Low; presentation-only, revert the two files.
- **Follow-ups** — Report and portfolio views keep their current card styling; align them later if wanted.
