import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, X as XIcon } from "lucide-react";

import {
  updateInitiative,
  deleteInitiative,
  setInitiativeSecondaryKrs,
} from "@/lib/okr.functions";
import {
  BET_CONFIDENCES,
  INITIATIVE_AVAILABILITIES,
  INITIATIVE_COMMITMENTS,
  INITIATIVE_HELP_NEEDED,
  INITIATIVE_KINDS,
  INITIATIVE_STATUSES,
  LIMITS,
  PHASE_TYPES,
  WORK_SIZES,
  type BetConfidence,
  type DashboardDTO,
  type InitiativeAvailability,
  type InitiativeCommitment,
  type InitiativeDTO,
  type InitiativeHelpNeeded,
  type InitiativeKind,
  type InitiativeStatus,
  type PhaseType,
  type WorkSize,
} from "@/lib/okr-schemas";
import {
  CONFIDENCE_KEY,
  KIND_KEY,
  PHASE_TYPE_KEY,
  SIZE_KEY,
} from "./work-meta";
import {
  AMBER_NOTE,
  AVAILABILITY_KEY,
  COMMITMENT_KEY,
  HELP_NEEDED_KEY,
} from "./initiative-meta";
import { pickTranslation, useLocale } from "@/lib/i18n";

import type { StringKey } from "@/lib/i18n-strings";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";


const STATUS_KEY: Record<InitiativeStatus, StringKey> = {
  planned: "initiatives.status.planned",
  in_progress: "initiatives.status.in_progress",
  done: "initiatives.status.done",
  canceled: "initiatives.status.canceled",
};

const STATUS_DOT: Record<InitiativeStatus, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-primary",
  done: "bg-emerald-500",
  canceled: "bg-muted-foreground/50",
};

export function EditInitiativeDialog({
  open,
  onOpenChange,
  initiative,
  dashboard,
  canEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initiative: InitiativeDTO | null;
  dashboard: DashboardDTO;
  canEdit: boolean;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const updateFn = useServerFn(updateInitiative);
  const deleteFn = useServerFn(deleteInitiative);

  const krContext = useMemo(() => {
    if (!initiative) return null;
    for (const s of dashboard.okr_sets) {
      for (const k of s.key_results) {
        if (k.id === initiative.kr_id) {
          return {
            krLabel: k.kr || "—",
            krText: pickTranslation(k, "text", k.text, locale) || "Untitled KR",
            okrTitle:
              pickTranslation(s, "title", s.title, locale) || "Untitled OKR",
            okrNumber: s.number,
          };
        }
      }
    }
    return null;
  }, [initiative, dashboard, locale]);

  // Flat list of all KRs with their OKR context, for the secondary picker.
  const allKrs = useMemo(() => {
    const list: {
      id: string;
      okrNumber: number;
      krLabel: string;
      krText: string;
      okrTitle: string;
      chip: string;
    }[] = [];
    for (const s of dashboard.okr_sets) {
      for (const k of s.key_results) {
        const label = k.kr || "—";
        const chip =
          `${s.number}.` +
          (label.includes(".") ? label.split(".")[1] : label);
        list.push({
          id: k.id,
          okrNumber: s.number,
          krLabel: label,
          krText: pickTranslation(k, "text", k.text, locale) || "Untitled KR",
          okrTitle:
            pickTranslation(s, "title", s.title, locale) || "Untitled OKR",
          chip,
        });
      }
    }
    return list;
  }, [dashboard, locale]);

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<InitiativeStatus>("planned");
  const [availability, setAvailability] = useState<InitiativeAvailability>("open");
  const [blockedReason, setBlockedReason] = useState("");
  const [commitment, setCommitment] = useState<InitiativeCommitment | null>(null);
  const [helpNeeded, setHelpNeeded] = useState<InitiativeHelpNeeded | null>(null);
  const [skillNote, setSkillNote] = useState("");
  const [secondaryIds, setSecondaryIds] = useState<string[]>([]);
  // ASPIRE planning layer. Kept in the same sheet so an editor can move a card
  // from "idea" to a planned initiative without leaving the portfolio.
  const [kind, setKind] = useState<InitiativeKind>("initiative");
  const [size, setSize] = useState<WorkSize | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const [whyNow, setWhyNow] = useState("");
  const [proposedOwner, setProposedOwner] = useState("");
  const [phase, setPhase] = useState("1");
  const [phaseType, setPhaseType] = useState<PhaseType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aspiration, setAspiration] = useState("");
  const [betAction, setBetAction] = useState("");
  const [betChange, setBetChange] = useState("");
  const [betQuestion, setBetQuestion] = useState("");
  const [confidence, setConfidence] = useState<BetConfidence | null>(null);
  const [learningCheckpoint, setLearningCheckpoint] = useState("");
  const [supportNeeded, setSupportNeeded] = useState("");
  const [outOfScope, setOutOfScope] = useState("");
  const [leadName, setLeadName] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && initiative) {
      setTitle(pickTranslation(initiative, "text", initiative.text, locale) || "");
      setOwner(pickTranslation(initiative, "owner", initiative.owner, locale) || "");
      setDescription(
        pickTranslation(initiative, "description", initiative.description, locale) || "",
      );
      setStatus(initiative.status);
      setAvailability(initiative.availability ?? "open");
      setBlockedReason(
        pickTranslation(initiative, "blocked_reason", initiative.blocked_reason, locale) || "",
      );
      setCommitment(initiative.commitment ?? null);
      setHelpNeeded(initiative.help_needed ?? null);
      setSkillNote(
        pickTranslation(initiative, "skill_note", initiative.skill_note, locale) || "",
      );
      setSecondaryIds(initiative.secondary_kr_ids ?? []);
      const tr = (field: string, value: string) =>
        pickTranslation(initiative, field, value, locale) || "";
      setKind(initiative.kind);
      setSize(initiative.size ?? null);
      setTeamId(initiative.team_id ?? null);
      setIdea(tr("idea", initiative.idea));
      setWhyNow(tr("why_now", initiative.why_now));
      setProposedOwner(tr("proposed_owner", initiative.proposed_owner));
      setPhase(String(initiative.phase ?? 1));
      setPhaseType(initiative.phase_type ?? null);
      setStartDate(initiative.start_date ?? "");
      setEndDate(initiative.end_date ?? "");
      setAspiration(tr("aspiration", initiative.aspiration));
      setBetAction(tr("bet_action", initiative.bet_action));
      setBetChange(tr("bet_change", initiative.bet_change));
      setBetQuestion(tr("bet_question", initiative.bet_question));
      setConfidence(initiative.confidence ?? null);
      // Date column, not translatable text — always use the raw ISO value.
      setLearningCheckpoint(initiative.learning_checkpoint ?? "");
      setSupportNeeded(tr("support_needed", initiative.support_needed));
      setOutOfScope(tr("out_of_scope", initiative.out_of_scope));
      setLeadName(tr("lead_name", initiative.lead_name));
    }
  }, [open, initiative, locale]);

  const setSecondaryFn = useServerFn(setInitiativeSecondaryKrs);
  const initialSecondaryIds = initiative?.secondary_kr_ids ?? [];

  const save = useMutation({
    mutationFn: async () => {
      if (!initiative) throw new Error("No initiative");
      await updateFn({
        data: {
          id: initiative.id,
          patch: {
            text: title.trim(),
            owner: owner.trim(),
            description: description.trim(),
            status,
            availability,
            blocked_reason: blockedReason.trim(),
            commitment,
            help_needed: helpNeeded,
            skill_note: skillNote.trim(),
            kind,
            size,
            team_id: teamId,
            idea: idea.trim(),
            why_now: whyNow.trim(),
            proposed_owner: proposedOwner.trim(),
            phase: Number(phase) || 1,
            phase_type: phaseType,
            start_date: startDate || null,
            end_date: endDate || null,
            aspiration: aspiration.trim(),
            bet_action: betAction.trim(),
            bet_change: betChange.trim(),
            bet_question: betQuestion.trim(),
            confidence,
            learning_checkpoint: learningCheckpoint.trim(),
            support_needed: supportNeeded.trim(),
            out_of_scope: outOfScope.trim(),
            lead_name: leadName.trim(),
          },
          sourceLang: locale,
        },
      });
      const before = [...initialSecondaryIds].sort().join(",");
      const after = [...secondaryIds].sort().join(",");
      if (before !== after) {
        await setSecondaryFn({
          data: { id: initiative.id, kr_ids: secondaryIds },
        });
      }
    },
    onSuccess: () => {
      toast.success(t("initiatives.updated"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });


  const remove = useMutation({
    mutationFn: () => {
      if (!initiative) throw new Error("No initiative");
      return deleteFn({ data: { id: initiative.id } });
    },
    onSuccess: () => {
      toast.success(t("initiatives.deleted"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setConfirmOpen(false);
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const busy = save.isPending || remove.isPending;
  const canSubmit = canEdit && !!initiative && title.trim().length > 0 && !busy;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t("initiatives.editTitle")}</SheetTitle>
          <SheetDescription>{t("initiatives.editDescription")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-w-0 px-6 py-4">
          <div className="grid gap-4 min-w-0">
            {krContext && (
              <div className="grid gap-1.5">
                <Label>{t("initiatives.form.kr")}</Label>
                <div className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                      {krContext.okrNumber}.
                      {krContext.krLabel.includes(".")
                        ? krContext.krLabel.split(".")[1]
                        : krContext.krLabel}
                    </span>
                    <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {krContext.okrTitle}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{krContext.krText}</p>
                </div>
              </div>
            )}

            {initiative && (
              <div className="grid gap-1.5 min-w-0">
                <Label>{t("initiatives.form.secondaryKrs")}</Label>
                <div className="grid gap-1.5">
                  {secondaryIds.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("initiatives.form.noSecondaryKrs")}
                    </p>
                  )}
                  {secondaryIds.map((id) => {
                    const k = allKrs.find((x) => x.id === id);
                    if (!k) return null;
                    return (
                      <div
                        key={id}
                        className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                                {k.chip}
                              </span>
                              <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {k.okrTitle}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-foreground">{k.krText}</p>
                          </div>
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setSecondaryIds((prev) => prev.filter((x) => x !== id))
                              }
                              aria-label={t("initiatives.form.removeSecondaryKr")}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {canEdit && (
                    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className="w-full justify-start">
                          <Plus className="h-4 w-4 mr-1" />
                          {t("initiatives.form.addSecondaryKr")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-[var(--radix-popover-trigger-width)] bg-background text-foreground border shadow-lg z-[60]"
                        align="start"
                      >
                        <Command className="bg-background">

                          <CommandInput placeholder={t("initiatives.form.searchKr")} />
                          <CommandList>
                            <CommandEmpty>—</CommandEmpty>
                            <CommandGroup>
                              {allKrs
                                .filter(
                                  (k) =>
                                    k.id !== initiative.kr_id &&
                                    !secondaryIds.includes(k.id),
                                )
                                .map((k) => (
                                  <CommandItem
                                    key={k.id}
                                    value={`${k.chip} ${k.okrTitle} ${k.krText}`}
                                    onSelect={() => {
                                      setSecondaryIds((prev) => [...prev, k.id]);
                                      setPickerOpen(false);
                                    }}
                                  >
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                                          {k.chip}
                                        </span>
                                        <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                          {k.okrTitle}
                                        </span>
                                      </div>
                                      <span className="text-sm text-foreground line-clamp-2">
                                        {k.krText}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )}



            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-title">{t("initiatives.form.title")}</Label>
              <Textarea
                id="ei-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, LIMITS.initiative))}
                placeholder={t("initiatives.form.titlePlaceholder")}
                rows={2}
                maxLength={LIMITS.initiative}
                disabled={!canEdit}
                autoFocus
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-owner">{t("initiatives.form.owner")}</Label>
              <Input
                id="ei-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value.slice(0, LIMITS.initiativeOwner))}
                placeholder={t("initiatives.form.ownerPlaceholder")}
                maxLength={LIMITS.initiativeOwner}
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-desc">{t("initiatives.form.description")}</Label>
              <Textarea
                id="ei-desc"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, LIMITS.initiativeDescription))
                }
                placeholder={t("initiatives.form.descriptionPlaceholder")}
                rows={4}
                maxLength={LIMITS.initiativeDescription}
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-status">{t("initiatives.form.status")}</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as InitiativeStatus)}
                disabled={!canEdit}
              >
                <SelectTrigger id="ei-status" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INITIATIVE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} aria-hidden />
                        {t(STATUS_KEY[s])}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status === "planned" && (
              <>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-availability">{t("initiatives.form.availability")}</Label>
                  <Select
                    value={availability}
                    onValueChange={(v) => setAvailability(v as InitiativeAvailability)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="ei-availability" className="w-full min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INITIATIVE_AVAILABILITIES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {t(AVAILABILITY_KEY[a])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t("initiatives.form.availabilityHint")}
                  </p>
                </div>

                {availability === "blocked" && (
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-blocked">{t("initiatives.form.blockedReason")}</Label>
                    <Textarea
                      id="ei-blocked"
                      value={blockedReason}
                      onChange={(e) =>
                        setBlockedReason(e.target.value.slice(0, LIMITS.initiativeBlockedReason))
                      }
                      placeholder={t("initiatives.form.blockedReasonPlaceholder")}
                      rows={2}
                      maxLength={LIMITS.initiativeBlockedReason}
                      disabled={!canEdit}
                    />
                    {blockedReason.trim().length === 0 && (
                      <span className={AMBER_NOTE}>{t("volunteer.noReason")}</span>
                    )}
                  </div>
                )}

                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-commitment">{t("initiatives.form.commitment")}</Label>
                  <Select
                    value={commitment ?? "__none__"}
                    onValueChange={(v) =>
                      setCommitment(v === "__none__" ? null : (v as InitiativeCommitment))
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="ei-commitment" className="w-full min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{t("initiatives.form.unspecified")}</SelectItem>
                      {INITIATIVE_COMMITMENTS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(COMMITMENT_KEY[c])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-help">{t("initiatives.form.helpNeeded")}</Label>
                  <Select
                    value={helpNeeded ?? "__none__"}
                    onValueChange={(v) =>
                      setHelpNeeded(v === "__none__" ? null : (v as InitiativeHelpNeeded))
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="ei-help" className="w-full min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{t("initiatives.form.unspecified")}</SelectItem>
                      {INITIATIVE_HELP_NEEDED.map((h) => (
                        <SelectItem key={h} value={h}>
                          {t(HELP_NEEDED_KEY[h])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Consistency hint, deliberately not hard validation. */}
                  {helpNeeded === "helpers" && owner.trim().length === 0 && (
                    <p className="text-xs text-amber-700">
                      {t("initiatives.form.helpersOwnerHint")}
                    </p>
                  )}
                </div>

                {helpNeeded === "skill" && (
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-skill">{t("initiatives.form.skillNote")}</Label>
                    <Input
                      id="ei-skill"
                      value={skillNote}
                      onChange={(e) =>
                        setSkillNote(e.target.value.slice(0, LIMITS.initiativeSkillNote))
                      }
                      placeholder={t("initiatives.form.skillNotePlaceholder")}
                      maxLength={LIMITS.initiativeSkillNote}
                      disabled={!canEdit}
                    />
                  </div>
                )}

                {availability === "open" && (!commitment || !helpNeeded) && (
                  <span className={AMBER_NOTE}>{t("volunteer.scopeMissing")}</span>
                )}
              </>
            )}

            <div className="mt-2 border-t border-border/60 pt-4">
              <h3 className="font-display text-sm font-bold text-foreground">
                {t("work.section.plan")}
              </h3>
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-kind">{t("work.filterKind")}</Label>
              <Select
                value={kind}
                onValueChange={(v) => setKind(v as InitiativeKind)}
                disabled={!canEdit}
              >
                <SelectTrigger id="ei-kind" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INITIATIVE_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {t(KIND_KEY[k])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-size">{t("work.size")}</Label>
              <Select
                value={size ?? "__none__"}
                onValueChange={(v) => setSize(v === "__none__" ? null : (v as WorkSize))}
                disabled={!canEdit}
              >
                <SelectTrigger id="ei-size" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("initiatives.form.unspecified")}</SelectItem>
                  {WORK_SIZES.map((sz) => (
                    <SelectItem key={sz} value={sz}>
                      {t(SIZE_KEY[sz])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-team">{t("work.team")}</Label>
              <Select
                value={teamId ?? "__none__"}
                onValueChange={(v) => setTeamId(v === "__none__" ? null : v)}
                disabled={!canEdit}
              >
                <SelectTrigger id="ei-team" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("initiatives.form.unspecified")}</SelectItem>
                  {dashboard.teams.map((tm) => (
                    <SelectItem key={tm.id} value={tm.id}>
                      {pickTranslation(tm, "name", tm.name, locale) || tm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {kind === "candidate" && (
              <>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-idea">{t("work.idea")}</Label>
                  <Textarea
                    id="ei-idea"
                    rows={3}
                    value={idea}
                    maxLength={LIMITS.idea}
                    onChange={(e) => setIdea(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-whynow">{t("work.whyNow")}</Label>
                  <Textarea
                    id="ei-whynow"
                    rows={2}
                    value={whyNow}
                    maxLength={LIMITS.whyNow}
                    onChange={(e) => setWhyNow(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-proposed">{t("work.proposedOwner")}</Label>
                  <Input
                    id="ei-proposed"
                    value={proposedOwner}
                    maxLength={LIMITS.proposedOwner}
                    onChange={(e) => setProposedOwner(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </>
            )}

            {kind === "initiative" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-phase">{t("work.phaseNumber")}</Label>
                    <Input
                      id="ei-phase"
                      type="number"
                      min={1}
                      value={phase}
                      onChange={(e) => setPhase(e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-phasetype">{t("work.phaseType")}</Label>
                    <Select
                      value={phaseType ?? "__none__"}
                      onValueChange={(v) =>
                        setPhaseType(v === "__none__" ? null : (v as PhaseType))
                      }
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="ei-phasetype" className="w-full min-w-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          {t("initiatives.form.unspecified")}
                        </SelectItem>
                        {PHASE_TYPES.map((pt) => (
                          <SelectItem key={pt} value={pt}>
                            {t(PHASE_TYPE_KEY[pt])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-start">{t("work.startDate")}</Label>
                    <Input
                      id="ei-start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid gap-1.5 min-w-0">
                    <Label htmlFor="ei-end">{t("work.endDate")}</Label>
                    <Input
                      id="ei-end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>

                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-aspiration">{t("work.aspiration")}</Label>
                  <Textarea
                    id="ei-aspiration"
                    rows={2}
                    value={aspiration}
                    maxLength={LIMITS.aspiration}
                    onChange={(e) => setAspiration(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-bet-action">{t("work.betAction")}</Label>
                  <Textarea
                    id="ei-bet-action"
                    rows={2}
                    value={betAction}
                    maxLength={LIMITS.betPart}
                    onChange={(e) => setBetAction(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-bet-change">{t("work.betChange")}</Label>
                  <Textarea
                    id="ei-bet-change"
                    rows={2}
                    value={betChange}
                    maxLength={LIMITS.betPart}
                    onChange={(e) => setBetChange(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-bet-question">{t("work.betQuestion")}</Label>
                  <Textarea
                    id="ei-bet-question"
                    rows={2}
                    value={betQuestion}
                    maxLength={LIMITS.betPart}
                    onChange={(e) => setBetQuestion(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-confidence">{t("work.confidence")}</Label>
                  <Select
                    value={confidence ?? "__none__"}
                    onValueChange={(v) =>
                      setConfidence(v === "__none__" ? null : (v as BetConfidence))
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="ei-confidence" className="w-full min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{t("initiatives.form.unspecified")}</SelectItem>
                      {BET_CONFIDENCES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(CONFIDENCE_KEY[c])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-checkpoint">{t("work.learningCheckpoint")}</Label>
                  <Input
                    id="ei-checkpoint"
                    type="date"
                    value={learningCheckpoint}
                    onChange={(e) => setLearningCheckpoint(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-lead">{t("work.lead")}</Label>
                  <Input
                    id="ei-lead"
                    value={leadName}
                    maxLength={LIMITS.leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-support">{t("work.supportNeeded")}</Label>
                  <Textarea
                    id="ei-support"
                    rows={2}
                    value={supportNeeded}
                    maxLength={LIMITS.supportNeeded}
                    onChange={(e) => setSupportNeeded(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-1.5 min-w-0">
                  <Label htmlFor="ei-scope">{t("work.outOfScope")}</Label>
                  <Textarea
                    id="ei-scope"
                    rows={2}
                    value={outOfScope}
                    maxLength={LIMITS.outOfScope}
                    onChange={(e) => setOutOfScope(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t flex-row items-center gap-2 sm:justify-between">
          {canEdit ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={busy}
            >
              {t("initiatives.delete")}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              {t("common.cancel")}
            </Button>
            {canEdit && (
              <Button onClick={() => save.mutate()} disabled={!canSubmit}>
                {save.isPending ? t("common.saving") : t("common.save")}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("initiatives.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("initiatives.deleteConfirmBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                remove.mutate();
              }}
              disabled={remove.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {remove.isPending ? t("common.deleting") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
