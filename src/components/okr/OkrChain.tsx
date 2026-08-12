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
import { DraftHandoff } from "@/components/okr/DraftHandoff";
import type { StringKey } from "@/lib/i18n-strings";

/** One chosen practice draft. Local to the session — never persisted. */
type Picked = { cardId: string; statement: string };

type PendingChange =
  | { kind: "objective"; next: Picked }
  | { kind: "krRemove"; cardId: string };

/** Practice-chain shape limits, mirroring how a readable OKR set is scoped. */
const MAX_KRS = 3;
const MAX_INITIATIVES_PER_KR = 3;

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
  const [krs, setKrs] = useState<Picked[]>([]);
  /** Initiatives per Key Result card id, capped at MAX_INITIATIVES_PER_KR. */
  const [initiativesByKr, setInitiativesByKr] = useState<Record<string, Picked[]>>({});
  const [activeKrId, setActiveKrId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  // Bumped on "Start a new chain" so the wizards remount clean.
  const [chainKey, setChainKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const totalInitiatives = Object.values(initiativesByKr).reduce((n, list) => n + list.length, 0);
  const hasKrs = krs.length > 0;

  const available = [true, Boolean(objective), hasKrs, hasKrs && totalInitiatives > 0];
  const completed = [
    Boolean(objective),
    hasKrs,
    totalInitiatives > 0,
    hasKrs && totalInitiatives > 0,
  ];

  const applyObjective = (next: Picked) => {
    setObjective(next);
    setKrs([]);
    setInitiativesByKr({});
    setActiveKrId(null);
  };

  const selectObjective = (cardId: string, statement: string) => {
    const next = { cardId, statement };
    if (objective?.cardId === cardId) return;
    if (objective && (hasKrs || totalInitiatives > 0)) {
      setPending({ kind: "objective", next });
      return;
    }
    applyObjective(next);
  };

  const removeKr = (cardId: string) => {
    setKrs((prev) => prev.filter((k) => k.cardId !== cardId));
    setInitiativesByKr((prev) => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    setActiveKrId((prev) => (prev === cardId ? null : prev));
  };

  /** Toggles a Key Result in or out of the chain, up to MAX_KRS. */
  const toggleKr = (cardId: string, statement: string) => {
    const isPicked = krs.some((k) => k.cardId === cardId);
    if (isPicked) {
      if ((initiativesByKr[cardId]?.length ?? 0) > 0) {
        setPending({ kind: "krRemove", cardId });
        return;
      }
      removeKr(cardId);
      return;
    }
    if (krs.length >= MAX_KRS) return;
    setKrs((prev) => [...prev, { cardId, statement }]);
  };

  /** Toggles an Initiative under one Key Result, up to MAX_INITIATIVES_PER_KR. */
  const toggleInitiative = (krId: string, cardId: string, statement: string) => {
    setInitiativesByKr((prev) => {
      const list = prev[krId] ?? [];
      if (list.some((i) => i.cardId === cardId)) {
        return { ...prev, [krId]: list.filter((i) => i.cardId !== cardId) };
      }
      if (list.length >= MAX_INITIATIVES_PER_KR) return prev;
      return { ...prev, [krId]: [...list, { cardId, statement }] };
    });
  };

  const confirmPending = () => {
    if (!pending) return;
    if (pending.kind === "objective") applyObjective(pending.next);
    else removeKr(pending.cardId);
    setPending(null);
  };

  const performReset = () => {
    setObjective(null);
    setKrs([]);
    setInitiativesByKr({});
    setActiveKrId(null);
    setStep(0);
    setChainKey((k) => k + 1);
    setCopyState("idle");
    setResetOpen(false);
  };

  const chainText = () =>
    [
      `${t("playground.chain.contextObjective")}:`,
      objective?.statement ?? "",
      "",
      ...krs.flatMap((k) => [
        `${t("playground.chain.contextKr")}: ${k.statement}`,
        ...(initiativesByKr[k.cardId] ?? []).map((i) => `  - ${i.statement}`),
        "",
      ]),
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

  const activeKr = krs.find((k) => k.cardId === activeKrId) ?? krs[0] ?? null;
  const activeInitiatives = activeKr ? (initiativesByKr[activeKr.cardId] ?? []) : [];

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
        <Button type="button" variant="outline" className="h-11" onClick={() => setResetOpen(true)}>
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
            showHandoff={false}
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

      {/* Step 2 — Key Results (up to MAX_KRS) */}
      {step === 1 && objective && (
        <div className="mt-6">
          <ContextCard
            label={t("playground.chain.contextObjective")}
            value={objective.statement}
            onChange={(statement) => setObjective({ ...objective, statement })}
          />
          <p className="mt-3 text-sm text-muted-foreground">{t("playground.chain.note.objToKr")}</p>
          <p className="mt-1 text-sm font-medium text-foreground/90">
            {t("playground.chain.limit.kr")} · {krs.length}/{MAX_KRS}
          </p>
          {krs.length >= MAX_KRS && (
            <p aria-live="polite" className="mt-1 text-sm text-primary">
              {t("playground.chain.limit.krReached")}
            </p>
          )}
          <div className="mt-4">
            <PracticeWizard
              key={`kr-${chainKey}-${objective.cardId}`}
              mode="kr"
              title={t("playground.chain.wizard.kr")}
              lockedFirstAnswer={objective.statement}
              showHandoff={false}
              selection={{
                isSelected: (cardId) => krs.some((k) => k.cardId === cardId),
                onSelect: toggleKr,
                onStatementChange: (cardId, statement) =>
                  setKrs((prev) =>
                    prev.map((k) => (k.cardId === cardId ? { cardId, statement } : k)),
                  ),
                selectLabel: t("playground.chain.use"),
                selectedLabel: t("playground.chain.selectedKr"),
              }}
            />
          </div>
          {hasKrs && (
            <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-4">
              <p className="text-sm text-foreground/90">{t("playground.chain.note.krToInit")}</p>
              <Button type="button" className="mt-3 h-11" onClick={() => goTo(2)}>
                {t("playground.chain.continueInit")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Initiatives, per Key Result */}
      {step === 2 && objective && activeKr && (
        <div className="mt-6">
          <Hierarchy objective={objective.statement} kr={activeKr.statement} />

          {krs.length > 1 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("playground.chain.initFor")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {krs.map((k, index) => {
                  const isActive = k.cardId === activeKr.cardId;
                  return (
                    <button
                      key={k.cardId}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveKrId(k.cardId)}
                      className={cn(
                        "min-h-11 max-w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/70 bg-background text-foreground hover:border-primary/40",
                      )}
                    >
                      <span className="block truncate">
                        {t("playground.chain.contextKr")} {index + 1} ·{" "}
                        {(initiativesByKr[k.cardId] ?? []).length}/{MAX_INITIATIVES_PER_KR}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-3 text-sm text-muted-foreground">
            {t("playground.chain.note.krToInit")}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground/90">
            {t("playground.chain.limit.init")} · {activeInitiatives.length}/
            {MAX_INITIATIVES_PER_KR}
          </p>
          {activeInitiatives.length >= MAX_INITIATIVES_PER_KR && (
            <p aria-live="polite" className="mt-1 text-sm text-primary">
              {t("playground.chain.limit.initReached")}
            </p>
          )}

          <div className="mt-4">
            <PracticeWizard
              key={`initiative-${chainKey}-${activeKr.cardId}`}
              mode="initiative"
              title={t("playground.chain.wizard.initiative")}
              lockedFirstAnswer={activeKr.statement}
              showHandoff={false}
              selection={{
                isSelected: (cardId) => activeInitiatives.some((i) => i.cardId === cardId),
                onSelect: (cardId, statement) =>
                  toggleInitiative(activeKr.cardId, cardId, statement),
                onStatementChange: (cardId, statement) =>
                  setInitiativesByKr((prev) => ({
                    ...prev,
                    [activeKr.cardId]: (prev[activeKr.cardId] ?? []).map((i) =>
                      i.cardId === cardId ? { cardId, statement } : i,
                    ),
                  })),
                selectLabel: t("playground.chain.use"),
                selectedLabel: t("playground.chain.includedInitiative"),
              }}
            />
          </div>
          {totalInitiatives > 0 && (
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
      {step === 3 && objective && hasKrs && totalInitiatives > 0 && (
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
            {krs.map((k) => (
              <div key={k.cardId} className="border-l-2 border-primary/40 pl-4">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("playground.chain.contextKr")}
                </dt>
                <dd className="text-sm text-foreground/90">{k.statement}</dd>
                {(initiativesByKr[k.cardId] ?? []).length > 0 && (
                  <div className="ml-2 mt-2 border-l-2 border-accent/60 pl-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("playground.chain.summary.initiatives")}
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-foreground/90">
                      {(initiativesByKr[k.cardId] ?? []).map((i) => (
                        <li key={i.cardId}>{i.statement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
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
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setResetOpen(true)}
            >
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

          {/* The sign-in handoff belongs at the end of the chain only, where the
              full Objective → Key Results → Initiatives scope is explicit. */}
          <div className="mt-5 rounded-xl border border-border/70 bg-muted/30 p-4">
            <p className="text-sm font-semibold text-foreground">
              {t("playground.chain.handoff.title")}
            </p>
            <p className="mt-1 text-sm text-foreground/90">{t("playground.chain.handoff.body")}</p>
            <DraftHandoff mode="objective" statement={chainText()} />
          </div>
        </div>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("playground.chain.confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === "krRemove"
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

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("playground.chain.confirm.new.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("playground.chain.confirm.new.body")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("playground.chain.confirm.new.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={performReset}>
              {t("playground.chain.confirm.new.continue")}
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
