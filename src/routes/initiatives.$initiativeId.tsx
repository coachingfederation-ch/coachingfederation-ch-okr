import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Printer, Trash2 } from "lucide-react";

import {
  addLearningEntry,
  addMilestone,
  addSignal,
  deleteLearningEntry,
  deleteMilestone,
  deleteSignal,
  getDashboard,
} from "@/lib/okr.functions";
import {
  EVIDENCE_TYPES,
  LEARNING_DECISIONS,
  LIMITS,
  SIGNAL_DIRECTIONS,
  type EvidenceType,
  type InitiativeDTO,
  type KeyResultDTO,
  type LearningDecision,
  type OkrSetDTO,
  type SignalDirection,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { EditInitiativeDialog } from "@/components/okr/EditInitiativeDialog";
import { listInitiativeInterests } from "@/lib/interests.functions";
import {
  AVAILABILITY_CHIP,
  AVAILABILITY_KEY,
  COMMITMENT_KEY,
  HELP_NEEDED_KEY,
} from "@/components/okr/initiative-meta";
import {
  CONFIDENCE_CHIP,
  CONFIDENCE_KEY,
  DECISION_CHIP,
  DECISION_KEY,
  DIRECTION_KEY,
  EVIDENCE_KEY,
  KIND_CHIP,
  KIND_KEY,
  PHASE_TYPE_KEY,
  SIZE_KEY,
  formatDate,
  formatDateRange,
} from "@/components/okr/work-meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"] as const,
  queryFn: () => getDashboard(),
});

export const Route = createFileRoute("/initiatives/$initiativeId")({
  head: () => ({
    meta: [
      { title: "Initiative one-pager — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "The full picture of one piece of chapter work: its bet, its 90-day leg, the signals it watches and what the team has learned.",
      },
      {
        property: "og:title",
        content: "Initiative one-pager — The Switzerland Chapter of ICF",
      },
      {
        property: "og:description",
        content: "Bet, 90-day leg, signals and learning check-ins for one piece of chapter work.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: DetailPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

function DetailPage() {
  return (
    <Suspense fallback={<DetailFallback />}>
      <DetailContent />
    </Suspense>
  );
}

function DetailFallback() {
  const { t } = useLocale();
  return <div className="p-8 text-sm text-muted-foreground">{t("common.loading")}</div>;
}

function DetailContent() {
  const { initiativeId } = useParams({ from: "/initiatives/$initiativeId" });
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { canEdit } = useAuth();
  const { locale, t } = useLocale();
  const [editOpen, setEditOpen] = useState(false);

  let initiative: InitiativeDTO | null = null;
  let kr: KeyResultDTO | null = null;
  let set: OkrSetDTO | null = null;
  for (const s of data.okr_sets) {
    for (const k of s.key_results) {
      const found = k.initiatives.find((i) => i.id === initiativeId);
      if (found) {
        initiative = found;
        kr = k;
        set = s;
      }
    }
  }

  if (!initiative || !kr || !set) {
    return (
      <main className="mx-auto max-w-3xl px-8 py-16">
        <p className="text-sm text-muted-foreground">{t("work.notFound")}</p>
        <Link to="/initiatives" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← {t("work.back")}
        </Link>
      </main>
    );
  }

  const teamName = initiative.team_id
    ? (() => {
        const team = data.teams.find((x) => x.id === initiative!.team_id);
        return team ? pickTranslation(team, "name", team.name, locale) || team.name : null;
      })()
    : null;

  const title = pickTranslation(initiative, "text", initiative.text, locale);
  const range = formatDateRange(initiative.start_date, initiative.end_date, locale);

  const text = (field: string, value: string) =>
    pickTranslation(initiative as InitiativeDTO, field, value, locale);

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground print:hidden">
        <div className="mx-auto max-w-5xl px-8 pt-6 pb-12">
          <div className="mb-8 flex items-start justify-between gap-4">
            <Link to="/initiatives" className="text-xs font-medium text-hero-foreground/80 hover:text-hero-foreground">
              ← {t("work.back")}
            </Link>
            <div className="flex items-center gap-3">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-wider",
                KIND_CHIP[initiative.kind],
              )}
            >
              {t(KIND_KEY[initiative.kind])}
            </span>
            {initiative.size && (
              <span className="inline-flex h-6 items-center rounded-full border border-hero-foreground/30 px-2.5 text-[11px] font-semibold">
                {t("work.size")}: {t(SIZE_KEY[initiative.size])}
              </span>
            )}
            {teamName && (
              <span className="inline-flex h-6 items-center rounded-full border border-hero-foreground/30 px-2.5 text-[11px] font-semibold">
                {teamName}
              </span>
            )}
            {initiative.status === "planned" && (
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold",
                  AVAILABILITY_CHIP[initiative.availability],
                )}
              >
                {t(AVAILABILITY_KEY[initiative.availability])}
              </span>
            )}
          </div>

          <h1 className="display-xl mt-4 max-w-3xl">{title}</h1>

          <p className="mt-4 text-sm text-hero-foreground/75">
            {t("work.strategicContext")}: {set.number}.{" "}
            {pickTranslation(set, "title", set.title, locale)} · KR {kr.kr} ·{" "}
            {pickTranslation(kr, "text", kr.text, locale)}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {canEdit && (
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                {t("work.editPlan")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="bg-transparent text-hero-foreground"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {t("report.download")}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-8 py-10">
        {(initiative.idea || initiative.why_now || initiative.proposed_owner) && (
          <Panel title={t("work.idea")}>
            {initiative.idea && <Prose>{text("idea", initiative.idea)}</Prose>}
            {initiative.why_now && (
              <Field label={t("work.whyNow")}>{text("why_now", initiative.why_now)}</Field>
            )}
            {initiative.proposed_owner && (
              <Field label={t("work.proposedOwner")}>
                {text("proposed_owner", initiative.proposed_owner)}
              </Field>
            )}
          </Panel>
        )}

        {initiative.description && (
          <Panel title={t("initiatives.description")}>
            <Prose>{text("description", initiative.description)}</Prose>
          </Panel>
        )}

        {initiative.aspiration && (
          <Panel title={t("work.aspiration")}>
            <Prose>{text("aspiration", initiative.aspiration)}</Prose>
          </Panel>
        )}

        {(initiative.bet_action || initiative.bet_change || initiative.bet_question) && (
          <Panel title={t("work.bet")}>
            <div className="grid gap-3">
              {initiative.bet_action && (
                <Field label={t("work.betAction")}>{text("bet_action", initiative.bet_action)}</Field>
              )}
              {initiative.bet_change && (
                <Field label={t("work.betChange")}>{text("bet_change", initiative.bet_change)}</Field>
              )}
              {initiative.bet_question && (
                <Field label={t("work.betQuestion")}>
                  {text("bet_question", initiative.bet_question)}
                </Field>
              )}
            </div>
            {initiative.confidence && (
              <span
                className={cn(
                  "mt-4 inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold",
                  CONFIDENCE_CHIP[initiative.confidence],
                )}
              >
                {t("work.confidence")}: {t(CONFIDENCE_KEY[initiative.confidence])}
              </span>
            )}
          </Panel>
        )}

        <Panel title={t("work.phase")}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t("work.phaseNumber")}>{String(initiative.phase)}</Field>
            <Field label={t("work.phaseType")}>
              {initiative.phase_type ? t(PHASE_TYPE_KEY[initiative.phase_type]) : "—"}
            </Field>
            <Field label={t("work.startDate")}>{range ?? "—"}</Field>
          </div>
          {initiative.learning_checkpoint && (
            <Field label={t("work.learningCheckpoint")}>
              {formatDate(initiative.learning_checkpoint, locale)}
            </Field>
          )}
        </Panel>

        <SignalsPanel initiative={initiative} canEdit={canEdit} />
        <MilestonesPanel initiative={initiative} canEdit={canEdit} />

        <Panel title={t("work.section.people")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("work.lead")}>{text("lead_name", initiative.lead_name) || "—"}</Field>
            <Field label={t("initiatives.owner")}>{text("owner", initiative.owner) || "—"}</Field>
            {initiative.commitment && (
              <Field label={t("initiatives.form.commitment")}>
                {t(COMMITMENT_KEY[initiative.commitment])}
              </Field>
            )}
            {initiative.help_needed && (
              <Field label={t("initiatives.form.helpNeeded")}>
                {t(HELP_NEEDED_KEY[initiative.help_needed])}
              </Field>
            )}
          </div>
          {initiative.skill_note && (
            <Field label={t("initiatives.form.skillNote")}>
              {text("skill_note", initiative.skill_note)}
            </Field>
          )}
        </Panel>

        {(initiative.support_needed || initiative.out_of_scope) && (
          <Panel title={t("work.section.plan")}>
            {initiative.support_needed && (
              <Field label={t("work.supportNeeded")}>
                {text("support_needed", initiative.support_needed)}
              </Field>
            )}
            {initiative.out_of_scope && (
              <Field label={t("work.outOfScope")}>
                {text("out_of_scope", initiative.out_of_scope)}
              </Field>
            )}
          </Panel>
        )}

        <LearningPanel initiative={initiative} canEdit={canEdit} />

        {canEdit && <InterestPanel initiativeId={initiative.id} />}
      </div>

      <EditInitiativeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initiative={initiative}
        dashboard={data}
        canEdit={canEdit}
      />
    </main>
  );
}

// ---------- Volunteer interest (editors only) ----------

/**
 * Read-only list of volunteers who expressed interest from the public
 * "Get involved" page. RLS keeps this invisible to everyone but editors.
 */
function InterestPanel({ initiativeId }: { initiativeId: string }) {
  const { t, locale } = useLocale();
  const listFn = useServerFn(listInitiativeInterests);
  const { data, isLoading } = useQuery({
    queryKey: ["initiative-interests", initiativeId] as const,
    queryFn: () => listFn({ data: { initiative_id: initiativeId } }),
  });

  return (
    <Panel title={t("involve.panel.title")}>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("involve.panel.empty")}</p>
      ) : (
        <ul className="grid gap-3">
          {data.map((row) => (
            <li
              key={row.id}
              className="rounded-r-md border-l-4 border-l-primary bg-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{row.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(row.created_at).toLocaleDateString(locale)}
                </p>
              </div>
              <a
                href={`mailto:${row.email}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                {row.email}
              </a>
              {row.message && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                  {row.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ---------- Presentation helpers ----------

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

// ---------- Signals ----------

function SignalsPanel({
  initiative,
  canEdit,
}: {
  initiative: InitiativeDTO;
  canEdit: boolean;
}) {
  const { locale, t } = useLocale();
  const qc = useQueryClient();
  const addFn = useServerFn(addSignal);
  const delFn = useServerFn(deleteSignal);

  const [name, setName] = useState("");
  const [evidence, setEvidence] = useState<EvidenceType>("see");
  const [howNoticed, setHowNoticed] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [direction, setDirection] = useState<SignalDirection | "none">("none");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });

  const add = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          initiative_id: initiative.id,
          patch: {
            name: name.trim(),
            evidence,
            how_noticed: howNoticed.trim(),
            starting_point: startingPoint.trim(),
            direction: direction === "none" ? null : direction,
          },
          sourceLang: locale,
        },
      }),
    onSuccess: () => {
      toast.success(t("work.saved"));
      setName("");
      setHowNoticed("");
      setStartingPoint("");
      setDirection("none");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <Panel title={t("work.signals")}>
      {initiative.signals.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("work.noSignals")}</p>
      ) : (
        <ul className="grid gap-3">
          {initiative.signals.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-border/60 bg-muted/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {pickTranslation(s, "name", s.name, locale)}
                </p>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => remove.mutate(s.id)}
                    aria-label={t("work.deleteEntry")}
                    className="text-muted-foreground/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(EVIDENCE_KEY[s.evidence])}
                {s.direction ? ` · ${t(DIRECTION_KEY[s.direction])}` : ""}
              </p>
              {s.how_noticed && (
                <Field label={t("work.signal.howNoticed")}>
                  {pickTranslation(s, "how_noticed", s.how_noticed, locale)}
                </Field>
              )}
              {s.starting_point && (
                <Field label={t("work.signal.startingPoint")}>
                  {pickTranslation(s, "starting_point", s.starting_point, locale)}
                </Field>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <div className="grid gap-3 rounded-xl border border-dashed border-border/70 p-4 print:hidden">
          <div className="grid gap-1.5">
            <Label htmlFor="sig-name">{t("work.signal.name")}</Label>
            <Input
              id="sig-name"
              value={name}
              maxLength={LIMITS.signalName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>{t("work.signal.evidence")}</Label>
              <Select value={evidence} onValueChange={(v) => setEvidence(v as EvidenceType)}>
                <SelectTrigger>
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
            </div>
            <div className="grid gap-1.5">
              <Label>{t("work.signal.direction")}</Label>
              <Select
                value={direction}
                onValueChange={(v) => setDirection(v as SignalDirection | "none")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("initiatives.form.unspecified")}</SelectItem>
                  {SIGNAL_DIRECTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {t(DIRECTION_KEY[d])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sig-how">{t("work.signal.howNoticed")}</Label>
            <Textarea
              id="sig-how"
              rows={2}
              value={howNoticed}
              maxLength={LIMITS.signalNote}
              onChange={(e) => setHowNoticed(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sig-start">{t("work.signal.startingPoint")}</Label>
            <Input
              id="sig-start"
              value={startingPoint}
              maxLength={LIMITS.signalNote}
              onChange={(e) => setStartingPoint(e.target.value)}
            />
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => add.mutate()}
              disabled={!name.trim() || add.isPending}
            >
              {t("work.addSignal")}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}

// ---------- Milestones ----------

function MilestonesPanel({
  initiative,
  canEdit,
}: {
  initiative: InitiativeDTO;
  canEdit: boolean;
}) {
  const { locale, t } = useLocale();
  const qc = useQueryClient();
  const addFn = useServerFn(addMilestone);
  const delFn = useServerFn(deleteMilestone);

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });

  const add = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          initiative_id: initiative.id,
          patch: { title: title.trim(), owner: owner.trim(), due_date: due || null },
          sourceLang: locale,
        },
      }),
    onSuccess: () => {
      toast.success(t("work.saved"));
      setTitle("");
      setOwner("");
      setDue("");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <Panel title={t("work.milestones")}>
      {initiative.milestones.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("work.noMilestones")}</p>
      ) : (
        <ul className="grid gap-2">
          {initiative.milestones.map((m) => (
            <li
              key={m.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {pickTranslation(m, "title", m.title, locale)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {pickTranslation(m, "owner", m.owner, locale) || "—"} · {t("work.milestone.due")}{" "}
                  {formatDate(m.due_date, locale)}
                </p>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => remove.mutate(m.id)}
                  aria-label={t("work.deleteEntry")}
                  className="text-muted-foreground/70 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <div className="grid gap-3 rounded-xl border border-dashed border-border/70 p-4 sm:grid-cols-3 print:hidden">
          <div className="grid gap-1.5">
            <Label htmlFor="ms-title">{t("work.milestone.title")}</Label>
            <Input
              id="ms-title"
              value={title}
              maxLength={LIMITS.milestoneTitle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ms-owner">{t("work.milestone.owner")}</Label>
            <Input
              id="ms-owner"
              value={owner}
              maxLength={LIMITS.initiativeOwner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ms-due">{t("work.milestone.due")}</Label>
            <Input id="ms-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="sm:col-span-3">
            <Button
              size="sm"
              onClick={() => add.mutate()}
              disabled={!title.trim() || add.isPending}
            >
              {t("work.addMilestone")}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}

// ---------- Learning check-ins ----------

function LearningPanel({
  initiative,
  canEdit,
}: {
  initiative: InitiativeDTO;
  canEdit: boolean;
}) {
  const { locale, t } = useLocale();
  const qc = useQueryClient();
  const addFn = useServerFn(addLearningEntry);
  const delFn = useServerFn(deleteLearningEntry);

  const [author, setAuthor] = useState("");
  const [decision, setDecision] = useState<LearningDecision>("growing");
  const [whatHappened, setWhatHappened] = useState("");
  const [signalsTelling, setSignalsTelling] = useState("");
  const [surprisedUs, setSurprisedUs] = useState("");
  const [proudOf, setProudOf] = useState("");
  const [doNext, setDoNext] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });

  const add = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          initiative_id: initiative.id,
          patch: {
            author_name: author.trim(),
            decision,
            what_happened: whatHappened.trim(),
            signals_telling: signalsTelling.trim(),
            surprised_us: surprisedUs.trim(),
            proud_of: proudOf.trim(),
            do_next: doNext.trim(),
          },
          sourceLang: locale,
        },
      }),
    onSuccess: () => {
      toast.success(t("work.saved"));
      setAuthor("");
      setWhatHappened("");
      setSignalsTelling("");
      setSurprisedUs("");
      setProudOf("");
      setDoNext("");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <Panel title={t("work.learning")}>
      {initiative.learning_entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("work.noLearning")}</p>
      ) : (
        <ul className="grid gap-3">
          {initiative.learning_entries.map((e) => (
            <li key={e.id} className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold",
                      DECISION_CHIP[e.decision],
                    )}
                  >
                    {t(DECISION_KEY[e.decision])}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(e.entry_date, locale)}
                    {e.author_name
                      ? ` · ${pickTranslation(e, "author_name", e.author_name, locale)}`
                      : ""}
                  </span>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => remove.mutate(e.id)}
                    aria-label={t("work.deleteEntry")}
                    className="text-muted-foreground/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {e.what_happened && (
                  <Field label={t("work.learning.whatHappened")}>
                    {pickTranslation(e, "what_happened", e.what_happened, locale)}
                  </Field>
                )}
                {e.signals_telling && (
                  <Field label={t("work.learning.signalsTelling")}>
                    {pickTranslation(e, "signals_telling", e.signals_telling, locale)}
                  </Field>
                )}
                {e.surprised_us && (
                  <Field label={t("work.learning.surprisedUs")}>
                    {pickTranslation(e, "surprised_us", e.surprised_us, locale)}
                  </Field>
                )}
                {e.proud_of && (
                  <Field label={t("work.learning.proudOf")}>
                    {pickTranslation(e, "proud_of", e.proud_of, locale)}
                  </Field>
                )}
                {e.do_next && (
                  <Field label={t("work.learning.doNext")}>
                    {pickTranslation(e, "do_next", e.do_next, locale)}
                  </Field>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <div className="grid gap-3 rounded-xl border border-dashed border-border/70 p-4 print:hidden">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="le-author">{t("work.learning.author")}</Label>
              <Input
                id="le-author"
                value={author}
                maxLength={LIMITS.authorName}
                onChange={(ev) => setAuthor(ev.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("work.learning.decision")}</Label>
              <Select value={decision} onValueChange={(v) => setDecision(v as LearningDecision)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_DECISIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {t(DECISION_KEY[d])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <LearningField
            id="le-what"
            label={t("work.learning.whatHappened")}
            value={whatHappened}
            onChange={setWhatHappened}
          />
          <LearningField
            id="le-signals"
            label={t("work.learning.signalsTelling")}
            value={signalsTelling}
            onChange={setSignalsTelling}
          />
          <LearningField
            id="le-surprise"
            label={t("work.learning.surprisedUs")}
            value={surprisedUs}
            onChange={setSurprisedUs}
          />
          <LearningField
            id="le-proud"
            label={t("work.learning.proudOf")}
            value={proudOf}
            onChange={setProudOf}
          />
          <LearningField
            id="le-next"
            label={t("work.learning.doNext")}
            value={doNext}
            onChange={setDoNext}
          />
          <div>
            <Button
              size="sm"
              onClick={() => add.mutate()}
              disabled={!whatHappened.trim() || add.isPending}
            >
              {t("work.addLearning")}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}

function LearningField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={2}
        value={value}
        maxLength={LIMITS.learningText}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
