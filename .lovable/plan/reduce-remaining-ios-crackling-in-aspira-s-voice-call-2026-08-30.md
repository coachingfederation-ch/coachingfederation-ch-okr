# Reduce remaining iOS crackling in Aspira's voice call

Desktop is clean. iOS (Safari and Chrome, both WebKit) improved but still crackles, so the cause is not the Web Audio taps we already removed — it is the WebRTC playback path itself on iOS. Two levers remain, applied in order.

## Stage 1 — Tune the live WebRTC audio on iOS

Applied only on iOS; desktop behaviour stays exactly as it is now.

- **Increase the jitter buffer.** iOS drops packets more often on cellular and mixed Wi-Fi; the player then runs dry and produces short crackles. Ask the incoming audio track to hold ~200 ms of buffer before playing. Slightly later audio, noticeably smoother.
- **Relax the microphone processing.** The call currently captures with echo cancellation, noise suppression and auto gain all on. On iOS this pushes the device into its voice-processing route, which narrows bandwidth and interacts badly with playback. Capture with lighter processing on iOS and let the device's own hardware handle echo.
- **Keep the audio element on the call route.** Confirm the remote audio element stays inline and unmuted through interruptions (incoming notification, screen lock, backgrounding).

If Stage 1 makes it clean, we stop there.

## Stage 2 — Only if crackling persists: WebSocket audio on iOS

The voice SDK supports a second transport that streams plain PCM over a WebSocket instead of WebRTC, bypassing the iOS voice-processing route entirely. It needs a signed session URL from the server rather than the current token, and iOS would use it while desktop stays on WebRTC.

This is a larger change (new server endpoint, a second code path to keep working in all four languages plus Swiss German), so it is deliberately held back until Stage 1 is measured.

## Verification

- Reconnect on iPhone Safari and iPhone Chrome, on Wi-Fi and on cellular, and listen for a full agent answer.
- Check that starting, muting, unmuting, interrupting and ending the call still behave.
- Confirm desktop Chrome and Safari are unchanged.
- Confirm the German, French, Italian and Swiss German voices still connect.

Because the artefact is only reproducible on a real iPhone, the final confirmation has to come from you — I cannot hear it from here.

## Technical notes

- `src/lib/voice-audio.ts`: add an iOS-only helper that, given the LiveKit `Room`, calls `setPlayoutDelay(0.2)` on each remote audio track as it subscribes, and asserts `playsInline`/`muted = false` on the attached element.
- `src/routes/voice.tsx`: reach the active `Conversation` instance through the React SDK's conversation context, take `getRoom()` from its WebRTC connection, and wire the helper on `RoomEvent.TrackSubscribed` (plus already-subscribed tracks) once the session reports connected; tear the listener down on session end.
- Microphone constraints: pass iOS-specific capture settings through the session start config so `noiseSuppression` and `autoGainControl` are off and `echoCancellation` stays on; desktop keeps the SDK defaults.
- No change to `src/lib/voice.server.ts`, the agent configuration, voice IDs, or locale handling in Stage 1.

## PR note

**Summary** — Reduce audible crackling in the Aspira realtime voice call on iOS by buffering incoming audio longer and capturing the microphone with lighter processing, without changing desktop behaviour.

**Changes**
- UI/client: iOS-only playout-delay and audio-element hardening in `src/lib/voice-audio.ts`; room wiring in `src/routes/voice.tsx`; iOS-only microphone capture constraints.

**Backend / schema changes** — None.

**Testing & verification** — Typecheck, Prettier, lint; scripted desktop call to confirm no regression; manual iPhone Safari and Chrome listening test by the user; language switch check across DE/FR/IT and Swiss German.

**Risks & rollback** — Scoped to the `/voice` route and iOS only. Worst case is ~200 ms extra latency in agent replies on iPhone. Revert is the two files, no migration.

**Follow-ups / known debt** — Stage 2 (WebSocket transport on iOS) stays open if crackling remains. LiveKit still creates its own internal audio contexts we cannot configure through the SDK's public surface.
