# Get Involved — a volunteer entry page

A warm, conversational landing page that welcomes someone who has no idea what the chapter is working on, asks three short questions, and hands them a personal shortlist of initiatives they can put their hand up for.

## What changes for visitors

- `/` becomes the volunteer entry page ("Get involved").
- The current OKR dashboard moves to `/okrs`, unchanged in content and behaviour. The top nav gains "Get involved" as the first item; "OKRs" points to `/okrs`. Anyone landing on the old `/` link sees the new page; nothing is deleted.

## The page

**1. Welcome band (Deep Blue hero)**
A large, friendly sentence — "Hi. Here's what The Switzerland Chapter of ICF is working on, and where you could fit in." — plus one line of orientation and a single primary action: "Show me where I fit". Below it, three living numbers pulled from the real data: objectives, key results, initiatives open for help.

**2. Meet the pillars**
The three Strategic Focus Areas and the objectives beneath them, presented as generous, colour-coded cards, each with a plain-language "what this is about" line and a count of initiatives currently looking for people. Clicking a card jumps straight into the conversation pre-answered with that pillar.

**3. The three questions (the conversational core)**
One question on screen at a time, big type, large tappable answer chips, an animated progress ribbon, and a friendly running recap of the answers so far ("So — Coaching Excellence, a few hours a month, facilitation.").

- **Where do you see yourself?** — pick one or more pillars/objectives, or "Not sure yet, surprise me".
- **How much time do you have?** — one-off, recurring, or a workstream (maps to the existing commitment field).
- **What do you bring?** — leading something, lending a hand, or a specific skill (maps to the existing help-needed field), with an optional free-text skill note.

Back, restart, and skip are always available. Answers live in component state plus sessionStorage only.

**4. Your shortlist**
Initiatives ranked by fit, each card showing the objective and key result it serves, the owner, what help is needed, time commitment, and a one-line "why this matches you". Cards link to the full initiative detail page. If nothing matches strongly, the page relaxes the filters and says so honestly rather than showing an empty state.

**5. Express interest**
On any shortlist card, "I'm interested" opens a short form: name, email, an optional message, and the initiative it refers to. Submitting stores the interest so a steward can follow up, and the volunteer sees a clear confirmation of what happens next. Interests are visible to signed-in chapter editors from the initiative detail page — a small "Interested volunteers" section listing name, email, message, and date.

## Visual direction

Warm and playful within the ICF system, not a new brand: Deep Blue welcome band, Bone conversation surface, Blue for selection, Yellow reserved for the step counter and the "open for help" marker. Quicksand for the questions, Plus Jakarta Sans for everything else. Answer chips lift and fill on selection; steps cross-fade; all motion respects reduced-motion. Touch targets at least 44px, sentence-case headings, full keyboard path through the questions, and a live region announcing each new step.

Everything is translated across DE, FR, IT, EN.

## Technical notes

- New route `src/routes/index.tsx` (volunteer page); the existing dashboard body moves verbatim to `src/routes/okrs.tsx` with its route string updated. `TopNav` gains the new entry and points OKRs at `/okrs`.
- New components under `src/components/okr/getinvolved/`: `WelcomeHero`, `PillarInvitation`, `MatchConversation` (the three steps), `ShortlistCard`, `InterestDialog`. Matching logic lives in a pure `match-initiatives.ts` so it is testable and reusable.
- Reads reuse `dashboardQueryOptions`; matching runs client-side on the already-loaded data — no new read endpoints.
- New table `public.initiative_interests` (initiative_id, name, email, message, created_at) with GRANTs, RLS: `anon`/`authenticated` may INSERT; SELECT restricted to authenticated chapter editors; no public reads. Submission goes through a validated `createServerFn` (Zod, length caps, basic rate guard), never a direct client insert.
- Head metadata: distinct title/description/og tags for `/` and `/okrs`.
- Existing OKR data, editing workflows, auth, and the initiative portfolio are untouched.

## PR note

**Summary** — Adds a public, conversational volunteer entry page at `/`, moves the OKR dashboard to `/okrs`, and lets visitors express interest in a specific initiative.

**Changes**
- UI: new Get Involved page (hero, pillar cards, three-question flow, shortlist, interest dialog); TopNav updated; dashboard relocated to `/okrs`.
- i18n: new keys for the page in EN/DE/FR/IT.
- Backend: `initiative_interests` table plus a validated server function for submissions; editor-facing interest list on the initiative detail page.

**Backend / schema changes** — One migration: create `initiative_interests`, GRANTs, enable RLS, insert-for-all / read-for-editors policies.

**Testing & verification** — Signed-out visitor completes the flow on desktop and mobile, submits interest, sees confirmation; signed-in editor sees the interest on the initiative detail page; existing dashboard verified at `/okrs` in all four languages; keyboard-only and reduced-motion passes.

**Risks & rollback** — Main risk is the `/` to `/okrs` move breaking bookmarks; mitigated by nav updates. Revert is a code revert; the table can stay harmlessly.

**Follow-ups / known debt** — No email notification to stewards yet (interests are read in-app), no spam protection beyond validation and rate guard, and matching is a simple weighted heuristic rather than a tuned ranking.
