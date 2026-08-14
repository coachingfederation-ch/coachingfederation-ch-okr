# A lighter, more inviting "Get involved" page

Restyle the volunteer entry page at `/` in the "Airy flow" direction you picked: a soft blue-wash background, white rounded tiles, light blue leading the colour, deep blue only for text, and yellow used as small sparks. Content, questions, matching logic and the interest form stay exactly as they are.

## What changes visually

**Page background** — the deep blue hero band is replaced by a soft blue wash (`#EEF1FF`) running the full page, so nothing feels heavy or boxed-in.

**Welcome tile** — the hero becomes a large white rounded tile (very generous corner radius) with a faint yellow circle bleeding out of the top-right corner. Eyebrow in light blue, the headline in Quicksand with the second line in light blue, the subline in relaxed deep-blue-at-70%, and the two existing CTAs as fully rounded pills: "Start the three questions" in light blue with a soft coloured shadow, "Browse all work" as a quiet outlined pill.

**Stat tiles** — the three live numbers (objectives, open for volunteers, teams) move into a stacked column beside the welcome tile: one light-blue filled tile, one white tile, one yellow tile. Numbers in Quicksand, labels small and calm. Values stay pulled from the real data.

**Question card** — one wide white tile with a very round radius. The step marker becomes a small yellow dot plus "Question 1 of 3", the heading sits left, and the progress bar moves to the right as a single rounded track that fills in light blue.

**Answer cards** — the four focus-area answers become equal tiles in a four-up row (two-up on tablet, one-up on mobile) on a pale blue surface, each with a white rounded icon chip carrying the SG / OE / CE marker. Hover and selection fill the whole tile light blue with white text; the icon chip lifts slightly. Selection stays clearly marked, not hover-only.

**Later steps and shortlist** — questions 2 and 3 and the shortlist cards inherit the same tile language (white tiles, round radii, light blue selection, yellow sparks) so the page reads as one system rather than a restyled top half.

## Accessibility and continuity

- Every answer tile keeps its SG / OE / CE label and text, so colour is never the only signal; selected state carries `aria-pressed`.
- Contrast checked for deep blue on the pale wash, white on light blue, and deep blue on yellow.
- Touch targets stay at least 44px; hover lift and cross-fades respect reduced motion.
- All strings come from the existing i18n keys — no new copy, no changes to DE/FR/IT.

## Technical notes

- Work is confined to `src/routes/index.tsx` (presentation only) plus a small number of new tokens in `src/styles.css`: a `--wash` surface for `#EEF1FF`, and tile radius/shadow tokens. No hardcoded hex in components — the prototype's exact values are copied into tokens and used via classes.
- Existing brand tokens are reused: `--highlight` (#5778FA), `--foreground`/`--hero` (#212251), `--accent` (#EFCB30), `--card` white.
- No changes to routing, `dashboardQueryOptions`, matching logic, `interests.functions.ts`, the interest dialog behaviour, `TopNav`, or any other route. `/okrs`, `/initiatives`, `/report`, `/playground` are untouched.
- Head metadata for `/` stays as-is.

## PR note

**Summary** — Restyles the `/` volunteer entry page to a lighter, more playful ICF variant (soft blue wash, white bento tiles, light blue lead, yellow sparks) without changing content, data or behaviour.

**Changes**
- UI: `src/routes/index.tsx` — hero tile, stat tiles, question card, answer tiles, later steps and shortlist restyled.
- Styles: `src/styles.css` — wash surface plus tile radius/shadow tokens.

**Backend / schema changes** — None.

**Testing & verification** — Full three-question flow clicked through signed-out on desktop, tablet and mobile widths; interest submission still works; DE/FR/IT/EN rendered; keyboard-only path through the answer tiles; reduced-motion pass; contrast checked on the new surfaces; console clean.

**Risks & rollback** — Scoped to one route and additive tokens; revert by restoring the two files.

**Follow-ups / known debt** — Other routes keep the Bone background, so `/` will read as intentionally lighter than the rest of the app; harmonising them is a separate decision.
