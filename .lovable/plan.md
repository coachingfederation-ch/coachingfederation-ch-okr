# iOS crackle: it is the loudspeaker route — settle, clean up, and guide users to headphones

## What the three runs establish

Across all runs the transport was flawless: 0% packet loss, jitter 0–1 ms, zero concealment events during playback, healthy jitter buffer. Nothing is being lost or re-buffered, so this was never a network or buffer problem.

What changed the sound was the output route:

- `play-and-record` + microphone processing on (`mixed` or device default): iOS switches the call onto the **loudspeaker** through its voice-processing chain, and that is where you hear the crackle.
- Microphone processing fully off: audio came out of the **earpiece (call speaker)** instead and was clean — no crackle.

So the artefact is produced by iOS's own voice-processing/loudspeaker route with a live microphone, after decoding. It is not something the app can decode, buffer or re-time its way out of: the only combinations that avoid it either give up the microphone route (earpiece-only, unusable for a hands-free call) or give up echo cancellation (Aspira starts hearing herself through the loudspeaker).

`playback` and "leave auto" are not usable at all, as you found — they block microphone access.

## The decision

Keep the current shipped combination, which is the one that supports a normal hands-free conversation with barge-in:

- audio session `play-and-record`
- echo cancellation on, noise suppression and auto gain off
- stereo left alone (mono made no measurable difference)

And, on iOS only, surface a short, friendly hint before the call starts recommending headphones or earbuds — which removes the loudspeaker route entirely and with it the crackle.

## The change

1. **Lock the settings in.** The experiment flags disappear; `prepareIosAudioSession()` always requests `play-and-record`, and iOS capture always uses the echo-cancellation-on configuration. A short comment records why, so this is not re-litigated later.
2. **Remove the diagnostics scaffolding.** The Debug switch, the debug panel and the stats/experiment store were built to answer this question and it is answered. Deleting them removes a chunk of code from the voice page and stops any polling work.
3. **Drop the 200 ms iOS playout delay.** Concealment was zero in every run, so the cushion buys nothing and only adds latency to a live conversation.
4. **Add the headphone hint on iOS.** A small, calm note in the call panel above the Start button, shown only on iPhone/iPad, in the brand's existing surface style, translated into DE/FR/IT/EN. No dialog, nothing to dismiss, no change for desktop users.

## Verification

- Desktop Chrome: a call behaves exactly as today; no hint, no debug UI.
- iPhone Safari and Chrome: hint appears, a call over the loudspeaker is unchanged from today's tuned behaviour, and a call with earbuds is clean.
- Typecheck, Prettier, lint.

## Technical notes

- `src/lib/voice-audio.ts`: remove the experiment reads, hard-code `audioSession = "play-and-record"` and the `echoCancellation: true / noiseSuppression: false / autoGainControl: false / channelCount: 1` capture constraints, delete `applyMonoRemote`, `IOS_PLAYOUT_DELAY_SECONDS` and the `setPlayoutDelay` call, and drop the diagnostics hooks. Keep `playsInline`, the unmuted element, and the interruption auto-resume.
- Delete `src/lib/voice-diagnostics.ts` and `src/components/okr/VoiceDebugPanel.tsx`.
- `src/routes/voice.tsx`: remove the `debug` state, the Debug switch, the diagnostics effects/logging and the panel render; add the iOS-only hint driven by `isIosLike()` in an effect (so SSR and hydration agree).
- New keys `voice.headphonesHint` in `src/lib/i18n-strings.ts` for EN/DE/FR/IT (Swiss German orthography, no ß).
- No backend, schema, transport, agent-configuration or routing changes.

## PR note

**Summary** — Device diagnostics identified the iOS crackle as an artefact of Apple's voice-processing loudspeaker route, not of the network or the app's buffering. Lock in the best available call settings, delete the diagnostic scaffolding built to find this, and recommend headphones to iOS users.

**Changes**
- Client lib: fixed iOS audio-session and capture configuration; playout-delay hint and mono experiment removed.
- UI: Debug switch and voice debug panel removed from `/voice`; iOS-only headphone hint added.
- i18n: one new key in four languages.

**Backend / schema changes** — None.

**Testing & verification** — Typecheck, Prettier, lint; desktop call regression; iPhone Safari and Chrome calls with and without earbuds.

**Risks & rollback** — Confined to `/voice`. Rollback is a revert of three files plus two deletions; no migration.

**Follow-ups / known debt** — Loudspeaker crackle on iOS remains an Apple platform limitation. If it becomes a blocker, the next lever is a half-duplex mode (mute the microphone while Aspira speaks) that lets echo cancellation be switched off — at the cost of interrupting her mid-sentence.
