import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PracticeWizard } from "@/components/okr/PracticeWizard";
import type { StringKey } from "@/lib/i18n-strings";

/** One chosen practice draft. Local to the session — never persisted. */
type Picked = { cardId: string; statement: string };

type PendingChange = { kind: "objective" | "kr"; next: Picked };

const STEP_KEYS: StringKey[] = [
  "playground.chain.step.objective",
  "playground.chain.step.kr",
  "playground.chain.step.initiatives",
  "playground.chain.step.review",
];

/**
 * The connected Objective → Key Results → Initiatives journey.
 * All state is component state: nothing is stored, fetched or written.
 */
export function OkrChain() {
  const { t } = useLocale();

  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState<Picked | null>(null);
  const [kr, setKr] = useState<Picked | null>(null);
  const [initiatives, setInitiatives] = useState<Picked[]>([]);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  // Bumped on "Start a new chain" so the wizards remount clean.
  const [chainKey, setChainKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const available = [true, Boolean(objective), Boolean(kr), Boolean(kr) && initiatives.length > 0];
  const completed = [
    Boolean(objective),
    Boolean(kr),
    initiatives.length > 0,
    Boolean(kr) && initiatives.length > 0,
  ];

  const applyObjective = (next: Picked) => {
    setObjective(next);
    setKr(null);
    setInitiatives([]);
  };

  const selectObjective = (cardId: string, statement: string) => {
    const next = { cardId, statement };
    if (objective?.cardId === cardId) return;
    if (objective && (kr || initiatives.length > 0)) {
      setPending({ kind: "objective", next });
      return;
    }
    applyObjective(next);
  };

  const selectKr = (cardId: string, statement: string) => {
    const next = { cardId, statement };
    if (kr?.cardId === cardId) return;
    if (kr && initiatives.length > 0) {
      setPending({ kind: "kr", next });
      return;
    }
    setKr(next);
    setInitiatives([]);
  };

  const toggleInitiative = (cardId: string, statement: string) => {
    setInitiatives((prev) =>
      prev.some((i) => i.cardId === cardId)
        ? prev.filter((i) => i.cardId !== cardId)
        : [...prev, { cardId, statement }],
    );
  };

  const confirmPending = () => {
    if (!pending) return;
    if (pending.kind === "objective") applyObjective(pending.next);
    else {
      setKr(pending.next);
      setInitiatives([]);
    }
    setPending(null);
  };

  const startNewChain = () => {
    setObjective(null);
    setKr(null);
    setInitiatives([]);
    setStep(0);
    setChainKey((k) => k + 1);
    setCopyState("idle");
  };

  const chainText = () =>
    [
      `${t("playground.chain.contextObjective")}:`,
      objective?.statement ?? "",
      "",
      `${t("playground.chain.contextKr")}:`,
      kr?.statement ?? "",
      "",
      `${t("playground.chain.summary.initiatives")}:`,
      ...initiatives.map((i) => `- ${i.statement}`),
    ].join("\n");

  const copyChain = async () => {
    try {
      await navigator.clipboard.writeText(chainText());
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2000);
  };

  const goTo = (index: number) => {
    if (!available[index]) return;
    setStep(index);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  return (
    <section
      aria-labelledby="okr-chain-heading"
      className="rounded-2xl border border-primary/30 bg-card p-6 shadow-soft"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("playground.chain.summary.badge")}
          </p>
          <h2
            id="okr-chain-heading"
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 text-lg font-semibold text-foreground focus:outline-none"
          >
            {t("playground.chain.cta.title")}
          </h2>
        </div>
        <Button type="button" variant="outline" className="h-11" onClick={startNewChain}>
          {t("playground.chain.new")}
        </Button>
      </div>

      {/* Journey indicator */}
      <ol className="mt-5 grid gap-2 sm:grid-cols-4">
        {STEP_KEYS.map((key, index) => {
          const isCurrent = step === index;
          const isOpen = available[index];
          return (
            <li key={key}>
              <button
                type="button"
                disabled={!isOpen}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => goTo(index)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                  isCurrent
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : isOpen
                      ? "border-border/70 bg-background text-foreground hover:border-primary/40"
                      : "cursor-not-allowed border-border/50 bg-muted/40 text-muted-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    completed[index]
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 truncate">{t(key)}</span>
                <span className="sr-only">
                  {isCurrent
                    ? t("playground.chain.step.current")
                    : !isOpen
                      ? t("playground.chain.step.locked")
                      : completed[index]
                        ? t("playground.chain.step.done")
                        : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Step 1 — Objective */}
      {step === 0 && (
        <div className="mt-6">
          <PracticeWizard
            key={`objective-${chainKey}`}
            mode="objective"
            title={t("playground.chain.wizard.objective")}
            selection={{
              isSelected: (cardId) => objective?.cardId === cardId,
              onSelect: selectObjective,
              onStatementChange: (cardId, statement) => {
                if (objective?.cardId === cardId && objective.statement !== statement) {
                  setObjective({ cardId, statement });
                }
              },
              selectLabel: t("playground.chain.use"),
              selectedLabel: t("playground.chain.selectedObjective"),
            }}
          />
          {objective && (
            <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-4">
              <p className="text-sm text-foreground/90">{t("playground.chain.note.objToKr")}</p>
              <Button type="button" className="mt-3 h-11" onClick={() => goTo(1)}>
                {t("playground.chain.continueKr")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Key Results */}
      {step === 1 && objective && (
        <div className="mt-6">
          <ContextCard
            label={t("playground.chain.contextObjective")}
            value={objective.statement}
            onChange={(statement) => setObjective({ ...objective, statement })}
          />
          <p className="mt-3 text-sm text-muted-foreground">{t("playground.chain.note.objToKr")}</p>
          <div className="mt-4">
            <PracticeWizard
              key={`kr-${chainKey}-${objective.cardId}`}
              mode="kr"
              title={t("playground.chain.wizard.kr")}
              lockedFirstAnswer={objective.statement}
              selection={{
                isSelected: (cardId) => kr?.cardId === cardId,
                onSelect: selectKr,
                onStatementChange: (cardId, statement) => {
                  if (kr?.cardId === cardId && kr.statement !== statement) {
                    setKr({ cardId, statement });
                  }
                },
                selectLabel: t("playground.chain.use"),
                selectedLabel: t("playground.chain.selectedKr"),
              }}
            />
          </div>
          {kr && (
            <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-4">
              <p className="text-sm text-foreground/90">{t("playground.chain.note.krToInit")}</p>
              <Button type="button" className="mt-3 h-11" onClick={() => goTo(2)}>
                {t("playground.chain.continueInit")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Initiatives */}
      {step === 2 && objective && kr && (
        <div className="mt-6">
          <Hierarchy objective={objective.statement} kr={kr.statement} />
          <p className="mt-3 text-sm text-muted-foreground">
            {t("playground.chain.note.krToInit")}
          </p>
          <div className="mt-4">
            <PracticeWizard
              key={`initiative-${chainKey}-${kr.cardId}`}
              mode="initiative"
              title={t("playground.chain.wizard.initiative")}
              lockedFirstAnswer={kr.statement}
              selection={{
                isSelected: (cardId) => initiatives.some((i) => i.cardId === cardId),
                onSelect: toggleInitiative,
                onStatementChange: (cardId, statement) =>
                  setInitiatives((prev) =>
                    prev.map((i) => (i.cardId === cardId ? { cardId, statement } : i)),
                  ),
                selectLabel: t("playground.chain.use"),
                selectedLabel: t("playground.chain.includedInitiative"),
              }}
            />
          </div>
          {initiatives.length > 0 && (
            <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-4">
              <p className="text-sm text-foreground/90">{t("playground.chain.note.review")}</p>
              <Button type="button" className="mt-3 h-11" onClick={() => goTo(3)}>
                {t("playground.chain.continueReview")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 3 && objective && kr && initiatives.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border/70 bg-background p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {t("playground.chain.summary.heading")}
            </h3>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {t("playground.chain.summary.badge")}
            </span>
          </div>

          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("playground.chain.contextObjective")}
              </dt>
              <dd className="text-sm font-medium text-foreground">{objective.statement}</dd>
            </div>
            <div className="border-l-2 border-primary/40 pl-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("playground.chain.contextKr")}
              </dt>
              <dd className="text-sm text-foreground/90">{kr.statement}</dd>
            </div>
            <div className="ml-4 border-l-2 border-accent/60 pl-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("playground.chain.summary.initiatives")}
              </dt>
              <dd>
                <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/90">
                  {initiatives.map((i) => (
                    <li key={i.cardId}>{i.statement}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">{t("playground.chain.note.review")}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-11" onClick={() => goTo(0)}>
              {t("playground.chain.edit.objective")}
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => goTo(1)}>
              {t("playground.chain.edit.kr")}
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => goTo(2)}>
              {t("playground.chain.edit.initiatives")}
            </Button>
            <Button type="button" className="h-11" onClick={copyChain}>
              {t("playground.chain.copy")}
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={startNewChain}>
              {t("playground.chain.new")}
            </Button>
          </div>
          <p aria-live="polite" className="mt-2 text-xs font-medium text-primary">
            {copyState === "copied"
              ? t("playground.chain.copied")
              : copyState === "failed"
                ? t("playground.chain.copyFailed")
                : ""}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{t("playground.notSaved")}</p>
        </div>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("playground.chain.confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === "kr"
                ? t("playground.chain.confirm.kr")
                : t("playground.chain.confirm.objective")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("playground.chain.confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPending}>
              {t("playground.chain.confirm.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

/** Compact, locally editable context card for a selected chain element. */
function ContextCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const { t } = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [buffer, setBuffer] = useState(value);

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</p>
      {isEditing ? (
        <div className="mt-2">
          <textarea
            rows={3}
            value={buffer}
            aria-label={label}
            onChange={(e) => setBuffer(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-11"
              onClick={() => {
                onChange(buffer.trim() || value);
                setIsEditing(false);
              }}
            >
              {t("playground.card.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => {
                setBuffer(value);
                setIsEditing(false);
              }}
            >
              {t("playground.card.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 flex-1 text-sm font-medium text-foreground">{value}</p>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => {
              setBuffer(value);
              setIsEditing(true);
            }}
          >
            {t("playground.card.edit")}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Objective → Key Result context, shown above the Initiative step. */
function Hierarchy({ objective, kr }: { objective: string; kr: string }) {
  const { t } = useLocale();
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
        {t("playground.chain.contextObjective")}
      </p>
      <p className="text-sm font-medium text-foreground">{objective}</p>
      <div className="mt-3 border-l-2 border-primary/40 pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {t("playground.chain.contextKr")}
        </p>
        <p className="text-sm text-foreground/90">{kr}</p>
      </div>
    </div>
  );
}
