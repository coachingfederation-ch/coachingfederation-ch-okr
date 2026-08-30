# iOS crackle: it is not the network — chase the output route

## What your capture proves

The 70-second iPhone run is a clean stream:

- 2625 packets received, **0 lost**, jitter 1.0 ms (peak 3.0 ms), RTT 131 ms
- `concealed/sec` stayed at **0** for the whole call; the 420 concealed samples in **1** event is ~9 ms, at connection setup
- The audio element played once and never paused, stalled or waited after start
- Codec is Opus 48 kHz, **2 channels**
- `audioSession=auto`

So the jitter buffer never ran dry. Buffer underrun — the thing the extra 200 ms playout delay was meant to fix — is not what you are hearing. The crackle is produced after decoding, on the device's own playback route. Three candidates remain, and this plan tests them one at a time instead of guessing.

## Candidates, in order of likelihood

1. **The iOS audio session is never actually switched.** The log shows `auto`, meaning WebKit picks the route itself. With the microphone live it picks the voice-processing (narrowband, AEC-heavy) route, which is exactly the route that renders speech as crackly. The code already tries to set `play-and-record`, but nothing confirms it takes effect.
2. **Stereo Opus into a mono phone speaker.** The agent stream is 2-channel; the iPhone downmixes it inside the same voice-processing route. A mono request removes that step.
3. **Our own microphone constraint override.** We currently force `echoCancellation: true, noiseSuppression: false, autoGainControl: false`. That mixed configuration is unusual on WebKit; either fully-on or fully-off is better behaved, and the mismatch may itself be creating the artefact.

## The change

Rather than one speculative fix, add a small **Experiments** block to the existing debug panel with three switches, so you can settle the question in a single sitting on the phone:

- **Audio session** — off / `play-and-record` / `playback`
- **Mono audio** — request a single channel from the agent stream
- **Mic processing** — device default / current mixed setting / all processing off

Each switch is read when the call starts, and its actual applied value is written into the log (for example `audioSession set=play-and-record readback=play-and-record`), so we see whether Safari accepted it rather than assuming. Defaults reproduce today's behaviour exactly, so nothing changes until you flip something.

Then: start a call, listen, note the combination, end, flip one switch, repeat. Whichever combination is clean becomes the permanent iOS setting and the experiment block is deleted.

## Verification

- Desktop Chrome: unchanged behaviour with all switches at default.
- iPhone (Chrome and Safari): four short calls — baseline, session set, mono, no mic processing — each with the log copied so we can pair what you heard with what the device reported.
- Confirm the debug panel still adds no work when Debug is off.

## Technical notes

- `src/lib/voice-diagnostics.ts`: hold the experiment flags in the same module-level store, exposed through the existing subscribe/snapshot pair; add a setter per flag. Flags persist in `sessionStorage` so a reload mid-testing does not reset them.
- `src/lib/voice-audio.ts`:
  - `prepareIosAudioSession(type)` takes the requested type, assigns it, reads `navigator.audioSession.type` back and logs both.
  - `relaxIosCaptureProcessing` branches on the mic-processing flag: skip entirely (device default), current constraints, or all three off.
  - Mono: ask for `channelCount: 1` on the remote side by setting the receiver's preferred codec parameters where WebKit allows it, and otherwise force the element's channel handling by re-attaching through a mono `MediaStream` — logged either way so we know which path applied.
- `src/components/okr/VoiceDebugPanel.tsx`: an Experiments section above the stats table, English-only, using existing `Switch`/`Label` tokens with 44 px targets. Copy output includes the active flags so each paste is self-describing.
- `src/routes/voice.tsx`: reads the flags when starting a session; no other change.
- No backend, schema, transport, agent-configuration or i18n changes.

## PR note

**Summary** — The iOS diagnostics run rules out packet loss and jitter-buffer underrun as the crackle cause, so add gated playback-route experiments (audio session type, mono downmix, microphone processing) to the existing debug panel to isolate the real cause on a physical device.

**Changes**
- Client lib: experiment flags in the voice diagnostics store; audio-session readback logging and flag-driven capture/channel handling in the shared audio adapter.
- UI: Experiments section in `VoiceDebugPanel`; flag read at session start on `/voice`.

**Backend / schema changes** — None.

**Testing & verification** — Typecheck, Prettier, lint; desktop call confirming default behaviour is untouched; four-combination listening test on iPhone Safari and Chrome with logs copied back.

**Risks & rollback** — Scoped to `/voice` and inert at defaults. Revert is three files, no migration.

**Follow-ups / known debt** — Once one combination is confirmed clean, hard-code it for iOS and remove both the experiment block and the debug panel. The 200 ms iOS playout delay is now known not to be helping and should be reconsidered in that same cleanup.
