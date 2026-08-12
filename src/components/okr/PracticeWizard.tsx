import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PracticeDraftCard } from "@/components/okr/PracticeDraftCard";
import { PlaygroundGuidance } from "@/components/okr/PlaygroundGuidance";
import {
  buildDrafts,
  QUESTION_KEYS,
  type DraftCard,
  type PlaygroundMode,
} from "@/lib/playground-drafts";

/** Optional card-selection behaviour, used by the connected OKR chain journey. */
export type WizardSelection = {
  isSelected: (cardId: string) => boolean;
  onSelect: (cardId: string, statement: string) => void;
  selectLabel: string;
  selectedLabel: string;
  /** Called when a selected card's statement is edited or cycled. */
  onStatementChange?: (cardId: string, statement: string) => void;
};

/**
 * The three-question practice wizard. Everything is component state only:
 * no storage, no network, no writes.
 *
 * When `lockedFirstAnswer` is provided the first question is supplied by the
 * caller (the connected chain) and only the remaining two are asked.
 */
export function PracticeWizard({
  mode,
  title,
  lockedFirstAnswer,
  selection,
  showGuidance = true,
}: {
  mode: PlaygroundMode;
  title: string;
  lockedFirstAnswer?: string;
  selection?: WizardSelection;
  showGuidance?: boolean;
}) {
  const { t } = useLocale();

  const questionIndices = lockedFirstAnswer === undefined ? [0, 1, 2] : [1, 2];
  const totalSteps = questionIndices.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [results, setResults] = useState<DraftCard[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const effective =
    lockedFirstAnswer === undefined
      ? answers
      : [lockedFirstAnswer, answers[1] ?? "", answers[2] ?? ""];

  // Believable latency for the mock generator; a real AI call replaces this later.
  useEffect(() => {
    if (status !== "loading") return;
    const id = window.setTimeout(() => {
      setResults(buildDrafts(mode, effective, t));
      setStatus("done");
    }, 1200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, mode]);

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (status === "idle") stepHeadingRef.current?.focus();
  }, [step, status]);

  const restart = () => {
    setStep(0);
    setAnswers(["", "", ""]);
    setResults([]);
    setStatus("idle");
    setResetKey((k) => k + 1);
  };

  const questionIndex = questionIndices[step] ?? 0;
  const answer = answers[questionIndex] ?? "";
  const canAdvance = answer.trim().length > 0;
  const isLastStep = step === totalSteps - 1;
  const busy = status === "loading";

  const questionId = `pw-${mode}-question`;

  return (
    <div
      role="group"
      aria-label={title}
      className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("playground.draftLabel")}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
        </div>
        <Button type="button" variant="outline" className="h-11" onClick={restart}>
          {t("playground.wizard.restart")}
        </Button>
      </div>

      {/* Progress */}
      <p aria-live="polite" className="text-xs font-medium tracking-wide text-muted-foreground">
        {t("playground.wizard.step")} {Math.min(step + 1, totalSteps)} {t("playground.wizard.of")}{" "}
        {totalSteps}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, i) => (
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
            id={questionId}
            className="text-base font-semibold text-foreground focus:outline-none"
          >
            {t(QUESTION_KEYS[mode][questionIndex]!)}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">{t("playground.wizard.hint")}</p>
          <textarea
            rows={4}
            value={answer}
            aria-labelledby={questionId}
            placeholder={t("playground.wizard.placeholder")}
            onChange={(e) =>
              setAnswers((prev) => prev.map((v, i) => (i === questionIndex ? e.target.value : v)))
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
                onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              >
                {t("playground.wizard.continue")}
              </Button>
            )}
          </div>
        </div>
      )}

      {busy && (
        <div aria-live="polite" className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
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
          <div className={cn("mt-4 grid gap-4", showGuidance && "lg:grid-cols-3")}>
            <div
              className={cn("grid gap-4 sm:grid-cols-2", showGuidance && "lg:col-span-2")}
            >
              {results.map((card) => (
                <PracticeDraftCard
                  key={`${resetKey}-${card.id}`}
                  card={card}
                  mode={mode}
                  answers={effective}
                  selected={selection?.isSelected(card.id)}
                  selectLabel={selection?.selectLabel}
                  selectedLabel={selection?.selectedLabel}
                  {...(selection
                    ? {
                        onSelect: (statement: string) => selection.onSelect(card.id, statement),
                        onStatementChange: (statement: string) =>
                          selection.onStatementChange?.(card.id, statement),
                      }
                    : {})}
                />
              ))}
            </div>
            {showGuidance && <PlaygroundGuidance />}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("playground.result.note")}</p>
          <Button type="button" variant="outline" className="mt-4 h-11" onClick={restart}>
            {t("playground.wizard.restart")}
          </Button>
        </div>
      )}

      <p className="mt-5 text-xs text-muted-foreground">{t("playground.notSaved")}</p>
    </div>
  );
}

/** Optional slot wrapper used by callers that render context above the wizard. */
export function WizardContext({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
