# New voices for Aspira

Replace the single shared narrator with a per-language voice, and add an optional Swiss German voice on the voice page.

## Voices

| Language | Voice ID |
| --- | --- |
| English | 6rOxfAnZpbM3VIEhFaeV |
| German | t6LrOJGOwJlvBxDA0qqG |
| Swiss German (fun) | ogdlaxy0T9rCSVdH0VJM |
| French | gAx9hUOvSB0WdmtuJSBl |
| Italian | litDcG1avVppv4R90BLu |

## Swiss German toggle

When the interface language is German, the voice page shows a small "Swiss German (fun)" switch next to the call controls. Turning it on only swaps the spoken voice — the session language, prompt and greeting stay standard German. The switch is hidden for EN, FR and IT. Changing it while a call is running takes effect on the next call, matching how the language switch already behaves.

## Technical notes

- `src/lib/voice.server.ts`: replace the single `VOICE_ID` constant with a per-locale map and return the matching id in `VoiceSession.voiceId`. Accept an optional `swissGerman` flag in `createVoiceSession` that selects the Swiss German id when the locale is `de`.
- `src/routes/api/voice-token.ts`: pass the new optional boolean from the request body through to `createVoiceSession`.
- `src/routes/voice.tsx`: local `useState` for the toggle, sent with the token request; render it only when `locale === "de"` using existing shadcn controls and a 44px target.
- New translation keys for the toggle label and its hint in EN/DE/FR/IT (`src/lib/i18n-strings.ts`).
- No schema, data or ElevenLabs agent configuration changes — voice is already supplied per session as a TTS override.

## PR note

**Summary** — Give Aspira a distinct voice per language and an optional Swiss German narrator on the voice page.

**Changes**
- Voice: per-locale voice id map; Swiss German variant for DE.
- UI: Swiss German toggle on `/voice`, visible only in German.
- i18n: two new keys in four languages.

**Backend / Schema** — None.

**Testing** — Call `/api/voice-token` for each locale and confirm the returned `voiceId`; confirm the DE + Swiss German combination returns the fun voice; confirm the toggle is absent for EN/FR/IT.

**Risks & Rollback** — Low; presentation-level only. Reverting the constants restores the previous shared voice.

**Follow-ups** — If Swiss German should ever change the wording as well as the voice, that needs a real locale and is out of scope here.
