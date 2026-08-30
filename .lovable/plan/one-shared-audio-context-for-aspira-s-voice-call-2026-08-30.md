# One shared audio context for Aspira's voice call

Goal: remove the crackling and clipping during live voice sessions, and stop iOS Safari from fighting over multiple audio graphs.

## What I found in the current setup

The `/voice` page runs the ElevenLabs SDK in WebRTC mode. In that mode the SDK's built-in web audio layer creates **two separate `AudioContext` instances per call** — one for microphone level analysis, one for the speaker-side analysis worklet — each with default options, and it tears them down and recreates them whenever the input device changes. Spoken audio itself is played back by an HTML audio element attached to the incoming track, not by those contexts.

My recommendation is to measure one real call first, before changing the audio plumbing. The shared context is worth doing on its own merits, since two contexts on iOS Safari is exactly the graph conflict you describe, but playback rides an audio element in WebRTC mode, so a `latencyHint` on the shared context smooths the analysis and capture path rather than the loudspeaker path, and on its own it is unlikely to cure the crackling. The page also never reads audio levels, yet the SDK still spins up those analysis contexts and an audio worklet that taps the incoming stream — that idle tap is a cheaper and more likely suspect than the context options. So step one is a short diagnostic pass on a live call: WebRTC receive stats (packet loss, jitter, concealed samples), plus whether the artefacts disappear when the output analysis tap is not attached. The result decides whether the real fix is dropping the tap, the network side, or the shared context — and the shared context is still implemented either way for iOS Safari.

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
