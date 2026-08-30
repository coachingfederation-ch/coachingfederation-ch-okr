# Debug panel for the Aspira voice call

Add an opt-in diagnostics panel on `/voice` that shows live WebRTC receive statistics and a running log of audio-element playback events, so the source of the remaining iOS crackle can be identified from a real phone instead of guessed at.

## What you will see

A "Debug" toggle in the call panel (off by default, so the normal experience is untouched). When on, a monospace panel appears under the transcript with:

**Live stats, refreshed once per second**

- Jitter (ms) and a peak value for the session
- Packets received, packets lost, loss percentage
- Round-trip time (ms)
- Concealed samples and concealment events — the direct measure of "the player ran dry", which is what crackle sounds like
- Jitter buffer delay and current playout delay
- Codec, sample rate, channels
- Audio level and total energy

**Event log, newest last**

- Session status changes (connecting, connected, disconnected) and errors
- Autoplay outcome: whether `play()` on the remote audio element resolved or was rejected
- Element events: `play`, `pause`, `stalled`, `waiting`, `suspend`, `ended`, `ratechange`, `volumechange`, plus `readyState` and `paused` at the moment of each
- Page visibility changes and `audioSession.type` on iOS
- Device summary: iOS or not, user agent, whether a shared AudioContext exists and its state

Each entry is timestamped relative to call start. A "Copy" button copies the whole panel (stats snapshot plus log) as text so it can be pasted back here from the phone.

## Verification

- Desktop Chrome: start a call, confirm stats populate and the log records play/pause events, and that toggling the panel off leaves the call unaffected.
- iPhone Safari and Chrome: run a full answer, then copy the log; concealment events climbing during audible crackle confirms buffer underflow, while a flat concealment count during crackle points elsewhere (capture route or element handoff).
- Confirm the panel is hidden by default and adds no work when off.

## Technical notes

- `src/lib/voice-audio.ts`: extend the existing adapter, which is already the single place the remote track and audio element are handled.
  - Keep a module-level diagnostics store: a ring buffer of log entries plus the latest stats snapshot, with a subscribe function so React can render it. Nothing is collected unless diagnostics are enabled, so the default path is unchanged.
  - In `attachRemoteTrack`, register the element listeners above and record the result of the initial `play()` promise (autoplay allowed vs. rejected).
  - Poll `track.receiver.getStats()` (the `RTCRtpReceiver` LiveKit exposes on `RemoteAudioTrack`) on a 1 s interval while enabled, reading the `inbound-rtp` report for jitter, `packetsLost`, `packetsReceived`, `concealedSamples`, `concealmentEvents`, `jitterBufferDelay` / `jitterBufferEmittedCount`, `audioLevel`, `totalAudioEnergy`, plus the paired `remote-outbound-rtp` / `candidate-pair` report for RTT, and the `codec` report for codec and sample rate. Derive per-second deltas so the numbers read as rates, not lifetime totals.
  - Clear the interval and listeners in `cleanup()`.
- New `src/components/okr/VoiceDebugPanel.tsx`: subscribes to the store with `useSyncExternalStore`, renders the stats table and the log, and holds the copy-to-clipboard action. Styled with existing tokens (bordered card, muted text, `font-mono` for numbers), collapsed by default, 44px targets.
- `src/routes/voice.tsx`: a `Switch` labelled "Debug" next to the Swiss German toggle, gating the panel and calling the enable/disable function on the diagnostics store. Also feeds session status changes and `onError` into the log.
- Labels in the debug panel stay English only — it is a diagnostic surface, not user-facing content, so no new i18n keys.
- No changes to transport, playout delay, capture constraints, `src/lib/voice.server.ts`, or the backend.

## PR note

**Summary** — Add an opt-in diagnostics panel to the `/voice` route exposing live WebRTC inbound-audio statistics and an audio-element playback event log, to locate the source of residual crackling on iOS.

**Changes**
- UI: new `VoiceDebugPanel` component; debug toggle in the call panel on `/voice`.
- Client lib: diagnostics store, element event logging and receiver stats polling inside the existing shared audio adapter in `src/lib/voice-audio.ts`.

**Backend / schema changes** — None.

**Testing & verification** — Typecheck, Prettier, lint; scripted desktop call confirming stats populate and the call is unaffected; manual iPhone Safari and Chrome capture of the log by the user.

**Risks & rollback** — Scoped to `/voice`; collection is inert while the toggle is off. Revert is two files, no migration.

**Follow-ups / known debt** — The panel is a diagnostic aid, not a permanent feature; remove it once the crackle cause is fixed. Labels are untranslated by design.
