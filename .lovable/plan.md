# Richer practice-draft results on /playground

Keep the wizard and deterministic mock data as-is; upgrade what appears after "Generate practice drafts", and add teaching content around it. No AI provider, no persistence, no data/auth changes.

## What the user sees

After generating, 2-3 practice-draft cards for the selected mode. Each card shows:

- A quiet "Practice draft" label
- The suggested Objective / Key Result / Initiative statement, composed from the visitor's own three answers
- A quality badge: Strong, Usable with edits, or Needs refinement (colour-coded with a text label, never colour alone)
- "Why this works" — one short sentence
- "Watch for" — one short caution, shown only where relevant
- Three buttons: Try another version, Edit this draft, Copy draft

Button behaviour:
- **Try another version** cycles that card through 3 local phrasing variants; the badge, rationale and caution follow the variant.
- **Edit this draft** turns the statement into a textarea with Save / Cancel; edits live in component state for the session only.
- **Copy draft** writes the statement to the clipboard and shows a brief "Copied" confirmation on the button for ~2 seconds, with a graceful fallback message if the browser blocks clipboard access.

Below the cards, an educational panel:
- Objective — "An Objective describes meaningful change. It is not a task list."
- Key Result — "A Key Result describes measurable evidence of progress or success. It is not an activity."
- Initiative — "An Initiative is work that may help move a Key Result. It is not the result itself."

Under that, one weak-versus-improved example:
- Weak: "Launch community events"
- Feedback: "This describes work, so it is an Initiative rather than a Key Result."
- Improved: "Increase unique member participation in community events by 25% by year-end."

The trust banner and the "Nothing on this page is saved" note stay visible. The educational panel and example render alongside the results (below on mobile, beside on wide screens).

## Technical notes

- `src/lib/playground-drafts.ts`: extend `DraftCard` with `variants: string[]` (3 deterministic phrasings), `quality: "strong" | "usable" | "refine"`, `why: string`, `watchFor?: string`. `buildDrafts` stays a pure, locale-aware, randomness-free function so SSR and re-renders are stable. Notes-only cards are dropped in favour of the educational panel.
- New `src/components/okr/PracticeDraftCard.tsx`: presentational card owning its own `variantIndex`, `isEditing`, `editedText` and `copied` state. Copy uses `navigator.clipboard.writeText` inside try/catch.
- New `src/components/okr/PlaygroundGuidance.tsx`: educational panel plus the weak/improved example, driven by the active mode.
- `src/routes/playground.tsx`: results block renders the two new components in a responsive grid; wizard, progress, loading state and Start again unchanged. Start again clears card-level edits by remounting on a reset key.
- `src/lib/i18n-strings.ts`: ~30 new keys under `playground.card.*`, `playground.quality.*`, `playground.edu.*` and `playground.example.*`, added to the `StringKey` union and all four locale blocks (EN, DE, FR, IT; Swiss German, no ss-ligature).
- Accessibility: badges carry text, buttons are 44px minimum, copy confirmation announced via `aria-live="polite"`, edit textarea labelled by the card heading, focus returns to the statement after Save.
- Styling reuses existing tokens and the shared `Button` component; no new variants.

## PR note

**Summary** — Upgrades the deterministic `/playground` results from plain text cards to reviewable practice drafts with quality feedback, per-card actions, and teaching content, so the interaction design can be validated before any AI provider is wired in.

**Changes**
- UI: new `PracticeDraftCard` and `PlaygroundGuidance` components; results section of `src/routes/playground.tsx` rewired to use them.
- Logic: `src/lib/playground-drafts.ts` extended with variants, quality rating, rationale and caution.
- i18n: new `playground.card.*`, `playground.quality.*`, `playground.edu.*`, `playground.example.*` keys in EN/DE/FR/IT.

**Backend / schema changes** — None.

**Testing & verification** — All three modes generated; variant cycling, inline edit + cancel, copy confirmation and clipboard-denied fallback; Start again clears edits; all four languages; signed-out load; typecheck; mobile and desktop widths.

**Risks & rollback** — Contained to one public route plus two new components and one lib file; no data, auth or shared-component surface touched. Revert those files and the i18n block.

**Follow-ups / known debt** — Quality badges and rationales are authored heuristics, not real evaluation; drafts cannot be exported or saved; a real AI generator will need to satisfy the same `DraftCard` shape.
