# OKR Agent — a chat companion for goal setting

A floating assistant, mirroring the one on the ICF Switzerland Welcome site, available on every page for everyone. It explains how objectives, key results and initiatives work, answers questions about the chapter's current OKRs, and helps draft new goals or initiatives. It never writes to the database.

## What it does

**Explains** — how the OKR model works here: objective vs. key result vs. initiative, stewards, customers, strategic focus areas, baseline / current / target measurement, and the ASPIRE work journey. It reuses the teaching language already written for the playground.

**Answers from live data** — it can look up the real dashboard: the five objectives with steward, customer and focus areas; key results with their measurement state; initiatives with owner, status and availability. It links straight to the relevant page, e.g. an initiative detail view.

**Helps draft** — asks a couple of sharpening questions, then proposes objectives, key results (with an honest note when a baseline is still unknown) or initiatives, with quality feedback in the same voice as the playground. Drafts stay in the chat: nothing is saved, nothing is inserted. For editors it points to the right place to enter the draft ("Create with Assistant" on an OKR set, the work journey for an initiative).

## Behaviour and safety

- Available to everyone, signed in or not, on the volunteer landing page, dashboard, portfolio, report and playground.
- Read-only: no inserts, updates or deletes; it only reads data that is already visible on the public dashboard.
- Never invents stewards, numbers, dates or initiatives — if a lookup returns nothing, it says so.
- Answers in the interface language (DE · FR · IT · EN), and follows chapter terminology ("The Switzerland Chapter of ICF", Steward, Customer, Strategic Focus Area).
- One rolling conversation kept in the browser only, with a "Start over" action; nothing is stored server-side. (Same as the Welcome assistant — say the word if you'd prefer saved conversation history instead.)
- Rate limited per visitor so the public endpoint can't be abused; a wider allowance for signed-in users.

## Design

Friendly and playful, in the spirit of the x.ai bot: a round blue launcher in the bottom corner with a small character-like mark that blinks or gently bobs, a soft yellow halo that pulses slowly when idle and settles on hover, and a springy pop as the panel opens. The panel itself stays warm and readable — Bone/white surfaces, Quicksand heading, Plus Jakarta Sans body, a yellow accent on the header, existing tokens only — with a lively three-dot thinking indicator and messages that fade and rise in as they arrive. Two or three suggested starter questions appear as light-blue chips on first open ("How does a key result differ from an initiative?", "What is objective 2 about?", "Help me draft an initiative"). Motion stays subtle and short, never distracting: full keyboard access, 44px targets, reduced-motion respected (all looping and entrance animation disabled), mobile takes the full width.

## Technical notes

- Dependencies: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `streamdown` (none are present yet).
- New streaming server route `src/routes/api/chat.ts` (`createFileRoute` with a POST handler) holding the model, the system prompt and all tools. `LOVABLE_API_KEY` is read inside the handler only.
- Model: `google/gemini-3.6-flash` via the Lovable AI Gateway provider in a new `src/lib/ai-gateway.server.ts`, `stopWhen: stepCountIs(8)`.
- Tools in `src/lib/assistant/tools.server.ts`, all read-only, using the existing publishable-key Supabase server client: `list_objectives`, `get_objective` (with its key results), `search_initiatives`, `draft_okr` (delegating to the existing `generateDrafts` in `src/lib/ai-drafts.server.ts` so playground, assistant drawer and chat share one drafting brain).
- Static teaching content in `src/lib/assistant/knowledge.ts`, derived from the existing playground copy.
- Minimal AI Elements set copied in (`conversation`, `message`, `prompt-input`) plus `src/components/okr/OkrAgentWidget.tsx`, mounted once in `src/routes/__root.tsx`.
- Rate limiting reuses the in-memory sliding window already in `src/lib/ai-drafts.server.ts`, extracted to a shared helper.
- New `agent.*` keys in `src/lib/i18n-strings.ts` for all four locales (Swiss German, no ß).
- No migrations, no schema changes, no new tables.

## PR note

**Summary** — Adds a public, read-only AI agent that explains the chapter's goal-setting model, answers questions from the live OKR data, and drafts objectives, key results and initiatives without persisting anything.

**Changes**
- UI: `OkrAgentWidget` mounted in the root layout; minimal AI Elements chat primitives.
- Server: streaming `/api/chat` route, gateway provider helper, read-only assistant tools, chapter knowledge, shared rate limiter.
- i18n: new `agent.*` keys in EN, DE, FR, IT.

**Backend / schema changes** — None. Reads existing tables through the public client; no writes anywhere.

**Testing & verification** — Signed-out, editor and admin sessions; all four locales; an explanation question, a live-data question about a real objective and initiative, and a drafting flow for each of the three modes; a lookup that returns nothing; rate-limit rejection path; desktop, tablet and mobile; keyboard-only operation.

**Risks & rollback** — Additive; the only shared file touched is `__root.tsx`. Cost risk is gateway spend, bounded by the rate limiter and the step cap. Rollback is removing the widget mount and the new files.

**Follow-ups / known debt** — In-memory rate limiting is per server instance. Optional later: insert a draft directly into an OKR set for editors, and conversation feedback/insights like the Welcome app has.
