# Guided drafting wizard for the OKR Playground

Turn the `/playground` practice panel into a 3-step guided wizard per mode, ending in deterministic mock "practice drafts". No AI provider, no persistence, no live data or auth changes.

## What changes for the user

Choosing a mode card ("Start exploring") opens an in-page panel that now asks three short questions one at a time instead of showing one flat form.

Each step shows:
- a progress line, "Step 1 of 3", plus a slim three-segment progress bar
- one question as the field label, with a short helper line
- a textarea for the answer (single text input for the short first question)

Actions:
- **Back** — previous step, hidden on step 1
- **Continue** — next step, enabled once the answer has content
- **Start again** — resets answers and returns to step 1
- **Generate practice drafts** — replaces Continue on step 3

Generating shows a believable loading state for about 1.2 seconds (spinner plus "Drafting suggestions…", buttons disabled), then renders 2-3 result cards below the wizard, tailored to the selected mode and composed from the user's own answers:
- Objective mode: two suggested objective statements plus a "what to sharpen" note
- Key Result mode: a metric-style KR, a milestone-style KR, and a measurement note
- Initiative mode: two initiative ideas with a suggested commitment/help-needed hint

Result cards carry a quiet "Practice draft" tag, and "Start again" clears them. The existing trust banner and "Nothing on this page is saved" note stay.

The current free-form fields (objective title/customer/outcome, KR baseline/current/target, initiative list builder) are replaced by the wizard — the page keeps one interaction paradigm rather than two.

## Questions asked

Objective: what strategic change do you want to create · who should benefit · what should be different by the end of the period.

Key Result: what objective does this support · what evidence would show success · how could this be measured or observed.

Initiative: what key result should this help move · what kind of work could contribute · what constraints, skills or capacity matter.

## Technical notes

- `src/routes/playground.tsx`: replace the per-mode form blocks with a `PlaygroundWizard` section. State: `mode`, `step` (0-2), `answers: string[3]` keyed per mode, `status: "idle" | "loading" | "done"`, `results`. All `useState` — no storage, no server functions, no queries.
- New `src/lib/playground-drafts.ts`: pure function `buildDrafts(mode, answers, t)` returning `{ title, body, tag }[]`. Deterministic string composition only, no randomness, so output is stable and SSR-safe.
- Loading state via `setTimeout` in an effect gated on `status === "loading"`, cleared on unmount/reset.
- Accessibility: `role="group"` with `aria-label` on the wizard, progress announced through `aria-live="polite"`, focus moved to the step heading on step change, buttons at 44px minimum, results container `aria-live="polite"`.
- i18n: add roughly 30 keys under `playground.wizard.*` and `playground.result.*` to the `StringKey` union and all four locale blocks in `src/lib/i18n-strings.ts` (EN, DE, FR, IT; Swiss German, no ß). Unused keys from the old form (`playground.field.*`, `playground.addInitiative`, `playground.initiativeListEmpty`, `playground.remove`) are removed in the same pass.
- Styling reuses existing tokens and the shared `Button` component; no new variants.

## PR note

**Summary** — Adds a guided three-question wizard with deterministic mock draft generation to the public `/playground` route, so the interaction design can be validated before any AI provider is wired in.

**Changes**
- UI: `src/routes/playground.tsx` reworked from flat forms to a stepper with Back / Continue / Start again / Generate, progress indicator, loading state and result cards.
- Logic: new pure `src/lib/playground-drafts.ts` mock generator.
- i18n: new `playground.wizard.*` and `playground.result.*` keys in EN/DE/FR/IT; obsolete `playground.field.*` keys removed.

**Backend / schema changes** — None.

**Testing & verification** — Signed-out and signed-in load of `/playground`; all three modes stepped through forwards and backwards; generation loading and results; Start again; all four languages; typecheck; mobile and desktop widths.

**Risks & rollback** — Contained to one public route plus one new file; no data or auth surface touched. Revert the two files and the i18n block to roll back.

**Follow-ups / known debt** — Mock generator is placeholder copy to be swapped for a real AI call later; no draft persistence or export; wizard answers are not validated beyond "not empty".
