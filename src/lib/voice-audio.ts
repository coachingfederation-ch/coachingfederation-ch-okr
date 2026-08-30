import {
  setWebRTCAudioAdapterFactory,
  type AnalysisResult,
  type WebRTCAudioAdapter,
} from "@elevenlabs/client/internal";
import type { RemoteAudioTrack } from "livekit-client";

/**
 * Aspira's realtime voice call used to run on two separate AudioContexts per
 * session: the SDK's default web adapter creates one for microphone level
 * analysis and another for the speaker-side worklet, and closes/recreates them
 * on every device change. Two graphs on iOS Safari fight over the hardware and
 * produce crackling and clipping.
 *
 * This module keeps a single page-level AudioContext, created with
 * `latencyHint: "playback"` so the browser is allowed a larger buffer and can
 * ride out underflows, and routes both microphone input and output analysis
 * through it. Playback itself still rides the LiveKit audio element, which is
 * how the SDK works in WebRTC mode.
 *
 * On iOS the graph is skipped entirely — see SharedContextAudioAdapter below.
 */

let sharedContext: AudioContext | null = null;
let refs = 0;

/** Get (or lazily create) the one AudioContext used by the voice page. */
export function acquireSharedAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === "closed") {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error("Web Audio is not available in this browser");
    sharedContext = new Ctor({ latencyHint: "playback" });
  }
  refs += 1;
  // Safari starts contexts suspended until a user gesture resumes them.
  if (sharedContext.state === "suspended") void sharedContext.resume().catch(() => {});
  return sharedContext;
}

/** Release one reference; the context closes when the last consumer is gone. */
export function releaseSharedAudioContext(): void {
  refs = Math.max(0, refs - 1);
  if (refs === 0 && sharedContext) {
    const ctx = sharedContext;
    sharedContext = null;
    void ctx.close().catch(() => {});
  }
}

/** iOS/iPadOS Safari, including iPads that report themselves as "Macintosh". */
export function isIosLike(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/**
 * Ask iOS for the "play and record" audio session so a live call keeps a
 * full-bandwidth playback route instead of falling back to the narrowband
 * voice route, which is what turns Aspira's speech into crackle on a phone.
 * Safari 16.4+; a no-op everywhere else.
 */
export function prepareIosAudioSession(): void {
  const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
  if (!session) return;
  try {
    session.type = "play-and-record";
  } catch {
    /* unsupported value on this Safari build */
  }
}

/** Volume/frequency readout backed by an AnalyserNode on the shared context. */
function analyserVolumeProvider(analyser: AnalyserNode) {
  const raw = new Uint8Array(analyser.frequencyBinCount);
  return {
    getVolume() {
      analyser.getByteFrequencyData(raw);
      let sum = 0;
      for (const v of raw) sum += v;
      return raw.length ? sum / raw.length / 255 : 0;
    },
    getByteFrequencyData(buffer: Uint8Array<ArrayBuffer>) {
      analyser.getByteFrequencyData(raw);
      const step = raw.length / buffer.length;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] = raw[Math.min(raw.length - 1, Math.floor(i * step))] ?? 0;
      }
    },
  };
}

/** Volume readout used on iOS, where the audio graph stays empty. */
const SILENT_VOLUME = {
  getVolume: () => 0,
  getByteFrequencyData: (buffer: Uint8Array<ArrayBuffer>) => buffer.fill(0),
};

/**
 * Seconds of incoming audio iOS should buffer before playing it. Phones lose
 * packets far more often than desktops; without a cushion the player runs dry
 * mid-word and that underflow is what you hear as crackle. ~200 ms costs a
 * barely perceptible delay and covers ordinary Wi-Fi/cellular jitter.
 */
const IOS_PLAYOUT_DELAY_SECONDS = 0.2;

/**
 * Loosen the capture chain on iOS. The SDK asks for noise suppression and auto
 * gain on top of echo cancellation; that combination pushes the device onto its
 * narrowband voice-processing route, which degrades the playback side of the
 * same session. Echo cancellation stays on — the phone speaker needs it.
 *
 * Safari silently ignores constraints it does not implement, so this is a
 * best-effort nudge rather than a guarantee.
 */
function relaxIosCaptureProcessing(track: MediaStreamTrack): void {
  void track
    .applyConstraints({
      echoCancellation: true,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
    })
    .catch(() => {
      /* constraint unsupported on this build — keep the default capture */
    });
}

/**
 * Drop-in replacement for the SDK's web adapter that never creates a context of
 * its own: input and output analysis share the one graph above.
 *
 * On iOS no analysis runs at all. Every MediaStream tap there pulls the live
 * call through Web Audio on top of the element playback, and that second
 * consumer is a known source of clipping on Safari. This page never renders
 * volume meters, so nothing visible is lost.
 */
class SharedContextAudioAdapter implements WebRTCAudioAdapter {
  private audioElements: HTMLAudioElement[] = [];
  private nodes: AudioNode[] = [];
  private ctx: AudioContext | null = null;
  private readonly analysisDisabled = isIosLike();

  /** One reference per adapter, taken on first use and released on cleanup. */
  private context(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = acquireSharedAudioContext();
    } else if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  async attachRemoteTrack(track: RemoteAudioTrack, outputDeviceId: string | null) {
    const el = track.attach();
    el.autoplay = true;
    el.controls = false;
    el.muted = false;
    // Without playsInline iOS can hand the stream to the fullscreen player.
    el.setAttribute("playsinline", "");
    (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    if (this.analysisDisabled) {
      const withDelay = track as RemoteAudioTrack & {
        setPlayoutDelay?: (seconds: number) => void;
      };
      try {
        withDelay.setPlayoutDelay?.(IOS_PLAYOUT_DELAY_SECONDS);
      } catch {
        /* receiver does not expose a playout delay hint */
      }
      // An interruption (notification, lock screen) can pause the element;
      // iOS does not resume it on its own, and silence reads as a dropped call.
      el.addEventListener("pause", () => {
        void el.play().catch(() => {});
      });
    }
    if (outputDeviceId && el.setSinkId) {
      try {
        await el.setSinkId(outputDeviceId);
      } catch (error) {
        console.warn("Failed to set output device for new audio element:", error);
      }
    }
    el.style.display = "none";
    document.body.appendChild(el);
    this.audioElements.push(el);
  }

  setupInputAnalysis(mediaStreamTrack: MediaStreamTrack): AnalysisResult {
    if (this.analysisDisabled) {
      relaxIosCaptureProcessing(mediaStreamTrack);
      return { volumeProvider: SILENT_VOLUME };
    }
    const ctx = this.context();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
    source.connect(analyser);
    this.nodes.push(source, analyser);
    return { volumeProvider: analyserVolumeProvider(analyser), analyser };
  }

  async setupOutputAnalysis(track: RemoteAudioTrack): Promise<AnalysisResult> {
    if (this.analysisDisabled) return { volumeProvider: SILENT_VOLUME };
    const ctx = this.context();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    const source = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
    source.connect(analyser);
    this.nodes.push(source, analyser);
    // No raw-audio worklet: the page does not consume onAudio, and that extra
    // tap on the incoming stream is exactly what we want off the graph.
    return { volumeProvider: analyserVolumeProvider(analyser), analyser };
  }

  setVolume(volume: number) {
    for (const element of this.audioElements) element.volume = volume;
  }

  async setOutputDevice(deviceId: string) {
    if (!("setSinkId" in HTMLAudioElement.prototype)) {
      throw new Error("setSinkId is not supported in this browser");
    }
    await Promise.all(this.audioElements.map((element) => element.setSinkId(deviceId)));
  }

  cleanup() {
    for (const node of this.nodes) {
      try {
        node.disconnect();
      } catch {
        /* already detached */
      }
    }
    this.nodes = [];
    for (const element of this.audioElements) element.remove();
    this.audioElements = [];
    if (this.ctx) {
      this.ctx = null;
      releaseSharedAudioContext();
    }
  }
}

let registered = false;

/** Register the shared-context adapter once, before a session starts. */
export function useSharedVoiceAudio(): void {
  if (registered || typeof window === "undefined") return;
  registered = true;
  setWebRTCAudioAdapterFactory(() => new SharedContextAudioAdapter());
}
