import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, Loader2, AudioLines } from "lucide-react";

import { dashboardQueryOptions } from "@/lib/dashboard-query";
import { pickTranslation, useLocale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";
import agentMark from "@/assets/okr-agent-mark.png";
import { HeaderControls } from "@/components/okr/HeaderControls";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Talk with Aspira — Spoken OKR walkthrough" },
      {
        name: "description",
        content:
          "Have Aspira talk you through the 2026–2027 objectives and key results of The Switzerland Chapter of ICF, and ask her questions out loud.",
      },
      { property: "og:title", content: "Talk with Aspira — Spoken OKR walkthrough" },
      {
        property: "og:description",
        content: "A live, spoken walkthrough of the chapter's objectives and key results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: VoicePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

function VoicePage() {
  const { t } = useLocale();
  return (
    <Suspense
      fallback={<div className="p-8 text-sm text-muted-foreground">{t("common.loading")}</div>}
    >
      <ConversationProvider>
        <VoiceContent />
      </ConversationProvider>
    </Suspense>
  );
}

type Line = { id: string; role: "user" | "aspira"; text: string };

function VoiceContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { locale, t } = useLocale();
  const { session } = useAuth();

  const [muted, setMuted] = useState(false);
  // Voice-only variant of German; picked up when the next call starts.
  const [swissGerman, setSwissGerman] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    micMuted: muted,
    onMessage: ({ message, source }) => {
      if (!message) return;
      setLines((prev) => [
        ...prev.slice(-40),
        { id: `${Date.now()}-${prev.length}`, role: source === "user" ? "user" : "aspira", text: message },
      ]);
    },
    onError: (message) => setError(message || t("voice.error")),
    onDisconnect: () => setHighlighted(null),
    clientTools: {
      /** Aspira calls this before she starts on an objective, so the page follows along. */
      highlight_objective: ({ number }: { number?: number | string }) => {
        const n = Number(number);
        if (Number.isFinite(n)) setHighlighted(n);
        return "shown";
      },
      end_walkthrough: () => {
        setHighlighted(null);
        return "done";
      },
    },
  });

  const status = conversation.status;
  const connected = status === "connected";

  // Keep the running transcript pinned to the newest line.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  // Never leave a live microphone behind when the page unmounts.
  const endSession = conversation.endSession;
  useEffect(() => () => endSession(), [endSession]);

  const start = useCallback(async () => {
    setError(null);
    setStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStarting(false);
      setError(t("voice.permissionDenied"));
      return;
    }

    try {
      const res = await fetch("/api/voice-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          authed: Boolean(session),
          swissGerman: locale === "de" && swissGerman,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const s = (await res.json()) as {
        token: string;
        prompt: string;
        firstMessage: string;
        voiceId: string;
        language: "en" | "de" | "fr" | "it";
      };

      setLines([]);
      conversation.startSession({
        conversationToken: s.token,
        connectionType: "webrtc",
        overrides: {
          agent: {
            prompt: { prompt: s.prompt },
            firstMessage: s.firstMessage,
            language: s.language,
          },
          // The narrator is pinned on the agent (default voice for English,
          // language presets for de/fr/it, a twin agent for Swiss German).
          // A per-session tts override loses against a language preset.
        },
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : t("voice.error"));
    } finally {
      setStarting(false);
    }
  }, [conversation, locale, session, swissGerman, t]);

  const stateLabel = starting
    ? t("voice.connecting")
    : connected
      ? conversation.isSpeaking
        ? t("voice.speaking")
        : t("voice.listening")
      : t("voice.ready");

  return (
    <main className="min-h-dvh bg-background">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <img
            src={icfLogo.url}
            alt="ICF Switzerland Charter Chapter"
            className="-ml-2 h-14 w-auto"
            width={62}
            height={56}
            decoding="async"
          />
          <HeaderControls />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <p className="eyebrow">{t("voice.eyebrow")}</p>
        <h1 className="display-lg mt-2">{t("voice.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("voice.subtitle")}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
          {/* Call panel */}
          <section
            aria-label={t("voice.title")}
            className="rounded-3xl border border-border bg-[#F8F0E4] p-6 text-center"
          >
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 rounded-full bg-[#EFCB30]/40",
                  connected && "motion-safe:animate-[agent-halo_3.2s_ease-in-out_infinite]",
                )}
              />
              <img
                src={agentMark}
                alt=""
                width={512}
                height={512}
                className={cn(
                  "relative size-24",
                  connected && conversation.isSpeaking
                    ? "motion-safe:animate-[agent-bob_1.6s_ease-in-out_infinite]"
                    : "motion-safe:animate-[agent-wiggle_6s_ease-in-out_infinite]",
                )}
              />
            </div>

            <p
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-foreground"
              aria-live="polite"
            >
              {connected && <AudioLines className="size-4 text-primary" aria-hidden />}
              {stateLabel}
            </p>

            <div className="mt-5 flex flex-col items-center gap-2">
              {connected ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-11 w-full rounded-full"
                    onClick={() => setMuted((m) => !m)}
                    aria-pressed={muted}
                  >
                    {muted ? (
                      <MicOff className="size-4" aria-hidden />
                    ) : (
                      <Mic className="size-4" aria-hidden />
                    )}
                    {muted ? t("voice.unmute") : t("voice.mute")}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-11 w-full rounded-full"
                    onClick={() => conversation.endSession()}
                  >
                    <PhoneOff className="size-4" aria-hidden />
                    {t("voice.stop")}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="min-h-11 w-full rounded-full"
                  onClick={() => void start()}
                  disabled={starting}
                >
                  {starting ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Mic className="size-4" aria-hidden />
                  )}
                  {starting ? t("voice.connecting") : t("voice.start")}
                </Button>
              )}
            </div>

            {locale === "de" && (
              <div className="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-2 text-left">
                <Label htmlFor="swiss-german" className="text-sm font-medium text-foreground">
                  {t("voice.swiss")}
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {t("voice.swissHint")}
                  </span>
                </Label>
                <Switch
                  id="swiss-german"
                  checked={swissGerman}
                  onCheckedChange={setSwissGerman}
                />
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {t("voice.langNote")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t("voice.disclaimer")}
            </p>
          </section>

          {/* Objectives + transcript */}
          <div className="space-y-6">
            <section aria-label={t("voice.objectivesTitle")}>
              <h2 className="font-display text-base font-semibold text-foreground">
                {t("voice.objectivesTitle")}
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {data.okr_sets.map((s) => {
                  const on = highlighted === s.number;
                  return (
                    <li
                      key={s.id}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-3 transition-colors",
                        on
                          ? "border-[#5778FA] bg-[#5778FA]/10"
                          : "border-border bg-card",
                      )}
                      aria-current={on ? "true" : undefined}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          on ? "bg-primary text-primary-foreground" : "bg-[#EFCB30] text-[#212251]",
                        )}
                      >
                        {s.number}
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {pickTranslation(s, "title", s.title, locale)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-label={t("voice.transcript")}>
              <h2 className="font-display text-base font-semibold text-foreground">
                {t("voice.transcript")}
              </h2>
              <div
                ref={logRef}
                role="log"
                aria-live="polite"
                className="mt-3 max-h-[22rem] space-y-3 overflow-y-auto rounded-2xl border border-border bg-card p-4"
              >
                {lines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("voice.transcriptEmpty")}</p>
                ) : (
                  lines.map((l) => (
                    <p key={l.id} className="text-sm leading-relaxed">
                      <span
                        className={cn(
                          "mr-2 text-xs font-semibold uppercase tracking-wide",
                          l.role === "user" ? "text-muted-foreground" : "text-primary",
                        )}
                      >
                        {l.role === "user" ? t("voice.you") : t("voice.aspira")}
                      </span>
                      <span className="text-foreground">{l.text}</span>
                    </p>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VoicePage;
