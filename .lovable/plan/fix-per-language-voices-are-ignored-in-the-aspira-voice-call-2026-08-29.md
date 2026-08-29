# Fix: per-language voices are ignored in the Aspira voice call

## What is actually happening

Verified against the live ElevenLabs agent configuration:

- The client-side `tts.voiceId` override **is** allowed (`overrides.conversation_config_override.tts.voice_id: true`), so the app is sending it correctly.
- But the agent has **language presets** for `de`, `fr`, `it`. Each preset carries its own TTS block (`model_id: eleven_flash_v2_5`, `voice_id: null`). When a session runs in one of those languages, the preset's TTS config wins over the per-session override, and `voice_id: null` falls back to the agent's default voice `EXAVITQu4vr4xnSDxMaL` (Sarah).

That matches the symptom exactly: correct language, wrong voice. English is also affected — the agent default is Sarah, and the override may be applied inconsistently for the same reason.

A second, separate discrepancy: the Italian voice in code is `uC9VI5XrTxXRNlCzGSKR`, not the `litDcG1avVppv4R90BLu` that was requested.

## The right way to select a voice

Two supported mechanisms, and they must not fight each other:

1. **Language presets** — pin `voice_id` per language on the agent itself. Deterministic, no client involvement.
2. **Session override** — send `overrides.tts.voiceId` at `startSession`, allowed only when the agent's override allowlist enables it, and only effective when no language preset overrides that field.

## Chosen fix

Pin the voices in the agent's language presets (mechanism 1), and keep the session override only for the Swiss German variant.

- Set each language preset's `tts.voice_id`: `de → t6LrOJGOwJlvBxDA0qqG`, `fr → gAx9hUOvSB0WdmtuJSBl`, `it → litDcG1avVppv4R90BLu` (after verifying the ID resolves; otherwise report it back rather than silently substituting).
- Set the agent default (English) `tts.voice_id` to `6rOxfAnZpbM3VIEhFaeV` and its `model_id` to `eleven_flash_v2_5` so English matches the multilingual model used by the presets.
- Swiss German: since the `de` preset would now pin the standard German voice, add a **dedicated Swiss German preset is not possible** (it is not a separate language). Instead, when the Swiss German toggle is on, the session runs with the `de` preset's `voice_id` cleared for that session — implemented by keeping the client `tts.voiceId` override in place and removing `voice_id` from the `de` preset, pinning German through the client override instead. Concretely: `de` stays override-driven (standard or Swiss voice chosen server-side), `fr`/`it`/English are pinned on the agent.

## Verification

- Re-read the agent config after the update and confirm each preset carries the expected `voice_id`.
- Start a real session per locale on `/voice` and confirm the audio voice differs between EN, DE, FR, IT, and DE + Swiss German.
- `/api/voice-token` keeps returning the same `voiceId` values it does today, so nothing downstream changes.

## Technical notes

- Agent update: `PATCH https://api.elevenlabs.io/v1/convai/agents/{agent_id}` with `conversation_config.tts` and `conversation_config.language_presets`, using the connector-synced `ELEVENLABS_API_KEY`.
- App code changes are minimal: `src/lib/voice.server.ts` keeps the voice map (Italian ID corrected) and continues returning `voiceId`; `src/routes/voice.tsx` is unchanged.

## PR note

**Summary** — Per-language Aspira voices were ignored because the ElevenLabs agent's language presets overrode the per-session voice, falling back to the default Sarah voice. Voices are now pinned on the agent, with the German slot left override-driven for the Swiss German variant.

**Changes** — ElevenLabs agent config (language presets, default TTS voice and model); `src/lib/voice.server.ts` Italian voice ID correction.

**Backend / schema changes** — None.

**Testing & verification** — Agent config re-read after update; live session per locale plus the Swiss German toggle.

**Risks & rollback** — Blast radius limited to the `/voice` route. Rollback = restore the previous agent TTS/preset values (default voice `EXAVITQu4vr4xnSDxMaL`, preset `voice_id: null`).

**Follow-ups** — If `litDcG1avVppv4R90BLu` does not resolve, the Italian voice stays as-is and is reported back rather than guessed.
