# One shared audio context for Aspira's voice call

Goal: remove the crackling and clipping during live voice sessions, and stop iOS Safari from fighting over multiple audio graphs.

## What I found in the current setup

The `/voice` page runs the ElevenLabs SDK in WebRTC mode. In that mode the SDK's built-in web audio layer creates **two separate `AudioContext` instances per call** — one for microphone level analysis, one for the speaker-side analysis worklet — each with default options, and it tears them down and recreates them whenever the input device changes. Spoken audio itself is played back by an HTML audio element attached to the incoming track, not by those contexts.

So the shared-context change is worth doing (two contexts on iOS Safari is exactly the graph conflict you describe), but it is honest to say up front: because playback rides an audio element in WebRTC mode, a `latencyHint` on the shared context smooths the analysis/capture path, not the loudspeaker path. If crackling remains after this change, the next suspect is the network/jitter side of the WebRTC stream, and I would measure before changing more.

## The change

- Add a small shared audio-context module: one lazily created `AudioContext({ latencyHint: "playback" })` per page, reference-counted, resumed on the user gesture that starts the call, and closed only when the last consumer releases it.
- Register a custom SDK audio adapter (the SDK exposes a supported factory hook for this) that uses that single context for both microphone input analysis and output analysis instead of constructing its own contexts. Input and output nodes therefore live in the same graph — the iOS Safari requirement.
- Wire the adapter registration into the `/voice` page before a session starts, and release the shared context when the page unmounts, so no live context is left behind.
- No changes to the token endpoint, the agent configuration, voices, languages, transcripts, or the page layout.

## Verification

- Typecheck, then a live call in the preview: confirm a session connects, Aspira speaks, the transcript fills, and the objective highlight still follows her.
- Confirm in the browser that exactly one `AudioContext` exists during a call and that its state returns to closed after leaving the page.
- Listen for crackling before/after on desktop; check a mobile Safari width for graph errors in the console.
- Re-check mute, end call, and starting a second call in the same page visit (context reuse path).

## PR note

**Summary** — Routes ElevenLabs microphone input and output analysis through a single shared `AudioContext` created with `latencyHint: "playback"`, replacing the SDK's per-call pair of default contexts, to reduce audio artefacts and avoid iOS Safari audio graph conflicts.

**Changes**
- UI/client: new shared audio-context helper; custom SDK audio adapter registered from the `/voice` page; release on unmount.
- Backend/schema: none.

**Backend / Schema Changes** — None.

**Testing & Verification** — Typecheck; live voice session (connect, speak, interrupt, end, restart); single-context assertion in the browser; mute and unmount paths; mobile width.

**Risks & Rollback** — Scoped to the voice page's audio plumbing; a faulty adapter would degrade the volume meter or mic capture rather than the app at large. Rollback is removing the adapter registration so the SDK falls back to its own contexts.

**Follow-ups / Known Debt** — If artefacts persist, investigate the WebRTC jitter buffer and network side; playback in WebRTC mode does not pass through the shared context, so it cannot be smoothed from the app side.
