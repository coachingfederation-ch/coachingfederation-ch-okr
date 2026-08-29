# Aspira Voice: a spoken walkthrough of the strategy

A new page where Aspira speaks the chapter's strategy out loud and answers questions in real time, hands-free. English first, then German, French and Italian.

## What it feels like

- A new page at `/voice`, reachable from the "More" menu and from a "Talk to me" button in the Aspira chat panel.
- A calm full-screen view in the dashboard's visual language: the Aspira mark at the centre, a soft animated ring that reacts to who is speaking, and one large "Start talking" button.
- On start, the browser asks for microphone permission (with a short explanation shown before the prompt), then Aspira greets you and offers to walk through the objectives one by one.
- She narrates objective by objective from the live data — number, title, steward, customer, strategic focus areas, key results — pausing between them.
- You can interrupt her mid-sentence with a question; she stops, answers, and offers to continue where she left off.
- On-screen support while she talks: a live transcript of both sides, and the objective currently being discussed highlighted as a card so you can read along.
- Controls: pause/resume, mute microphone, skip to next objective, end conversation. Everything is keyboard reachable with 44px targets.
- A visible note that the conversation is read-only — Aspira never changes any data — and that audio is processed by the voice provider.

## Language

- MVP ships English only, with the language selector on the page disabled and labelled "coming soon" for DE/FR/IT.
- Phase 2 turns on German, French and Italian: the page passes the site's current locale to the voice agent, and the spoken language follows the app's language switcher. Objective/key-result text is already translated in the database and gets read in the active language.

## Technical notes

Voice engine: ElevenLabs Conversational AI (realtime WebRTC), chosen for low latency, natural barge-in, and multilingual voices.

Setup you need to do once (I'll guide you):
- Connect ElevenLabs to this project through the connector card I'll open. This syncs the API key server-side; the browser never sees it.
- Create a Conversational AI agent in the ElevenLabs dashboard and give me its agent ID. In that agent's settings, enable **conversation overrides** (prompt, first message, language) and the **client tools** listed below — the agent won't accept them otherwise.

Code:
- `src/lib/voice.functions.ts` — a server function that (a) fetches an ElevenLabs conversation token using the connector-synced `ELEVENLABS_API_KEY`, and (b) builds the session prompt: the existing `CHAPTER_KNOWLEDGE` and Aspira's personality from `src/routes/api/chat.ts`, plus a compact live snapshot of all objectives and key results read with the existing read-only query used by `assistantTools`. Prompt text is factored out of `api/chat.ts` into a shared module so text and voice stay in character together.
- `src/routes/voice.tsx` — the page. Uses `@elevenlabs/react`'s `useConversation` with `connectionType: "webrtc"`, renders the orb/transcript/controls, and drives the walkthrough state.
- Client tools registered on the hook so the UI follows the conversation: `highlight_objective(number)` scrolls/marks the objective card, and `next_objective()` advances the walkthrough.
- New dependency: `@elevenlabs/react`.
- No database changes, no schema changes, no persistence — the transcript lives in page state and disappears on reload.
- Everything read-only: the voice agent gets facts and speaks; it cannot write.

Constraints and costs:
- Realtime voice minutes are billed by ElevenLabs on your account, separate from Lovable credits.
- Voice mode needs a modern browser with microphone access; the page falls back to a clear message (with a link to the text chat) where WebRTC or the mic is unavailable.
- The page is public like the rest of the dashboard, so I'll keep the same rate-limit shape as `/api/chat` on the token endpoint to prevent abuse of your ElevenLabs quota.

## PR note

**Summary** — Adds a hands-free `/voice` page where Aspira narrates the chapter's OKRs and answers questions in real time via ElevenLabs Conversational AI, English only in this first pass.

**Changes**
- UI: new `/voice` route (orb, transcript, walkthrough controls, objective highlight card); "More" menu entry; entry button in the Aspira chat panel; new `agent.voice.*` translation keys (EN complete, DE/FR/IT stubs until phase 2).
- Backend: `src/lib/voice.functions.ts` for the conversation token and live prompt assembly; shared Aspira prompt module extracted from `src/routes/api/chat.ts`.
- Config: ElevenLabs connector linked; `@elevenlabs/react` added.

**Backend / schema changes** — None. No migrations, no RLS changes, read-only queries only.

**Testing & verification** — Typecheck; token endpoint returns a valid session; a live spoken session covering start, narration of at least two objectives, an interruption question, and end; signed-out and signed-in visitors; denied-microphone and unsupported-browser paths; reduced-motion; keyboard-only operation; mobile width.

**Risks & rollback** — Isolated to the new route plus the prompt extraction; the text assistant keeps working if voice fails. Rollback is deleting the route and reverting the extraction. Main external risk is ElevenLabs agent misconfiguration (overrides/tools not enabled), which surfaces as a clear on-screen error.

**Follow-ups** — DE/FR/IT enablement, optional saved transcripts, and server-derived auth for the wider rate limit (the text chat has the same gap today).
