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
 * through it. Playback itself still rides the LiveKit <audio> element, which is
 * how the SDK works in WebRTC mode.
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

/**
 * Drop-in replacement for the SDK's web adapter that never creates a context of
 * its own: input and output analysis share the one graph above.
 */
class SharedContextAudioAdapter implements WebRTCAudioAdapter {
  private audioElements: HTMLAudioElement[] = [];
  private nodes: AudioNode[] = [];
  private ctx: AudioContext | null = null;

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
    const ctx = this.context();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
    source.connect(analyser);
    this.nodes.push(source, analyser);
    return { volumeProvider: analyserVolumeProvider(analyser), analyser };
  }

  async setupOutputAnalysis(track: RemoteAudioTrack): Promise<AnalysisResult> {
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
