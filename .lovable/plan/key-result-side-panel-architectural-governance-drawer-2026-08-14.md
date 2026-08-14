# Key result side panel — architectural governance drawer

Rebuild the visual layer of the key result detail panel (right drawer on the OKR dashboard) so it reads like the OKR set cards: a Deep Blue header band, Bone section blocks with a Blue left rail, and clearly named segments.

Only presentation changes. Every existing field, edit affordance, assistant action, link dialog and delete flow stays exactly as it is.

## What changes

**Header band (Deep Blue)**
- The whole header sits on Deep Blue instead of white, mirroring the OKR card header.
- Yellow KR badge, then the parent objective as a small light-blue eyebrow plus one line of objective text, then the key result title in Quicksand on white.
- The two assistant buttons ("Make this measurable", "Ideate initiatives") move onto the band as light outlined buttons, editors only.

**Definition segment**
- One Bone block with a Blue left rail instead of five separate tiles.
- Two-column grid for Lead, KR number, Type, Instrument; Measure spans full width below a hairline divider.

**Measurement segment**
- One Bone block with a Blue left rail containing four white tiles: Baseline 2026, Current (highlighted with a light-blue border and the "as at" date), Target 2027, Original target (muted).
- Milestone key results keep their status and due-date fields in the same block shape.

**Initiatives segment**
- Related initiatives become Bone rows with a Blue left rail and a status dot, replacing the flat white list.
- Secondary initiatives keep their origin chip and unlink control, rendered in the same row style with a muted rail.
- Empty state becomes a dashed placeholder card.

**Footer**
- Stays pinned; "Delete key result" keeps its confirmation dialog.

## Technical notes

- All work is inside `KrDetailSheet` in `src/routes/index.tsx`; no data, query or mutation changes.
- Colours use existing semantic tokens only (`hero`, `primary`, `accent`, `surface`, `card`, `muted-foreground`, `destructive`). No new hex values, no new CSS variables.
- The prototype's decorative extras that imply data we do not have — pulsing "On track" pill, avatar initials, sparkline paths, strike-through original target — are dropped; status dots reuse the existing initiative status values.
- Section headings ("Definition", "Measurement", …) already exist as translated keys; the initiatives heading reuses `section.relatedInitiatives` and `section.secondaryInitiatives`.
- Contrast: white and Yellow on Deep Blue, Deep Blue on Bone — all above 4.5:1. Focus rings and 44px touch targets preserved.

## PR note

**Summary** — Restyle the key result detail drawer to match the OKR set card language (Deep Blue header, Bone segments with blue rails), improving scanability without touching behaviour.

**Changes**
- UI: `KrDetailSheet` in `src/routes/index.tsx` — header band, Definition block, Measurement block, initiative rows, footer.
- No new components, no new tokens.

**Backend / schema changes** — None.

**Testing & verification** — Open the drawer for a metric key result and a milestone key result, signed out (read-only) and signed in (editor); check inline edit, assistant buttons, link-initiatives dialog, unlink secondary, delete confirmation; check DE/FR/IT label wrapping; check mobile full-width and desktop widths.

**Risks & rollback** — Low; presentation only, contained to one component. Revert the single file to roll back.

**Follow-ups** — The initiative status dot vocabulary could later be shared with the portfolio kanban rather than defined per view.
