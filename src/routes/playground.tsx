import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/lib/i18n";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";
import {
  buildDrafts,
  QUESTION_KEYS,
  type DraftCard,
  type PlaygroundMode,
} from "@/lib/playground-drafts";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "OKR Playground — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "A public practice area for drafting objectives, key results and initiatives. Nothing is saved and no live data is affected.",
      },
      { property: "og:title", content: "OKR Playground — The Switzerland Chapter of ICF" },
      {
        property: "og:description",
        content:
          "Practise drafting objectives, key results and initiatives in a safe sandbox. Nothing is saved.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaygroundPage,
});

const MODES: {
  id: PlaygroundMode;
  titleKey:
    | "playground.mode.objective.title"
    | "playground.mode.kr.title"
    | "playground.mode.initiative.title";
  descKey:
    | "playground.mode.objective.desc"
    | "playground.mode.kr.desc"
    | "playground.mode.initiative.desc";
}[] = [
  {
    id: "objective",
    titleKey: "playground.mode.objective.title",
    descKey: "playground.mode.objective.desc",
  },
  { id: "kr", titleKey: "playground.mode.kr.title", descKey: "playground.mode.kr.desc" },
  {
    id: "initiative",
    titleKey: "playground.mode.initiative.title",
    descKey: "playground.mode.initiative.desc",
  },
];

const TOTAL_STEPS = 3;
const EMPTY_ANSWERS = ["", "", ""];

function PlaygroundPage() {
  const { t } = useLocale();

  // Everything below is component state only: no storage, no network, no writes.
  const [mode, setMode] = useState<PlaygroundMode | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(EMPTY_ANSWERS);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [results, setResults] = useState<DraftCard[]>([]);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Believable latency for the mock generator; a real AI call replaces this later.
  useEffect(() => {
    if (status !== "loading" || !mode) return;
    const id = window.setTimeout(() => {
      setResults(buildDrafts(mode, answers, t));
      setStatus("done");
    }, 1200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, mode]);

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (mode && status === "idle") stepHeadingRef.current?.focus();
  }, [step, mode, status]);

  const reset = (next: PlaygroundMode | null) => {
    setMode(next);
    setStep(0);
    setAnswers(EMPTY_ANSWERS);
    setResults([]);
    setStatus("idle");
  };

  const answer = answers[step] ?? "";
  const canAdvance = answer.trim().length > 0;
  const isLastStep = step === TOTAL_STEPS - 1;
  const busy = status === "loading";
  const activeMode = MODES.find((m) => m.id === mode);

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-7xl px-8 pt-6 pb-14">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-20 w-auto -ml-3 -mt-2"
              width={88}
              height={80}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="flex flex-wrap items-center gap-3">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow !text-accent">{t("hero.eyebrow")}</p>
            <h1 className="display-xl mt-3">{t("playground.title")}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-foreground/75">
              {t("playground.intro")}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 pt-8 pb-16">
        <div
          role="status"
          className="rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-medium text-primary shadow-soft"
        >
          {t("playground.badge")}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-colors",
                  active ? "border-primary/50" : "border-border/70",
                )}
              >
                <h2 className="text-lg font-semibold text-foreground">{t(m.titleKey)}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(m.descKey)}
                </p>
                <Button
                  type="button"
                  variant={active ? "default" : "outline"}
                  className="mt-4 h-11 self-start"
                  aria-pressed={active}
                  onClick={() => reset(m.id)}
                >
                  {t("playground.start")}
                </Button>
              </div>
            );
          })}
        </div>

        {mode && activeMode && (
          <div
            role="group"
            aria-label={t(activeMode.titleKey)}
            className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("playground.draftLabel")}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {t(activeMode.titleKey)}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => reset(mode)}
              >
                {t("playground.wizard.restart")}
              </Button>
            </div>

            {/* Progress */}
            <p aria-live="polite" className="text-xs font-medium tracking-wide text-muted-foreground">
              {t("playground.wizard.step")} {Math.min(step + 1, TOTAL_STEPS)}{" "}
              {t("playground.wizard.of")} {TOTAL_STEPS}
            </p>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= step || status !== "idle" ? "bg-primary" : "bg-border",
                  )}
                />
              ))}
            </div>

            {status === "idle" && (
              <div className="mt-5">
                <h4
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  id="playground-question"
                  className="text-base font-semibold text-foreground focus:outline-none"
                >
                  {t(QUESTION_KEYS[mode][step]!)}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("playground.wizard.hint")}
                </p>
                <textarea
                  rows={4}
                  value={answer}
                  aria-labelledby="playground-question"
                  placeholder={t("playground.wizard.placeholder")}
                  onChange={(e) =>
                    setAnswers((prev) => prev.map((v, i) => (i === step ? e.target.value : v)))
                  }
                  className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                    >
                      {t("playground.wizard.back")}
                    </Button>
                  )}
                  {isLastStep ? (
                    <Button
                      type="button"
                      className="h-11"
                      disabled={!canAdvance}
                      onClick={() => setStatus("loading")}
                    >
                      {t("playground.wizard.generate")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="h-11"
                      disabled={!canAdvance}
                      onClick={() => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))}
                    >
                      {t("playground.wizard.continue")}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {busy && (
              <div
                aria-live="polite"
                className="mt-6 flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary motion-reduce:animate-none"
                />
                {t("playground.wizard.generating")}
              </div>
            )}

            {status === "done" && (
              <div aria-live="polite" className="mt-6">
                <h4 className="text-base font-semibold text-foreground">
                  {t("playground.result.heading")}
                </h4>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                    {results.map((card) => (
                      <PracticeDraftCard key={`${resetKey}-${card.id}`} card={card} />
                    ))}
                  </div>
                  <PlaygroundGuidance />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("playground.result.note")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 h-11"
                  onClick={() => reset(mode)}
                >
                  {t("playground.wizard.restart")}
                </Button>
              </div>
            )}


            <p className="mt-5 text-xs text-muted-foreground">{t("playground.notSaved")}</p>
          </div>
        )}
      </section>
    </main>
  );
}
