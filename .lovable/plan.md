# OKR Playground — public practice sandbox at /playground

A new public page where anyone, signed in or not, can practise drafting Objectives, Key Results and Initiatives. Nothing is stored: all state lives in the open browser tab and disappears on refresh.

## What gets built

**Navigation**
- "OKR Playground" is added to the existing top navigation next to OKRs, Initiative Portfolio and Report, using the same pill styling and active state.

**Page structure (matching the existing hero + content layout)**
- Deep-blue hero with the usual eyebrow, language switcher (DE · FR · IT · EN), navigation and sign-in badge — identical to the other pages.
- Title: "OKR Playground".
- Intro copy: "Explore how Objectives, Key Results, and Initiatives work. Your practice drafts are not saved and do not affect the live ICFS OKR dashboard."
- A non-destructive trust badge, styled as a calm informational banner (not an error/warning colour): "Practice area · Nothing you do here changes live OKRs".

**Three mode cards** (existing card surface, one concise explanatory sentence each, each with a "Start exploring" button):
1. Create an Objective — what the chapter wants to achieve, stated as an outcome.
2. Create a Key Result — how progress on an objective is measured.
3. Ideate Initiatives — the concrete work undertaken to move a key result.

**"Start exploring" behaviour (stage one)**
Selecting a mode reveals a scratch drafting panel below the cards for that mode, held in React state only:
- Objective: title, customer, outcome statement.
- Key Result: title, baseline / current / target line, matching the live measurement wording.
- Initiative: title, owner, one-line description; several can be added to a session list.
Each panel has a "Clear" action and a repeated reminder that drafts are not saved. No copy-to-dashboard action, no localStorage, no server calls.

## Data safety

- No migrations, no schema or table changes.
- No reads or writes against OKR sets, key results, initiatives or any live table; the page loads no dashboard data.
- No auto-save, no background persistence, no draft persistence of any kind.
- Authentication and existing edit permissions are untouched; the route has no auth gate and no server functions.

## Technical notes

- New file `src/routes/playground.tsx` with `createFileRoute("/playground")` and its own `head()` metadata (unique title, description, og:title, og:description, og:type, twitter:card). No loader.
- `src/components/okr/TopNav.tsx` gains a fourth `Link` with `path.startsWith("/playground")` active detection.
- All copy goes through `src/lib/i18n-strings.ts`: new `playground.*` keys added to the `StringKey` union and to all four locale blocks (EN, DE, FR, IT), Swiss German orthography, sentence case, existing terminology (Steward, Customer, Strategic Focus Area).
- Only existing design tokens and shadcn components; no new visual variants.
- Responsive: cards in a one/two/three-column grid, 44px minimum touch targets, visible keyboard focus.
- Left in Preview; nothing published.

## PR note

**Summary** — Adds a public, session-only OKR Playground at `/playground` so visitors can practise drafting objectives, key results and initiatives without touching live chapter data.

**Changes**
- UI: new `src/routes/playground.tsx` (hero, intro, trust banner, three mode cards, session-only scratch panels); `TopNav` gains a Playground link.
- i18n: new `playground.*` keys in EN, DE, FR, IT.

**Backend / schema changes** — None.

**Testing & verification** — Signed-out and editor sessions on `/playground`; all four locales render; drafts clear on refresh; existing OKRs, Initiative Portfolio and Report pages unchanged; desktop, tablet and mobile widths; keyboard navigation of the mode cards.

**Risks & rollback** — Additive only; no data path touched. Rollback is deleting the route file and reverting the two edits.

**Follow-ups / known debt** — Optional later stages: persist drafts locally, export a draft as text, or seed a draft from an existing objective for comparison. Deliberately out of scope now.
