# Aspira speaks German, French and Italian

Today the voice session always runs in English: the client sends the UI locale, but the session override hard-codes `language: "en"`, the greeting is an English string, and the prompt only mentions the language in passing. This change makes the spoken session follow the language selected in the header (DE · FR · IT · EN).

## What changes for the user

- Choosing DE, FR or IT before starting a call makes Aspira greet and narrate in that language, and understand questions asked in it.
- The greeting sentence is written natively per language, not translated word-for-word.
- The note under the call panel no longer says "English for now" — it explains that Aspira speaks the currently selected language and that switching language requires restarting the call.
- Switching language while a call is running is not applied mid-call; the language picker's effect starts with the next call.

## Technical section

1. `src/lib/voice.server.ts`
   - Add a `FIRST_MESSAGE` record keyed by locale with a natively written greeting for en/de/fr/it (Swiss German orthography, never ß).
   - Return `language` (the validated locale) in `VoiceSession`, falling back to `en` for unknown values.
   - Strengthen the language rule in `voicePrompt`: speak only the target language, including numbers, dates and the objective titles, even if the underlying data is stored in English; keep the fixed terminology (Steward, Customer, Strategic Focus Area) as-is.
   - Keep the single multilingual voice (Sarah) — it renders all four languages; no per-locale voice IDs.

2. `src/routes/voice.tsx`
   - Read `language` from the token response and pass it into `overrides.agent.language` instead of the literal `"en"`.
   - Nothing else in the call flow changes.

3. `src/lib/i18n-strings.ts`
   - Rewrite `voice.langNote` in all four locales to state the session language and the restart-to-switch behaviour.

4. ElevenLabs agent configuration
   - The agent `agent_8601m16f5mgmfmh9jbq3q93m4sqj` must have German, French and Italian listed as additional languages and its TTS model set to a multilingual one; otherwise the `language` override is rejected and the session falls back to English. Verify this against the agent config as the first implementation step and adjust it if needed before touching the UI.

## PR note

**Summary** — Makes the realtime voice session run in the UI-selected language (DE/FR/IT/EN) instead of always English.

**Changes**
- Server: per-locale greeting, `language` in the session payload, stricter language instruction in the voice prompt.
- UI: pass the returned language into the ElevenLabs session override; update the language note copy in all locales.
- Config: enable DE/FR/IT on the ElevenLabs agent.

**Backend / schema changes** — None.

**Testing & verification** — Start a call in each of the four languages and confirm the greeting and narration language; confirm objective highlighting still fires; confirm an unknown locale falls back to English.

**Risks & rollback** — Low blast radius, confined to `/voice`. Revert is a code revert; the agent language setting can stay enabled harmlessly.

**Follow-ups** — Objective titles are spoken from stored data, so Aspira translates them on the fly; if that reads poorly, a later change could feed her the translated titles from the database instead.
