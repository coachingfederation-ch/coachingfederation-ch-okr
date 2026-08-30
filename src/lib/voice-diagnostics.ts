/**
 * Opt-in diagnostics for Aspira's realtime voice call.
 *
 * The crackle we are chasing only reproduces on a real iPhone, so the phone
 * itself has to report what happened: how much audio the jitter buffer had to
 * conceal, how the RTP stream behaved, and whether the audio element was ever
 * paused or throttled by the OS. Nothing is collected until `setEnabled(true)`,
 * so the normal call path is untouched.
 */

export type VoiceStats = {
  /** Seconds since the panel started collecting. */
  uptime: number;
  jitterMs: number | null;
  jitterPeakMs: number | null;
  rttMs: number | null;
  packetsReceived: number | null;
  packetsLost: number | null;
  lossPct: number | null;
  /** Concealed samples in the last second — direct measure of buffer underrun. */
  concealedPerSec: number | null;
  concealedSamples: number | null;
  concealmentEvents: number | null;
  /** Average jitter-buffer delay in ms (delay / emittedCount). */
  jitterBufferMs: number | null;
  playoutDelayMs: number | null;
  codec: string | null;
  sampleRate: number | null;
  channels: number | null;
  audioLevel: number | null;
  totalEnergy: number | null;
};

export type VoiceLogEntry = { t: number; kind: string; detail?: string };

const EMPTY_STATS: VoiceStats = {
  uptime: 0,
  jitterMs: null,
  jitterPeakMs: null,
  rttMs: null,
  packetsReceived: null,
  packetsLost: null,
  lossPct: null,
  concealedPerSec: null,
  concealedSamples: null,
  concealmentEvents: null,
  jitterBufferMs: null,
  playoutDelayMs: null,
  codec: null,
  sampleRate: null,
  channels: null,
  audioLevel: null,
  totalEnergy: null,
};

const MAX_LOG = 200;

/**
 * Playback-route experiments for the iOS crackle hunt. The diagnostics run of
 * 2026-08-30 showed a clean stream (no loss, no concealment), so the artefact
 * is produced after decoding — on the device's own audio route. These flags let
 * one physical phone A/B the three remaining suspects in a single sitting.
 * Defaults reproduce today's behaviour exactly.
 */
export type VoiceExperiments = {
  /** `off` leaves WebKit's `auto` route selection alone. */
  audioSession: "off" | "play-and-record" | "playback";
  /** Ask the remote audio track for a single channel instead of stereo Opus. */
  mono: boolean;
  /** `mixed` is the current AEC-on / NS-off / AGC-off override. */
  micProcessing: "default" | "mixed" | "off";
};

const DEFAULT_EXPERIMENTS: VoiceExperiments = {
  audioSession: "play-and-record",
  mono: false,
  micProcessing: "mixed",
};

const EXPERIMENTS_KEY = "aspira.voice.experiments";

function loadExperiments(): VoiceExperiments {
  if (typeof window === "undefined") return DEFAULT_EXPERIMENTS;
  try {
    const raw = window.sessionStorage.getItem(EXPERIMENTS_KEY);
    if (!raw) return DEFAULT_EXPERIMENTS;
    return { ...DEFAULT_EXPERIMENTS, ...(JSON.parse(raw) as Partial<VoiceExperiments>) };
  } catch {
    return DEFAULT_EXPERIMENTS;
  }
}

let enabled = false;
let startedAt = 0;
let stats: VoiceStats = EMPTY_STATS;
let log: VoiceLogEntry[] = [];
let experiments: VoiceExperiments = loadExperiments();
let snapshot = { stats, log, experiments };
const listeners = new Set<() => void>();

function emit() {
  snapshot = { stats, log, experiments };
  for (const l of listeners) l();
}

/** Read the active experiment flags (used at session start, always defined). */
export function getVoiceExperiments(): VoiceExperiments {
  return experiments;
}

export function setVoiceExperiment<K extends keyof VoiceExperiments>(
  key: K,
  value: VoiceExperiments[K],
): void {
  experiments = { ...experiments, [key]: value };
  // Survive a reload mid-testing so a combination is not lost by accident.
  try {
    window.sessionStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments));
  } catch {
    /* storage unavailable (private mode) — flags stay in memory */
  }
  logVoiceEvent("experiment", `${key}=${String(value)}`);
  emit();
}

function describeExperiments(): string {
  return `audioSession=${experiments.audioSession} mono=${experiments.mono} micProcessing=${experiments.micProcessing}`;
}


export function subscribeVoiceDiagnostics(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getVoiceDiagnostics() {
  return snapshot;
}

export function isVoiceDiagnosticsEnabled() {
  return enabled;
}

export function setVoiceDiagnosticsEnabled(next: boolean) {
  if (enabled === next) return;
  enabled = next;
  if (next) {
    startedAt = Date.now();
    stats = EMPTY_STATS;
    log = [];
    logVoiceEvent("debug", "collection started");
    logVoiceEvent("device", describeDevice());
    logVoiceEvent("experiments", describeExperiments());

  } else {
    stats = EMPTY_STATS;
    log = [];
  }
  emit();
}

function describeDevice(): string {
  if (typeof navigator === "undefined") return "server";
  const session = (navigator as unknown as { audioSession?: { type?: string } }).audioSession;
  return [
    `ua=${navigator.userAgent}`,
    `touchPoints=${navigator.maxTouchPoints}`,
    session ? `audioSession=${session.type ?? "unset"}` : "audioSession=unsupported",
  ].join(" | ");
}

export function logVoiceEvent(kind: string, detail?: string) {
  if (!enabled) return;
  const entry: VoiceLogEntry = {
    t: startedAt ? (Date.now() - startedAt) / 1000 : 0,
    kind,
    ...(detail ? { detail } : {}),
  };
  log = [...log, entry].slice(-MAX_LOG);
  emit();
}

function publishStats(next: VoiceStats) {
  stats = next;
  emit();
}

/** Poll one receiver's `getStats()` once a second while diagnostics are on. */
export function startStatsPolling(receiver: RTCRtpReceiver | undefined): () => void {
  if (!receiver?.getStats) {
    logVoiceEvent("stats", "no RTCRtpReceiver exposed by the track");
    return () => {};
  }
  let prev: {
    at: number;
    concealedSamples: number;
    packetsReceived: number;
    packetsLost: number;
  } | null = null;
  let jitterPeak = 0;

  const tick = async () => {
    if (!enabled) return;
    let report: RTCStatsReport;
    try {
      report = await receiver.getStats();
    } catch {
      return;
    }
    const now = Date.now();
    let inbound: Record<string, number | string> | null = null;
    let codecId: string | null = null;
    let rttMs: number | null = null;
    let codec: Record<string, number | string> | null = null;

    report.forEach((raw) => {
      const r = raw as unknown as Record<string, number | string> & { type: string; id: string };
      if (r.type === "inbound-rtp" && r["kind"] === "audio") {
        inbound = r;
        codecId = (r["codecId"] as string) ?? null;
      } else if (r.type === "remote-outbound-rtp" && typeof r["roundTripTime"] === "number") {
        rttMs = (r["roundTripTime"] as number) * 1000;
      } else if (
        r.type === "candidate-pair" &&
        r["state"] === "succeeded" &&
        typeof r["currentRoundTripTime"] === "number" &&
        rttMs === null
      ) {
        rttMs = (r["currentRoundTripTime"] as number) * 1000;
      }
    });
    if (codecId) {
      const c = report.get(codecId) as unknown as Record<string, number | string> | undefined;
      if (c) codec = c;
    }
    if (!inbound) return;
    const i = inbound as Record<string, number | string>;

    const num = (k: string): number | null => (typeof i[k] === "number" ? (i[k] as number) : null);
    const jitterMs = num("jitter") !== null ? (num("jitter") as number) * 1000 : null;
    if (jitterMs !== null) jitterPeak = Math.max(jitterPeak, jitterMs);

    const packetsReceived = num("packetsReceived");
    const packetsLost = num("packetsLost");
    const concealedSamples = num("concealedSamples");
    const jbDelay = num("jitterBufferDelay");
    const jbCount = num("jitterBufferEmittedCount");

    let concealedPerSec: number | null = null;
    let lossPct: number | null = null;
    if (prev && concealedSamples !== null) {
      const dt = Math.max(0.001, (now - prev.at) / 1000);
      concealedPerSec = Math.round((concealedSamples - prev.concealedSamples) / dt);
    }
    if (prev && packetsReceived !== null && packetsLost !== null) {
      const dRecv = packetsReceived - prev.packetsReceived;
      const dLost = packetsLost - prev.packetsLost;
      const total = dRecv + dLost;
      lossPct = total > 0 ? (dLost / total) * 100 : 0;
    }
    prev = {
      at: now,
      concealedSamples: concealedSamples ?? 0,
      packetsReceived: packetsReceived ?? 0,
      packetsLost: packetsLost ?? 0,
    };

    publishStats({
      uptime: startedAt ? (now - startedAt) / 1000 : 0,
      jitterMs,
      jitterPeakMs: jitterPeak || null,
      rttMs,
      packetsReceived,
      packetsLost,
      lossPct,
      concealedPerSec,
      concealedSamples,
      concealmentEvents: num("concealmentEvents"),
      jitterBufferMs: jbDelay !== null && jbCount ? (jbDelay / jbCount) * 1000 : null,
      playoutDelayMs: num("playoutDelay") !== null ? (num("playoutDelay") as number) * 1000 : null,
      codec: codec ? String(codec["mimeType"] ?? "") || null : null,
      sampleRate: codec && typeof codec["clockRate"] === "number" ? codec["clockRate"] : null,
      channels: codec && typeof codec["channels"] === "number" ? codec["channels"] : null,
      audioLevel: num("audioLevel"),
      totalEnergy: num("totalAudioEnergy"),
    });
  };

  void tick();
  const id = window.setInterval(() => void tick(), 1000);
  return () => window.clearInterval(id);
}

/** Log the playback lifecycle of a remote audio element. */
export function watchAudioElement(el: HTMLAudioElement): () => void {
  const events = [
    "play",
    "playing",
    "pause",
    "stalled",
    "waiting",
    "suspend",
    "ended",
    "ratechange",
    "volumechange",
    "error",
  ] as const;
  const handlers: Array<[string, () => void]> = events.map((name) => {
    const handler = () =>
      logVoiceEvent(
        `el:${name}`,
        `readyState=${el.readyState} paused=${el.paused} muted=${el.muted} volume=${el.volume.toFixed(2)}`,
      );
    el.addEventListener(name, handler);
    return [name, handler];
  });

  const onVisibility = () => logVoiceEvent("visibility", document.visibilityState);
  document.addEventListener("visibilitychange", onVisibility);

  // Autoplay outcome: iOS can reject play() even inside a gesture-started call.
  void el
    .play()
    .then(() => logVoiceEvent("autoplay", "play() resolved"))
    .catch((e: unknown) =>
      logVoiceEvent("autoplay", `play() rejected: ${e instanceof Error ? e.name : String(e)}`),
    );

  return () => {
    for (const [name, handler] of handlers) el.removeEventListener(name, handler);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** Flatten stats + log into text the user can paste back from a phone. */
export function formatVoiceDiagnostics(): string {
  const s = snapshot.stats;
  const fmt = (v: number | null, digits = 1) => (v === null ? "—" : v.toFixed(digits));
  const head = [
    `uptime            ${fmt(s.uptime, 0)}s`,
    `jitter            ${fmt(s.jitterMs)} ms (peak ${fmt(s.jitterPeakMs)})`,
    `rtt               ${fmt(s.rttMs)} ms`,
    `packets recv/lost ${s.packetsReceived ?? "—"} / ${s.packetsLost ?? "—"} (${fmt(s.lossPct, 2)}%)`,
    `concealed/sec     ${s.concealedPerSec ?? "—"}`,
    `concealed total   ${s.concealedSamples ?? "—"} in ${s.concealmentEvents ?? "—"} events`,
    `jitter buffer     ${fmt(s.jitterBufferMs)} ms`,
    `playout delay     ${fmt(s.playoutDelayMs)} ms`,
    `codec             ${s.codec ?? "—"} ${s.sampleRate ?? "—"}Hz ch=${s.channels ?? "—"}`,
    `audio level       ${fmt(s.audioLevel, 3)} energy=${fmt(s.totalEnergy, 3)}`,
  ].join("\n");
  const body = snapshot.log
    .map((e) => `${e.t.toFixed(1).padStart(6)}s  ${e.kind}${e.detail ? `  ${e.detail}` : ""}`)
    .join("\n");
  return `${head}\n\n${body}`;
}
