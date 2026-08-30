import * as React from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  formatVoiceDiagnostics,
  getVoiceDiagnostics,
  setVoiceExperiment,
  subscribeVoiceDiagnostics,
  type VoiceExperiments,
  type VoiceStats,
} from "@/lib/voice-diagnostics";

const EMPTY = {
  stats: null as unknown as VoiceStats,
  log: [] as [],
  experiments: {
    audioSession: "play-and-record",
    mono: false,
    micProcessing: "mixed",
  } as VoiceExperiments,
};

function num(v: number | null | undefined, digits = 1, suffix = "") {
  return v === null || v === undefined ? "—" : `${v.toFixed(digits)}${suffix}`;
}

/** Small segmented control for the multi-value experiment flags. */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-11 rounded-full border border-border px-3 text-xs font-medium transition-colors",
              value === o.value
                ? "border-transparent bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}


/**
 * Diagnostic surface for the realtime call. Deliberately English-only and
 * plain: it exists to be read on a phone and pasted back into a bug report.
 */
export function VoiceDebugPanel() {
  const snap = React.useSyncExternalStore(
    subscribeVoiceDiagnostics,
    getVoiceDiagnostics,
    () => EMPTY as unknown as ReturnType<typeof getVoiceDiagnostics>,
  );
  const [copied, setCopied] = React.useState(false);
  const logRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [snap.log]);

  const s = snap.stats;
  const rows: Array<[string, string]> = [
    ["Uptime", num(s?.uptime, 0, " s")],
    ["Jitter", `${num(s?.jitterMs)} ms (peak ${num(s?.jitterPeakMs)})`],
    ["RTT", num(s?.rttMs, 1, " ms")],
    ["Packets recv", s?.packetsReceived?.toString() ?? "—"],
    ["Packets lost", `${s?.packetsLost ?? "—"} (${num(s?.lossPct, 2, " %")})`],
    ["Concealed / s", s?.concealedPerSec?.toString() ?? "—"],
    ["Concealment", `${s?.concealedSamples ?? "—"} in ${s?.concealmentEvents ?? "—"} events`],
    ["Jitter buffer", num(s?.jitterBufferMs, 1, " ms")],
    ["Playout delay", num(s?.playoutDelayMs, 1, " ms")],
    ["Codec", `${s?.codec ?? "—"} ${s?.sampleRate ?? "—"} Hz ch=${s?.channels ?? "—"}`],
    ["Audio level", `${num(s?.audioLevel, 3)} energy ${num(s?.totalEnergy, 3)}`],
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatVoiceDiagnostics());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text is still visible on screen */
    }
  };

  return (
    <section aria-label="Voice debug" className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-foreground">Voice debug</h2>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11 rounded-full"
          onClick={() => void copy()}
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1 font-mono text-xs sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-border/50 py-1">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <div
        ref={logRef}
        className="mt-3 max-h-64 overflow-y-auto rounded-xl bg-muted p-3 font-mono text-[11px] leading-relaxed text-foreground"
      >
        {snap.log.length === 0 ? (
          <p className="text-muted-foreground">No events yet — start a call.</p>
        ) : (
          snap.log.map((e, i) => (
            <p key={`${e.t}-${i}`} className="whitespace-pre-wrap break-words">
              <span className="text-muted-foreground">{e.t.toFixed(1)}s </span>
              <span className="font-semibold">{e.kind}</span>
              {e.detail ? ` ${e.detail}` : ""}
            </p>
          ))
        )}
      </div>
    </section>
  );
}

export default VoiceDebugPanel;
