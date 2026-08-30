# Stage 2 — Put iOS on the WebSocket audio path

Stage 1 (longer playout buffer, lighter microphone processing) removed most of the noise but small crackles remain on iPhone. That is the remaining evidence that the WebRTC playback route itself is the problem on iOS: the audio is handed to the system's realtime voice pipeline, and we cannot buffer it any further from inside the page.

The voice SDK supports a second transport that streams plain audio over a WebSocket and plays it back through the page's own audio graph — the same graph that is already clean on desktop. iOS switches to it; desktop stays exactly as it is today.

## What changes

- **A signed session link from the server.** The WebSocket path needs a different kind of session credential than the current token. The server gains a second way to open a session and returns whichever one the device needs. Language, Swiss German, prompt, greeting and voices are unchanged — same agents, same voice IDs.
- **iOS connects over WebSocket.** On iPhone and iPad the call starts on the new transport; everything else (start, mute, unmute, interrupt, end, live objective highlighting, transcript) behaves the same.
- **Playback runs through our own audio graph on iOS again.** Because playback is no longer WebRTC, the shared audio context we already build for desktop is reused on iOS, with a playback-oriented buffer. The iOS-specific WebRTC tuning from Stage 1 stays in place but only applies if we ever fall back to WebRTC.
- **Fallback.** If the signed link cannot be obtained, iOS silently falls back to today's WebRTC path rather than failing the call.

## Honest risk

This trades one known artefact for a different set: WebSocket playback is more sensitive to a weak network (a stall becomes a short gap rather than a crackle), and it slightly increases the delay before Aspira starts talking. If it sounds worse to you on cellular, reverting iOS to WebRTC is a one-line switch.

## Verification

- Scripted desktop call unchanged (still WebRTC, still clean).
- Emulated iOS call confirms the WebSocket session connects, the microphone publishes, and the transcript and objective highlighting still work.
- Final judgement is yours: iPhone Safari and iPhone Chrome, once on Wi-Fi and once on cellular, listening to a full answer.
- German, French, Italian and Swiss German each connect with the correct voice.

## Technical notes

- `src/lib/voice.server.ts`: add a signed-URL request (`GET /v1/convai/conversation/get-signed-url?agent_id=…` with `xi-api-key`) next to the existing conversation-token request; keep agent selection, prompt, greeting and language logic shared. Return `{ signedUrl }` alongside the existing fields.
- `src/routes/api/voice-token.ts`: accept a `transport: "webrtc" | "websocket"` flag in the POST body, mint the matching credential, keep the current rate limiting and no-store headers.
- `src/routes/voice.tsx`: request `transport: isIosLike() ? "websocket" : "webrtc"`; start the session with `{ signedUrl, connectionType: "websocket" }` on iOS and the unchanged `{ conversationToken, connectionType: "webrtc" }` elsewhere; on iOS acquire the shared audio context on the start gesture again (currently skipped) so the SDK's own output controller uses it. Fall back to the token path if the signed URL is absent.
- `src/lib/voice-audio.ts`: no removal — the iOS playout-delay/capture hardening stays for the WebRTC fallback; only the "skip Web Audio on iOS" guard becomes conditional on actually being on WebRTC.
- No database, schema, RLS or agent-configuration changes.

## PR note

**Summary** — Route iOS voice calls over the SDK's WebSocket audio transport instead of WebRTC, to remove the residual crackling that longer playout buffering did not fix; desktop stays on WebRTC.

**Changes**
- Backend: signed-URL session minting in `src/lib/voice.server.ts`; `transport` flag on `/api/voice-token`.
- UI/client: transport selection and iOS audio-graph reuse in `src/routes/voice.tsx`; conditional iOS guard in `src/lib/voice-audio.ts`.

**Backend / schema changes** — None (no migrations; one additional ElevenLabs API call server-side).

**Testing & verification** — Typecheck, Prettier, lint; scripted desktop call for regression; emulated iOS connect/publish check; manual iPhone Safari and Chrome listening test by the user; DE/FR/IT and Swiss German connection check.

**Risks & rollback** — Scoped to `/voice`. WebSocket playback is more network-sensitive and adds slight startup latency on iPhone. Rollback is forcing `transport: "webrtc"` for all devices; no migration to unwind.

**Follow-ups / known debt** — If cellular proves worse than Wi-Fi on WebSocket, consider choosing the transport from measured connection quality rather than platform alone.
