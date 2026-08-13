import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Sparkles, Trash2 } from "lucide-react";

import { addInitiative, addMilestone, addSignal } from "@/lib/okr.functions";
import { generateOkrDrafts } from "@/lib/ai-drafts.functions";
import {
  BET_CONFIDENCES,
  EVIDENCE_TYPES,
  INITIATIVE_KINDS,
  INITIATIVE_STATUSES,
  LIMITS,
  PHASE_TYPES,
  SIGNAL_DIRECTIONS,
  WORK_SIZES,
  type BetConfidence,
  type DashboardDTO,
  type EvidenceType,
  type InitiativeKind,
  type InitiativeStatus,
  type PhaseType,
  type SignalDirection,
  type WorkSize,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import {
  CONFIDENCE_KEY,
  DIRECTION_KEY,
  EVIDENCE_KEY,
  KIND_KEY,
  PHASE_TYPE_KEY,
  SIZE_KEY,
} from "@/components/okr/work-meta";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Shape of one assistant initiative suggestion (mirrors the server draft). */
type InitiativeDraft = {
  title: string;
  why: string;
  owner_role: string;
  effort: string;
  timing: string;
};

const STATUS_KEY: Record<InitiativeStatus, StringKey> = {
  planned: "initiatives.status.planned",
  in_progress: "initiatives.status.in_progress",
  done: "initiatives.status.done",
  canceled: "initiatives.status.canceled",
};

const KIND_DESC_KEY: Record<InitiativeKind, StringKey> = {
  candidate: "journey.kindDesc.candidate",
  simple_task: "journey.kindDesc.simple_task",
  initiative: "journey.kindDesc.initiative",
};

type StepId =
  | "kind"
  | "context"
  | "work"
  | "aspiration"
  | "bet"
  | "signals"
  | "milestones"
  | "review";

/** Steps shown per kind — the journey grows with the weight of the work. */
function stepsForKind(kind: InitiativeKind): StepId[] {
  if (kind === "candidate") return ["kind", "context", "work", "review"];
  if (kind === "simple_task") return ["kind", "context", "work", "review"];
  return ["kind", "context", "work", "aspiration", "bet", "signals", "milestones", "review"];
}

const STEP_TITLE: Record<StepId, StringKey> = {
  kind: "journey.step.kind",
  context: "journey.step.context",
  work: "journey.step.work",
  aspiration: "journey.step.aspiration",
  bet: "journey.step.bet",
  signals: "journey.step.signals",
  milestones: "journey.step.milestones",
  review: "journey.step.review",
};

const STEP_HELP: Record<StepId, StringKey> = {
  kind: "journey.step.kindHelp",
  context: "journey.step.contextHelp",
  work: "journey.step.workHelp",
  aspiration: "journey.step.aspirationHelp",
  bet: "journey.step.betHelp",
  signals: "journey.step.signalsHelp",
  milestones: "journey.step.milestonesHelp",
  review: "journey.step.reviewHelp",
};

type SignalRow = {
  name: string;
  evidence: EvidenceType;
  how_noticed: string;
  starting_point: string;
  direction: SignalDirection | null;
};

type MilestoneRow = { title: string; owner: string; due_date: string };

type JourneyState = {
  kind: InitiativeKind;
  kr_id: string;
  secondary_kr_ids: string[];
  team_id: string;
  text: string;
  description: string;
  owner: string;
  lead_name: string;
  status: InitiativeStatus;
  size: WorkSize | null;
  idea: string;
  why_now: string;
  proposed_owner: string;
  start_date: string;
  end_date: string;
  phase: number;
  phase_type: PhaseType | null;
  learning_checkpoint: string;
  aspiration: string;
  bet_action: string;
  bet_change: string;
  bet_question: string;
  confidence: BetConfidence | null;
  signals: SignalRow[];
  milestones: MilestoneRow[];
};

function emptyState(kind: InitiativeKind, krId: string): JourneyState {
  return {
    kind,
    kr_id: krId,
    secondary_kr_ids: [],
    team_id: "",
    text: "",
    description: "",
    owner: "",
    lead_name: "",
    status: "planned",
    size: null,
    idea: "",
    why_now: "",
    proposed_owner: "",
    start_date: "",
    end_date: "",
    phase: 1,
    phase_type: null,
    learning_checkpoint: "",
    aspiration: "",
    bet_action: "",
    bet_change: "",
    bet_question: "",
    confidence: null,
    signals: [],
    milestones: [],
  };
}

export function WorkJourney({
  open,
  onOpenChange,
  dashboard,
  defaultKrId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dashboard: DashboardDTO;
  defaultKrId?: string;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const addWork = useServerFn(addInitiative);
  const addSignalFn = useServerFn(addSignal);
  const addMilestoneFn = useServerFn(addMilestone);
  const generate = useServerFn(generateOkrDrafts);

  const krOptions = useMemo(
    () =>
      dashboard.okr_sets.flatMap((s) =>
        s.key_results.map((k) => ({
          id: k.id,
          label: `${k.kr || "—"} · ${pickTranslation(k, "text", k.text, locale) || "Untitled KR"}`,
          text: pickTranslation(k, "text", k.text, locale),
          groupLabel: `${s.number}. ${pickTranslation(s, "title", s.title, locale) || "Untitled OKR"}`,
          groupId: s.id,
          objective: pickTranslation(s, "objective", s.objective, locale),
        })),
      ),
    [dashboard, locale],
  );

  const firstKrId = krOptions[0]?.id ?? "";
  const [state, setState] = useState<JourneyState>(() =>
    emptyState("initiative", defaultKrId || firstKrId),
  );
  const [index, setIndex] = useState(0);
  const [confirmClose, setConfirmClose] = useState(false);
  const [suggestions, setSuggestions] = useState<InitiativeDraft[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    if (open) {
      setState(emptyState("initiative", defaultKrId || firstKrId));
      setIndex(0);
      setSuggestions([]);
    }
  }, [open, defaultKrId, firstKrId]);

  const steps = stepsForKind(state.kind);
  const step = steps[Math.min(index, steps.length - 1)] ?? "kind";
  const patch = (p: Partial<JourneyState>) => setState((s) => ({ ...s, ...p }));

  const grouped = useMemo(() => {
    const map = new Map<string, { groupLabel: string; items: typeof krOptions }>();
    for (const opt of krOptions) {
      const g = map.get(opt.groupId);
      if (g) g.items.push(opt);
      else map.set(opt.groupId, { groupLabel: opt.groupLabel, items: [opt] });
    }
    return Array.from(map.values());
  }, [krOptions]);

  const selectedKr = krOptions.find((k) => k.id === state.kr_id);

  const dirty =
    state.text.trim().length > 0 ||
    state.description.trim().length > 0 ||
    state.idea.trim().length > 0 ||
    state.aspiration.trim().length > 0 ||
    state.signals.length > 0 ||
    state.milestones.length > 0;

  const blocker: StringKey | null =
    step === "context" && !state.kr_id
      ? "journey.needKr"
      : step === "work" && state.text.trim().length === 0
        ? "journey.needTitle"
        : null;

  const create = useMutation({
    mutationFn: async () => {
      const { id } = await addWork({
        data: {
          kr_id: state.kr_id,
          text: state.text.trim(),
          owner: state.owner.trim() || undefined,
          description: state.description.trim() || undefined,
          status: state.status,
          kind: state.kind,
          team_id: state.team_id || null,
          idea: state.idea.trim() || undefined,
          why_now: state.why_now.trim() || undefined,
          proposed_owner: state.proposed_owner.trim() || undefined,
          size: state.size,
          start_date: state.start_date || null,
          end_date: state.end_date || null,
          phase: state.phase,
          phase_type: state.phase_type,
          aspiration: state.aspiration.trim() || undefined,
          bet_action: state.bet_action.trim() || undefined,
          bet_change: state.bet_change.trim() || undefined,
          bet_question: state.bet_question.trim() || undefined,
          confidence: state.confidence,
          learning_checkpoint: state.learning_checkpoint || undefined,
          lead_name: state.lead_name.trim() || undefined,
          secondary_kr_ids: state.secondary_kr_ids,
          sourceLang: locale,
        },
      });

      // Child rows are written after the parent exists; a failure here leaves a
      // valid piece of work behind, so it is reported rather than thrown away.
      let childFailed = false;
      for (const sig of state.signals) {
        if (!sig.name.trim()) continue;
        try {
          await addSignalFn({
            data: {
              initiative_id: id,
              patch: {
                name: sig.name.trim(),
                evidence: sig.evidence,
                how_noticed: sig.how_noticed.trim(),
                starting_point: sig.starting_point.trim(),
                direction: sig.direction,
              },
              sourceLang: locale,
            },
          });
        } catch {
          childFailed = true;
        }
      }
      for (const ms of state.milestones) {
        if (!ms.title.trim()) continue;
        try {
          await addMilestoneFn({
            data: {
              initiative_id: id,
              patch: {
                title: ms.title.trim(),
                owner: ms.owner.trim(),
                due_date: ms.due_date || null,
              },
              sourceLang: locale,
            },
          });
        } catch {
          childFailed = true;
        }
      }
      return { id, childFailed };
    },
    onSuccess: ({ id, childFailed }) => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (childFailed) toast.warning(t("journey.childFailed"));
      else toast.success(t("initiatives.created"));
      onOpenChange(false);
      navigate({ to: "/initiatives/$initiativeId", params: { initiativeId: id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  async function askAssistant() {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await generate({
        data: {
          mode: "initiative",
          answers: [state.text, state.description || state.aspiration, state.bet_action],
          locale,
          context: selectedKr ? `${selectedKr.objective} — ${selectedKr.text}` : "",
        },
      });
      if (res.ok) setSuggestions(res.result.drafts as InitiativeDraft[]);
      else toast.error(t("journey.suggestFailed"));
    } catch {
      toast.error(t("journey.suggestFailed"));
    } finally {
      setSuggesting(false);
    }
  }

  function applySuggestion(d: InitiativeDraft) {
    if (step === "aspiration") patch({ aspiration: d.why || d.title });
    else if (step === "bet")
      patch({
        bet_action: state.bet_action || d.title,
        bet_change: state.bet_change || d.why,
        bet_question: state.bet_question || d.timing,
      });
    else if (step === "signals")
      patch({
        signals: [
          ...state.signals,
          {
            name: d.title,
            evidence: "measure",
            how_noticed: d.why,
            starting_point: "",
            direction: "up",
          },
        ],
      });
    setSuggestions([]);
  }

  const requestClose = (next: boolean) => {
    if (!next && dirty && !create.isPending) setConfirmClose(true);
    else onOpenChange(next);
  };

  const isLast = step === "review";
  const canAssist = step === "aspiration" || step === "bet" || step === "signals";

  return (
    <>
      <Sheet open={open} onOpenChange={requestClose}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b px-6 pt-6 pb-4">
            <p className="eyebrow text-primary">
              {t("journey.step")} {index + 1} {t("journey.of")} {steps.length}
            </p>
            <SheetTitle>{t(STEP_TITLE[step])}</SheetTitle>
            <SheetDescription>{t(STEP_HELP[step])}</SheetDescription>
            <ol className="mt-3 flex flex-wrap gap-1.5" aria-label={t("journey.title")}>
              {steps.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => i <= index && setIndex(i)}
                    disabled={i > index}
                    aria-current={i === index ? "step" : undefined}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-colors",
                      i === index
                        ? "bg-primary"
                        : i < index
                          ? "bg-highlight"
                          : "bg-border",
                    )}
                  >
                    <span className="sr-only">{t(STEP_TITLE[s])}</span>
                  </button>
                </li>
              ))}
            </ol>
          </SheetHeader>

          <div className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
            {step === "kind" && (
              <div className="grid gap-3">
                {INITIATIVE_KINDS.map((k) => {
                  const active = state.kind === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => patch({ kind: k })}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-colors",
                        active
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border/70 bg-card hover:border-primary/40",
                      )}
                    >
                      <span className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                        {t(KIND_KEY[k])}
                        {active && <Check className="h-4 w-4 text-primary" aria-hidden />}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {t(KIND_DESC_KEY[k])}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === "context" && (
              <div className="grid gap-4">
                <Field label={t("initiatives.form.kr")} htmlFor="wj-kr">
                  <Select value={state.kr_id} onValueChange={(v) => patch({ kr_id: v })}>
                    <SelectTrigger id="wj-kr" className="w-full min-w-0">
                      <SelectValue
                        placeholder={t("initiatives.form.selectKr")}
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {grouped.map((g) => (
                        <SelectGroup key={g.groupLabel}>
                          <SelectLabel>{g.groupLabel}</SelectLabel>
                          {g.items.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              KR {opt.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="grid gap-1.5">
                  <Label>{t("journey.secondaryKrs")}</Label>
                  <p className="text-xs text-muted-foreground">{t("journey.secondaryKrsHelp")}</p>
                  <div className="max-h-52 overflow-y-auto rounded-xl border border-border/70 bg-card p-2">
                    {krOptions
                      .filter((k) => k.id !== state.kr_id)
                      .map((k) => {
                        const checked = state.secondary_kr_ids.includes(k.id);
                        return (
                          <label
                            key={k.id}
                            className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/60"
                          >
                            <input
                              type="checkbox"
                              className="mt-1 accent-[var(--color-primary)]"
                              checked={checked}
                              onChange={(e) =>
                                patch({
                                  secondary_kr_ids: e.target.checked
                                    ? [...state.secondary_kr_ids, k.id]
                                    : state.secondary_kr_ids.filter((id) => id !== k.id),
                                })
                              }
                            />
                            <span className="min-w-0">KR {k.label}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>

                <Field label={t("work.form.team")} htmlFor="wj-team">
                  <Select
                    value={state.team_id || "none"}
                    onValueChange={(v) => patch({ team_id: v === "none" ? "" : v })}
                  >
                    <SelectTrigger id="wj-team" className="w-full min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("work.form.unassigned")}</SelectItem>
                      {dashboard.teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {pickTranslation(team, "name", team.name, locale) || team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {step === "work" && (
              <div className="grid gap-4">
                <Field label={t("initiatives.form.title")} htmlFor="wj-title">
                  <Textarea
                    id="wj-title"
                    rows={2}
                    value={state.text}
                    maxLength={LIMITS.initiative}
                    onChange={(e) => patch({ text: e.target.value.slice(0, LIMITS.initiative) })}
                    placeholder={t("initiatives.form.titlePlaceholder")}
                    autoFocus
                  />
                </Field>

                {state.kind === "candidate" ? (
                  <>
                    <Field label={t("work.idea")} htmlFor="wj-idea">
                      <Textarea
                        id="wj-idea"
                        rows={4}
                        value={state.idea}
                        maxLength={LIMITS.idea}
                        onChange={(e) => patch({ idea: e.target.value.slice(0, LIMITS.idea) })}
                      />
                    </Field>
                    <Field label={t("work.whyNow")} htmlFor="wj-why">
                      <Textarea
                        id="wj-why"
                        rows={3}
                        value={state.why_now}
                        maxLength={LIMITS.whyNow}
                        onChange={(e) => patch({ why_now: e.target.value.slice(0, LIMITS.whyNow) })}
                      />
                    </Field>
                    <Field label={t("work.proposedOwner")} htmlFor="wj-proposed">
                      <Input
                        id="wj-proposed"
                        value={state.proposed_owner}
                        maxLength={LIMITS.proposedOwner}
                        onChange={(e) => patch({ proposed_owner: e.target.value })}
                      />
                    </Field>
                    <Field label={t("work.size")} htmlFor="wj-size">
                      <Select
                        value={state.size ?? "none"}
                        onValueChange={(v) => patch({ size: v === "none" ? null : (v as WorkSize) })}
                      >
                        <SelectTrigger id="wj-size" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("tag.none")}</SelectItem>
                          {WORK_SIZES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(SIZE_KEY[s])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label={t("initiatives.form.description")} htmlFor="wj-desc">
                      <Textarea
                        id="wj-desc"
                        rows={4}
                        value={state.description}
                        maxLength={LIMITS.initiativeDescription}
                        onChange={(e) =>
                          patch({
                            description: e.target.value.slice(0, LIMITS.initiativeDescription),
                          })
                        }
                        placeholder={t("initiatives.form.descriptionPlaceholder")}
                      />
                    </Field>
                    <Field label={t("initiatives.form.owner")} htmlFor="wj-owner">
                      <Input
                        id="wj-owner"
                        value={state.owner}
                        maxLength={LIMITS.initiativeOwner}
                        onChange={(e) => patch({ owner: e.target.value })}
                        placeholder={t("initiatives.form.ownerPlaceholder")}
                      />
                    </Field>
                    {state.kind === "initiative" && (
                      <Field label={t("work.lead")} htmlFor="wj-lead">
                        <Input
                          id="wj-lead"
                          value={state.lead_name}
                          maxLength={LIMITS.leadName}
                          onChange={(e) => patch({ lead_name: e.target.value })}
                        />
                      </Field>
                    )}
                    <Field label={t("initiatives.form.status")} htmlFor="wj-status">
                      <Select
                        value={state.status}
                        onValueChange={(v) => patch({ status: v as InitiativeStatus })}
                      >
                        <SelectTrigger id="wj-status" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INITIATIVE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(STATUS_KEY[s])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    {state.kind === "simple_task" && (
                      <DateRange state={state} patch={patch} />
                    )}
                  </>
                )}
              </div>
            )}

            {step === "aspiration" && (
              <div className="grid gap-4">
                <Field label={t("work.aspiration")} htmlFor="wj-aspiration">
                  <Textarea
                    id="wj-aspiration"
                    rows={4}
                    value={state.aspiration}
                    maxLength={LIMITS.aspiration}
                    onChange={(e) =>
                      patch({ aspiration: e.target.value.slice(0, LIMITS.aspiration) })
                    }
                  />
                </Field>
                <DateRange state={state} patch={patch} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("work.phaseNumber")} htmlFor="wj-phase">
                    <Input
                      id="wj-phase"
                      type="number"
                      min={1}
                      max={20}
                      value={state.phase}
                      onChange={(e) => patch({ phase: Number(e.target.value) || 1 })}
                    />
                  </Field>
                  <Field label={t("work.phaseType")} htmlFor="wj-phase-type">
                    <Select
                      value={state.phase_type ?? "none"}
                      onValueChange={(v) =>
                        patch({ phase_type: v === "none" ? null : (v as PhaseType) })
                      }
                    >
                      <SelectTrigger id="wj-phase-type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t("tag.none")}</SelectItem>
                        {PHASE_TYPES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {t(PHASE_TYPE_KEY[p])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label={t("work.learningCheckpoint")} htmlFor="wj-checkpoint">
                  <Input
                    id="wj-checkpoint"
                    type="date"
                    value={state.learning_checkpoint}
                    onChange={(e) => patch({ learning_checkpoint: e.target.value })}
                  />
                </Field>
              </div>
            )}

            {step === "bet" && (
              <div className="grid gap-4">
                <Field label={t("work.betAction")} htmlFor="wj-bet-action">
                  <Textarea
                    id="wj-bet-action"
                    rows={2}
                    value={state.bet_action}
                    maxLength={LIMITS.betPart}
                    onChange={(e) => patch({ bet_action: e.target.value.slice(0, LIMITS.betPart) })}
                  />
                </Field>
                <Field label={t("work.betChange")} htmlFor="wj-bet-change">
                  <Textarea
                    id="wj-bet-change"
                    rows={2}
                    value={state.bet_change}
                    maxLength={LIMITS.betPart}
                    onChange={(e) => patch({ bet_change: e.target.value.slice(0, LIMITS.betPart) })}
                  />
                </Field>
                <Field label={t("work.betQuestion")} htmlFor="wj-bet-question">
                  <Textarea
                    id="wj-bet-question"
                    rows={2}
                    value={state.bet_question}
                    maxLength={LIMITS.betPart}
                    onChange={(e) =>
                      patch({ bet_question: e.target.value.slice(0, LIMITS.betPart) })
                    }
                  />
                </Field>
                <Field label={t("work.confidence")} htmlFor="wj-confidence">
                  <Select
                    value={state.confidence ?? "none"}
                    onValueChange={(v) =>
                      patch({ confidence: v === "none" ? null : (v as BetConfidence) })
                    }
                  >
                    <SelectTrigger id="wj-confidence" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("tag.none")}</SelectItem>
                      {BET_CONFIDENCES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(CONFIDENCE_KEY[c])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {step === "signals" && (
              <div className="grid gap-4">
                {state.signals.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("work.noSignals")}</p>
                )}
                {state.signals.map((sig, i) => (
                  <div key={i} className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <Field label={t("work.signal.name")} htmlFor={`wj-sig-${i}`}>
                          <Input
                            id={`wj-sig-${i}`}
                            value={sig.name}
                            maxLength={LIMITS.signalName}
                            onChange={(e) =>
                              patch({
                                signals: state.signals.map((s, j) =>
                                  j === i ? { ...s, name: e.target.value } : s,
                                ),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        aria-label={t("work.deleteEntry")}
                        onClick={() =>
                          patch({ signals: state.signals.filter((_, j) => j !== i) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t("work.signal.evidence")} htmlFor={`wj-sig-ev-${i}`}>
                        <Select
                          value={sig.evidence}
                          onValueChange={(v) =>
                            patch({
                              signals: state.signals.map((s, j) =>
                                j === i ? { ...s, evidence: v as EvidenceType } : s,
                              ),
                            })
                          }
                        >
                          <SelectTrigger id={`wj-sig-ev-${i}`} className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EVIDENCE_TYPES.map((e) => (
                              <SelectItem key={e} value={e}>
                                {t(EVIDENCE_KEY[e])}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label={t("work.signal.direction")} htmlFor={`wj-sig-dir-${i}`}>
                        <Select
                          value={sig.direction ?? "none"}
                          onValueChange={(v) =>
                            patch({
                              signals: state.signals.map((s, j) =>
                                j === i
                                  ? { ...s, direction: v === "none" ? null : (v as SignalDirection) }
                                  : s,
                              ),
                            })
                          }
                        >
                          <SelectTrigger id={`wj-sig-dir-${i}`} className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("tag.none")}</SelectItem>
                            {SIGNAL_DIRECTIONS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {t(DIRECTION_KEY[d])}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field label={t("work.signal.howNoticed")} htmlFor={`wj-sig-how-${i}`}>
                      <Input
                        id={`wj-sig-how-${i}`}
                        value={sig.how_noticed}
                        maxLength={LIMITS.signalNote}
                        onChange={(e) =>
                          patch({
                            signals: state.signals.map((s, j) =>
                              j === i ? { ...s, how_noticed: e.target.value } : s,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label={t("work.signal.startingPoint")} htmlFor={`wj-sig-start-${i}`}>
                      <Input
                        id={`wj-sig-start-${i}`}
                        value={sig.starting_point}
                        maxLength={LIMITS.signalNote}
                        onChange={(e) =>
                          patch({
                            signals: state.signals.map((s, j) =>
                              j === i ? { ...s, starting_point: e.target.value } : s,
                            ),
                          })
                        }
                      />
                    </Field>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    patch({
                      signals: [
                        ...state.signals,
                        {
                          name: "",
                          evidence: "see",
                          how_noticed: "",
                          starting_point: "",
                          direction: null,
                        },
                      ],
                    })
                  }
                >
                  + {t("work.addSignal")}
                </Button>
              </div>
            )}

            {step === "milestones" && (
              <div className="grid gap-4">
                {state.milestones.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("work.noMilestones")}</p>
                )}
                {state.milestones.map((ms, i) => (
                  <div key={i} className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <Field label={t("work.milestone.title")} htmlFor={`wj-ms-${i}`}>
                          <Input
                            id={`wj-ms-${i}`}
                            value={ms.title}
                            maxLength={LIMITS.milestoneTitle}
                            onChange={(e) =>
                              patch({
                                milestones: state.milestones.map((m, j) =>
                                  j === i ? { ...m, title: e.target.value } : m,
                                ),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        aria-label={t("work.deleteEntry")}
                        onClick={() =>
                          patch({ milestones: state.milestones.filter((_, j) => j !== i) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t("work.milestone.owner")} htmlFor={`wj-ms-owner-${i}`}>
                        <Input
                          id={`wj-ms-owner-${i}`}
                          value={ms.owner}
                          maxLength={LIMITS.initiativeOwner}
                          onChange={(e) =>
                            patch({
                              milestones: state.milestones.map((m, j) =>
                                j === i ? { ...m, owner: e.target.value } : m,
                              ),
                            })
                          }
                        />
                      </Field>
                      <Field label={t("work.milestone.due")} htmlFor={`wj-ms-due-${i}`}>
                        <Input
                          id={`wj-ms-due-${i}`}
                          type="date"
                          value={ms.due_date}
                          onChange={(e) =>
                            patch({
                              milestones: state.milestones.map((m, j) =>
                                j === i ? { ...m, due_date: e.target.value } : m,
                              ),
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    patch({
                      milestones: [...state.milestones, { title: "", owner: "", due_date: "" }],
                    })
                  }
                >
                  + {t("work.addMilestone")}
                </Button>
              </div>
            )}

            {step === "review" && (
              <Review state={state} krLabel={selectedKr ? `KR ${selectedKr.label}` : "—"} />
            )}

            {canAssist && (
              <div className="mt-6 rounded-2xl border border-highlight/40 bg-highlight/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-primary">{t("journey.suggestions")}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={askAssistant}
                    disabled={suggesting || state.text.trim().length === 0}
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    {suggesting ? t("journey.suggesting") : t("journey.suggest")}
                  </Button>
                </div>
                {suggestions.length > 0 && (
                  <ul className="mt-3 grid gap-2">
                    {suggestions.map((d, i) => (
                      <li key={i} className="rounded-xl border border-border/70 bg-card p-3">
                        <p className="text-sm font-semibold text-foreground">{d.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{d.why}</p>
                        <div className="mt-2 flex gap-2">
                          <Button type="button" size="sm" onClick={() => applySuggestion(d)}>
                            {t("journey.useThis")}
                          </Button>
                        </div>
                      </li>
                    ))}
                    <li>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSuggestions([])}
                      >
                        {t("journey.dismiss")}
                      </Button>
                    </li>
                  </ul>
                )}
              </div>
            )}

            {blocker && <p className="mt-4 text-xs text-destructive">{t(blocker)}</p>}
          </div>

          <SheetFooter className="flex-row items-center justify-between gap-2 border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => (index === 0 ? requestClose(false) : setIndex(index - 1))}
              disabled={create.isPending}
            >
              {index === 0 ? t("common.cancel") : t("journey.back")}
            </Button>
            {isLast ? (
              <Button
                onClick={() => create.mutate()}
                disabled={create.isPending || !state.kr_id || !state.text.trim()}
              >
                {create.isPending ? t("journey.creating") : t("journey.finish")}
              </Button>
            ) : (
              <Button onClick={() => setIndex(index + 1)} disabled={!!blocker}>
                {t("journey.next")}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("journey.discardTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("journey.discardBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmClose(false);
                onOpenChange(false);
              }}
            >
              {t("journey.discardConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function DateRange({
  state,
  patch,
}: {
  state: JourneyState;
  patch: (p: Partial<JourneyState>) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t("work.startDate")} htmlFor="wj-start">
        <Input
          id="wj-start"
          type="date"
          value={state.start_date}
          onChange={(e) => patch({ start_date: e.target.value })}
        />
      </Field>
      <Field label={t("work.endDate")} htmlFor="wj-end">
        <Input
          id="wj-end"
          type="date"
          value={state.end_date}
          onChange={(e) => patch({ end_date: e.target.value })}
        />
      </Field>
    </div>
  );
}

function Review({ state, krLabel }: { state: JourneyState; krLabel: string }) {
  const { t } = useLocale();
  const rows: Array<[string, string]> = [
    [t("work.form.kind"), t(KIND_KEY[state.kind])],
    [t("initiatives.form.kr"), krLabel],
    [t("initiatives.form.status"), t(STATUS_KEY[state.status])],
  ];
  if (state.owner) rows.push([t("initiatives.form.owner"), state.owner]);
  if (state.lead_name) rows.push([t("work.lead"), state.lead_name]);
  if (state.size) rows.push([t("work.size"), t(SIZE_KEY[state.size])]);
  if (state.start_date || state.end_date)
    rows.push([t("work.phase"), `${state.start_date || "—"} → ${state.end_date || "—"}`]);
  if (state.confidence) rows.push([t("work.confidence"), t(CONFIDENCE_KEY[state.confidence])]);

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
        <p className="eyebrow text-primary">{t("journey.step.review")}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-foreground">
          {state.text || t("journey.reviewNothing")}
        </h3>
        {state.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{state.description}</p>
        )}
        {state.idea && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{state.idea}</p>
        )}
        <dl className="mt-4 grid gap-1.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="w-40 shrink-0 text-muted-foreground">{k}</dt>
              <dd className="min-w-0 font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {state.aspiration && (
        <ReviewBlock title={t("work.aspiration")}>
          <p className="text-sm text-foreground">{state.aspiration}</p>
        </ReviewBlock>
      )}

      {(state.bet_action || state.bet_change || state.bet_question) && (
        <ReviewBlock title={t("work.bet")}>
          <p className="text-sm text-foreground">
            {t("work.betAction")} {state.bet_action} {t("work.betChange")} {state.bet_change}{" "}
            {t("work.betQuestion")} {state.bet_question}
          </p>
        </ReviewBlock>
      )}

      {state.signals.length > 0 && (
        <ReviewBlock title={t("work.signals")}>
          <ul className="grid gap-1.5 text-sm text-foreground">
            {state.signals.map((s, i) => (
              <li key={i}>
                {s.name} — {t(EVIDENCE_KEY[s.evidence])}
              </li>
            ))}
          </ul>
        </ReviewBlock>
      )}

      {state.milestones.length > 0 && (
        <ReviewBlock title={t("work.milestones")}>
          <ul className="grid gap-1.5 text-sm text-foreground">
            {state.milestones.map((m, i) => (
              <li key={i}>
                {m.title}
                {m.due_date ? ` — ${m.due_date}` : ""}
              </li>
            ))}
          </ul>
        </ReviewBlock>
      )}
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-muted/30 p-4">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      {children}
    </section>
  );
}
