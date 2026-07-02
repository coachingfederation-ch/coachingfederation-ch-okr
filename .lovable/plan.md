## 1. Google-only sign-in

Rewrite `src/routes/auth.tsx` so the sign-in card contains only the "Continue with Google" button (plus the "Back to dashboard" link and a short explainer). Remove:

- Email / password inputs and the `onEmailSubmit` handler
- The sign-in / sign-up mode toggle and "Create one / Already have an account" links
- The "or with email" divider

Also disable email as a provider via the social-auth tool so the backend matches (`providers: ["google"]`, `disable_providers: ["email"]`). Existing email accounts remain in the database but can no longer sign in through the UI.

Copy on the page becomes: heading "Sign in to edit", subtext "Anyone can view the dashboard. Sign in with Google to enable inline editing."

## 2. Pillar tags: add/remove instead of always-on toggle row

Today every OKR card renders all three pillar chips (SG / OE / CE) and greys out the inactive ones. Change this so a card shows only the pillars that are actually attached, with an editor affordance to add missing ones and remove attached ones.

Update the tag row in `OkrCard` (currently lines 406-421 of `src/routes/index.tsx`):

- Render one chip per pillar in `set.pillars` only.
- Each chip keeps the current styling and, when `canEdit`, shows a small `×` on hover/focus that removes that pillar from `set.pillars` (via the existing `updateSet({ pillars: next })` mutation).
- When `canEdit` and at least one pillar is not yet attached, render a `+ Add tag` button after the chips. Clicking it opens a small popover / dropdown (shadcn `DropdownMenu`, already available) listing the remaining pillars by full name:
  - SG — Sustainable Growth & Impact
  - OE — Org. Development & Excellence
  - CE — Coaching Excellence & Value
- Selecting an item appends that pillar to `set.pillars` and closes the menu. When all three are attached, the button is not rendered.
- Read-only viewers see only the attached chips, no add button, no remove `×`.

The pillar codes and full names live together in a small constant at the top of the file so the dropdown labels stay in sync with the pillar summaries section further down the page. No schema, RLS, or server-function changes — the existing `updateSet` mutation already accepts a new `pillars` array.

## Files touched

- `src/routes/auth.tsx` — strip to Google-only.
- `src/routes/index.tsx` — new `PillarTagList` (replaces the always-on chip row) and a `PILLAR_NAMES` constant; `PillarChip` gains an optional `onRemove` for the editor `×`.
- Social auth configuration — Google enabled, email disabled.

## Out of scope

- Renaming or restyling the pillar summaries section at the bottom of the dashboard.
- Any migration on existing `okr_sets.pillars` values.
- A separate management UI for the full pillar names — they stay hardcoded alongside the pillar codes.
