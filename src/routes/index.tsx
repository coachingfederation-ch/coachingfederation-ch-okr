import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import {
  addInitiative,
  addKeyResult,
  addOkrSet,
  deleteInitiative,
  deleteKeyResult,
  deleteOkrSet,
  getDashboard,
  updateAlignmentRow,
  updateInitiative,
  updateKeyResult,
  updateOkrSet,
  updatePillarSummary,
} from "@/lib/okr.functions";
import {
  CONTRIBUTION_CYCLE,
  LIMITS,
  PILLARS,
  ROLE_LABELS,
  type AlignmentRowDTO,
  type Contribution,
  type DashboardDTO,
  type InitiativeDTO,
  type KeyResultDTO,
  type OkrSetDTO,
  type Pillar,
  type PillarSummaryDTO,
  type RoleLabel,
} from "@/lib/okr-schemas";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n-shared";
import { pickTranslation, useLocale } from "@/lib/i18n";
import { pillarName } from "@/lib/i18n-strings";
import { EditableText } from "@/components/okr/EditableText";
import { AuthBadge } from "@/components/okr/AuthBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"] as const,
  queryFn: () => getDashboard(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICFS OKR Dashboard" },
      {
        name: "description",
        content:
          "ICF Switzerland 2026 OKRs with global alignment — one customer-centric objective per strategic pillar.",
      },
      { property: "og:title", content: "ICFS OKR Dashboard" },
      {
        property: "og:description",
        content:
          "ICF Switzerland 2026 OKRs aligned to the ICF Global Strategic Plan 2026–2029.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

// ---------- Mutations ----------
// One useMutation per action, called at the top of IndexContent (fixed hook count).
// `mutate(variables)` handles the payload; optimistic updates use those variables.

type Ctx = { prev: DashboardDTO | undefined };
type Mutator = (draft: DashboardDTO) => void;

function useOkrMutations(sourceLang: Locale) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });
  const onErr = (e: unknown, _v: unknown, ctx: Ctx | undefined) => {
    if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
    toast.error(e instanceof Error ? e.message : "Save failed");
  };
  const optimistic = async (mutator: Mutator): Promise<Ctx> => {
    await qc.cancelQueries({ queryKey: ["dashboard"] });
    const prev = qc.getQueryData<DashboardDTO>(["dashboard"]);
    if (prev) {
      const next = structuredClone(prev);
      mutator(next);
      qc.setQueryData(["dashboard"], next);
    }
    return { prev };
  };

  const updateOkrSetFn = useServerFn(updateOkrSet);
  const addOkrSetFn = useServerFn(addOkrSet);
  const deleteOkrSetFn = useServerFn(deleteOkrSet);
  const addKrFn = useServerFn(addKeyResult);
  const updateKrFn = useServerFn(updateKeyResult);
  const deleteKrFn = useServerFn(deleteKeyResult);
  const addInitFn = useServerFn(addInitiative);
  const updateInitFn = useServerFn(updateInitiative);
  const deleteInitFn = useServerFn(deleteInitiative);
  const updateAlignFn = useServerFn(updateAlignmentRow);
  const updatePillarFn = useServerFn(updatePillarSummary);

  const updateSet = useMutation<
    unknown,
    Error,
    { id: string; patch: Partial<OkrSetDTO> },
    Ctx
  >({
    mutationFn: (v) => updateOkrSetFn({ data: { id: v.id, patch: v.patch as never, sourceLang } }),
    onMutate: (v) =>
      optimistic((d) => {
        const s = d.okr_sets.find((x) => x.id === v.id);
        if (s) Object.assign(s, v.patch);
      }),
    onError: onErr,
    onSettled: invalidate,
  });
  const addSet = useMutation({
    mutationFn: () => addOkrSetFn({ data: { sourceLang } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
    onSuccess: invalidate,
  });
  const deleteSet = useMutation<unknown, Error, { id: string }, Ctx>({
    mutationFn: (v) => deleteOkrSetFn({ data: { id: v.id } }),
    onMutate: (v) =>
      optimistic((d) => {
        d.okr_sets = d.okr_sets.filter((x) => x.id !== v.id);
      }),
    onError: onErr,
    onSettled: invalidate,
  });

  const addKr = useMutation({
    mutationFn: (v: { okr_set_id: string }) => addKrFn({ data: { ...v, sourceLang } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
    onSuccess: invalidate,
  });
  const updateKr = useMutation<
    unknown,
    Error,
    { id: string; patch: Partial<KeyResultDTO> },
    Ctx
  >({
    mutationFn: (v) => updateKrFn({ data: { id: v.id, patch: v.patch as never, sourceLang } }),
    onMutate: (v) =>
      optimistic((d) => {
        for (const s of d.okr_sets) {
          const kr = s.key_results.find((k) => k.id === v.id);
          if (kr) Object.assign(kr, v.patch);
        }
      }),
    onError: onErr,
    onSettled: invalidate,
  });
  const deleteKr = useMutation<unknown, Error, { id: string }, Ctx>({
    mutationFn: (v) => deleteKrFn({ data: { id: v.id } }),
    onMutate: (v) =>
      optimistic((d) => {
        for (const s of d.okr_sets)
          s.key_results = s.key_results.filter((k) => k.id !== v.id);
      }),
    onError: onErr,
    onSettled: invalidate,
  });

  const addInit = useMutation({
    mutationFn: (v: { kr_id: string; text: string }) => addInitFn({ data: { ...v, sourceLang } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
    onSuccess: invalidate,
  });
  const updateInit = useMutation<unknown, Error, { id: string; text: string }, Ctx>({
    mutationFn: (v) => updateInitFn({ data: { id: v.id, patch: { text: v.text }, sourceLang } }),
    onMutate: (v) =>
      optimistic((d) => {
        for (const s of d.okr_sets)
          for (const k of s.key_results) {
            const it = k.initiatives.find((i) => i.id === v.id);
            if (it) it.text = v.text;
          }
      }),
    onError: onErr,
    onSettled: invalidate,
  });
  const deleteInit = useMutation<unknown, Error, { id: string }, Ctx>({
    mutationFn: (v) => deleteInitFn({ data: { id: v.id } }),
    onMutate: (v) =>
      optimistic((d) => {
        for (const s of d.okr_sets)
          for (const k of s.key_results)
            k.initiatives = k.initiatives.filter((i) => i.id !== v.id);
      }),
    onError: onErr,
    onSettled: invalidate,
  });


  const updateAlign = useMutation<
    unknown,
    Error,
    { id: string; patch: Partial<AlignmentRowDTO> },
    Ctx
  >({
    mutationFn: (v) => updateAlignFn({ data: { id: v.id, patch: v.patch as never, sourceLang } }),
    onMutate: (v) =>
      optimistic((d) => {
        const r = d.alignment_rows.find((x) => x.id === v.id);
        if (r) Object.assign(r, v.patch);
      }),
    onError: onErr,
    onSettled: invalidate,
  });

  const updatePillar = useMutation<
    unknown,
    Error,
    { code: Pillar; patch: Partial<PillarSummaryDTO> },
    Ctx
  >({
    mutationFn: (v) =>
      updatePillarFn({ data: { code: v.code, patch: v.patch as never, sourceLang } }),
    onMutate: (v) =>
      optimistic((d) => {
        const p = d.pillars.find((x) => x.code === v.code);
        if (p) Object.assign(p, v.patch);
      }),
    onError: onErr,
    onSettled: invalidate,
  });

  return {
    updateSet, addSet, deleteSet,
    addKr, updateKr, deleteKr,
    addInit, updateInit, deleteInit,
    updateAlign, updatePillar,
  };
}
type OkrMutations = ReturnType<typeof useOkrMutations>;

// ---------- Atoms ----------

function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full bg-white/10 p-0.5 text-[11px] font-semibold"
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            aria-label={LOCALE_LABELS[l]}
            className={cn(
              "inline-flex h-6 items-center rounded-full px-2.5 uppercase tracking-wider transition-colors",
              active
                ? "bg-white text-primary shadow-sm"
                : "text-white/80 hover:text-white",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function PillarChip({
  code, canEdit, onRemove,
}: {
  code: Pillar;
  canEdit: boolean;
  onRemove?: () => void;
}) {
  const { locale, t } = useLocale();
  return (
    <span
      role="img"
      aria-label={`${code} — ${pillarName(locale, code)}`}
      className="inline-flex h-7 items-center gap-1 rounded-full border border-[--color-chip-active-border] bg-white pl-3 pr-2 text-[11px] font-semibold tracking-wide text-primary"
    >
      {code}
      {canEdit && onRemove && (
        <button
          type="button"
          aria-label={`${t("tag.remove")} ${code}`}
          onClick={onRemove}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary/60 hover:bg-primary/10 hover:text-primary"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function PillarTagList({
  pillars, canEdit, onChange,
}: {
  pillars: Pillar[];
  canEdit: boolean;
  onChange: (next: Pillar[]) => void;
}) {
  const { locale, t } = useLocale();
  const available = PILLARS.filter((p) => !pillars.includes(p));
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {pillars.map((p) => (
        <PillarChip
          key={p}
          code={p}
          canEdit={canEdit}
          onRemove={() => onChange(pillars.filter((x) => x !== p))}
        />
      ))}
      {canEdit && available.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-border bg-white px-2.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/60 hover:text-primary transition-colors"
            >
              <Plus className="h-3 w-3" />
              {t("tag.add")}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[16rem]">
            {available.map((p) => (
              <DropdownMenuItem
                key={p}
                onSelect={() => onChange([...pillars, p])}
              >
                <span className="mr-2 font-semibold text-primary">{p}</span>
                <span className="text-muted-foreground">{pillarName(locale, p)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!canEdit && pillars.length === 0 && (
        <span className="text-xs text-muted-foreground">{t("tag.none")}</span>
      )}
    </div>
  );
}

function PillarDot({ code }: { code: Pillar }) {
  const bg =
    code === "SG"
      ? "var(--color-pillar-sg)"
      : code === "OE"
        ? "var(--color-pillar-oe)"
        : "var(--color-pillar-ce)";
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: bg }}
    >
      {code}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label mb-2">{children}</div>;
}

function RoleLabelSelect({
  value, canEdit, onChange,
}: {
  value: RoleLabel;
  canEdit: boolean;
  onChange: (v: RoleLabel) => void;
}) {
  if (!canEdit) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-white px-2 py-1 text-xs font-semibold text-primary">
        {value}
      </span>
    );
  }
  return (
    <span className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as RoleLabel)}
        className="appearance-none inline-flex items-center gap-1 rounded-md border border-primary/25 bg-white pl-2 pr-6 py-1 text-xs font-semibold text-primary cursor-pointer hover:bg-primary/5"
      >
        {ROLE_LABELS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-primary" />
    </span>
  );
}

// ---------- OKR card ----------

function OkrCard({
  set, canEdit, m,
}: {
  set: OkrSetDTO;
  canEdit: boolean;
  m: OkrMutations;
}) {
  const { locale, t } = useLocale();
  const [openKrId, setOpenKrId] = useState<string | null>(null);
  const openKr = openKrId
    ? set.key_results.find((k) => k.id === openKrId) ?? null
    : null;

  const updateSet = (patch: Partial<OkrSetDTO>) =>
    m.updateSet.mutate({ id: set.id, patch });

  const titleText = pickTranslation(set, "title", set.title, locale);
  const roleNameText = pickTranslation(set, "role_name", set.role_name, locale);
  const customerText = pickTranslation(set, "customer", set.customer, locale);
  const objectiveText = pickTranslation(set, "objective", set.objective, locale);
  const alignmentText = pickTranslation(set, "alignment", set.alignment, locale);

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {set.number}
          </span>
          <div>
            <EditableText
              as="h2"
              value={titleText}
              canEdit={canEdit}
              maxLength={LIMITS.title}
              onSave={(v) => updateSet({ title: v })}
              className="text-2xl font-bold text-foreground"
              placeholder="Untitled OKR"
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <RoleLabelSelect
                value={set.role_label}
                canEdit={canEdit}
                onChange={(v) => updateSet({ role_label: v })}
              />
              <span className="text-muted-foreground/60">:</span>
              <EditableText
                value={roleNameText}
                canEdit={canEdit}
                maxLength={LIMITS.roleName}
                onSave={(v) => updateSet({ role_name: v })}
                className="font-medium text-foreground"
                placeholder="Name"
              />
              <span className="ml-1 text-muted-foreground">{t("okr.customer")}</span>
              <EditableText
                value={customerText}
                canEdit={canEdit}
                maxLength={LIMITS.customer}
                onSave={(v) => updateSet({ customer: v })}
                className="font-medium text-foreground"
                placeholder="Customer"
              />
            </div>
          </div>
        </div>
        {canEdit && (
          <button
            type="button"
            aria-label={t("okr.delete")}
            onClick={() => {
              if (confirm(`${t("okr.deleteConfirm")}: "${titleText || "Untitled"}"?`))
                m.deleteSet.mutate({ id: set.id });
            }}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <PillarTagList
        pillars={set.pillars}
        canEdit={canEdit}
        onChange={(next) => updateSet({ pillars: next })}
      />

      <section className="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-5">
        <div className="eyebrow mb-2">{t("section.objective")}</div>
        <EditableText
          as="p"
          multiline
          value={objectiveText}
          canEdit={canEdit}
          maxLength={LIMITS.objective}
          onSave={(v) => updateSet({ objective: v })}
          className="text-[15px] font-semibold leading-relaxed text-foreground"
          placeholder="What outcome should this OKR create?"
        />
      </section>

      <section className="mt-6">
        <SectionLabel>{t("section.globalAlignment")}</SectionLabel>
        <EditableText
          as="p"
          multiline
          value={alignmentText}
          canEdit={canEdit}
          maxLength={LIMITS.alignment}
          onSave={(v) => updateSet({ alignment: v })}
          className="text-sm leading-relaxed text-muted-foreground"
          placeholder="How does this connect to the ICF Global focus areas?"
        />
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>{t("section.keyResults")}</SectionLabel>
          {canEdit && (
            <button
              type="button"
              onClick={() => m.addKr.mutate({ okr_set_id: set.id })}
              disabled={m.addKr.isPending}
              className="btn-mono inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
            >
              {t("okr.addKeyResult")}
            </button>
          )}
        </div>
        {set.key_results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-sm italic text-muted-foreground">
            {t("okr.noKeyResults")}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {set.key_results.map((r) => (
              <KrCard key={r.id} kr={r} onOpen={() => setOpenKrId(r.id)} />
            ))}
          </div>
        )}
      </section>

      <KrDetailSheet
        kr={openKr}
        canEdit={canEdit}
        m={m}
        onClose={() => setOpenKrId(null)}
      />
    </article>
  );
}

function KrCard({
  kr, onOpen,
}: {
  kr: KeyResultDTO;
  onOpen: () => void;
}) {
  const { locale, t } = useLocale();
  const count = kr.initiatives.length;
  const text = pickTranslation(kr, "text", kr.text, locale);
  const target = pickTranslation(kr, "target", kr.target, locale);
  const lead = pickTranslation(kr, "lead", kr.lead, locale);
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-border/70 bg-white p-4 text-left shadow-[0_1px_2px_rgba(20,20,60,0.03)] transition-all hover:border-primary/40 hover:shadow-[0_4px_16px_-8px_rgba(20,20,60,0.15)] has-[:focus-visible]:border-primary/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${t("kr.openDetails")} ${kr.kr || ""}: ${text || t("kr.noDescription")}`}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-6 items-center rounded-md bg-primary/10 px-2 text-[11px] font-bold text-primary">
          KR {kr.kr || "—"}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? t("kr.count.one") : t("kr.count.other")}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-foreground">
        {text || <span className="italic text-muted-foreground">{t("kr.noDescription")}</span>}
      </p>
      <dl className="mt-4 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 uppercase tracking-wider text-muted-foreground/80">{t("kr.target")}</dt>
          <dd className="min-w-0 flex-1 truncate text-foreground">
            {target || <span className="italic text-muted-foreground">—</span>}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 uppercase tracking-wider text-muted-foreground/80">{t("kr.lead")}</dt>
          <dd className="min-w-0 flex-1 truncate text-muted-foreground">
            {lead || <span className="italic">—</span>}
          </dd>
        </div>
      </dl>
      <span className="mt-3 inline-flex text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {t("kr.openDetails")}
      </span>
    </div>
  );
}

function KrDetailSheet({
  kr, canEdit, m, onClose,
}: {
  kr: KeyResultDTO | null;
  canEdit: boolean;
  m: OkrMutations;
  onClose: () => void;
}) {
  const { locale, t } = useLocale();
  const [initDraft, setInitDraft] = useState("");

  const submitInit = () => {
    if (!kr) return;
    const text = initDraft.trim();
    if (!text) return;
    m.addInit.mutate(
      { kr_id: kr.id, text },
      { onSuccess: () => setInitDraft("") },
    );
  };

  const update = (patch: Partial<KeyResultDTO>) => {
    if (!kr) return;
    m.updateKr.mutate({ id: kr.id, patch });
  };

  const krText = kr ? pickTranslation(kr, "text", kr.text, locale) : "";
  const krTarget = kr ? pickTranslation(kr, "target", kr.target, locale) : "";
  const krLead = kr ? pickTranslation(kr, "lead", kr.lead, locale) : "";

  return (
    <Sheet
      open={!!kr}
      onOpenChange={(open) => {
        if (!open) {
          setInitDraft("");
          onClose();
        }
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        {kr && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 items-center rounded-md bg-primary/10 px-2.5 text-xs font-bold text-primary">
                  KR {kr.kr || "—"}
                </span>
              </div>
              <SheetTitle className="text-left">
                <EditableText
                  multiline
                  value={krText}
                  canEdit={canEdit}
                  maxLength={LIMITS.krText}
                  onSave={(v) => update({ text: v })}
                  placeholder="Describe the key result…"
                  className="text-lg font-semibold leading-snug text-foreground"
                />
              </SheetTitle>
              <SheetDescription className="text-left">
                {t("kr.detailDescription")}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="section-label mb-1">{t("kr.target")}</div>
                <EditableText
                  value={krTarget}
                  canEdit={canEdit}
                  maxLength={LIMITS.target}
                  onSave={(v) => update({ target: v })}
                  placeholder={t("kr.target")}
                  className="text-sm text-foreground"
                />
              </div>
              <div>
                <div className="section-label mb-1">{t("kr.lead")}</div>
                <EditableText
                  value={krLead}
                  canEdit={canEdit}
                  maxLength={LIMITS.lead}
                  onSave={(v) => update({ lead: v })}
                  placeholder={t("kr.lead")}
                  className="text-sm text-muted-foreground"
                />
              </div>
              <div>
                <div className="section-label mb-1">{t("kr.number")}</div>
                <EditableText
                  value={kr.kr}
                  canEdit={canEdit}
                  maxLength={LIMITS.kr}
                  onSave={(v) => update({ kr: v })}
                  className="text-sm font-medium text-primary"
                />
              </div>
            </div>

            <section className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>{t("section.relatedInitiatives")}</SectionLabel>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {kr.initiatives.length}
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/70">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      <th className="py-2 pl-4 font-semibold">{t("initiative.header")}</th>
                      {canEdit && <th className="w-10" />}
                    </tr>
                  </thead>
                  <tbody>
                    {kr.initiatives.map((it, i) => (
                      <tr
                        key={it.id}
                        className={cn(
                          "border-t border-border/60 align-top",
                          i % 2 === 1 ? "bg-muted/20" : "bg-white",
                        )}
                      >
                        <td className="py-2.5 pl-4 pr-3 leading-relaxed text-foreground">
                          <EditableText
                            multiline
                            value={pickTranslation(it, "text", it.text, locale)}
                            canEdit={canEdit}
                            maxLength={LIMITS.initiative}
                            onSave={(v) => m.updateInit.mutate({ id: it.id, text: v })}
                          />
                        </td>
                        {canEdit && (
                          <td className="py-2.5 pr-3">
                            <button
                              type="button"
                              onClick={() => m.deleteInit.mutate({ id: it.id })}
                              aria-label={t("initiative.delete")}
                              className="rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {kr.initiatives.length === 0 && (
                      <tr>
                        <td
                          colSpan={canEdit ? 2 : 1}
                          className="py-3 pl-4 text-sm italic text-muted-foreground bg-white"
                        >
                          {t("initiative.none")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {canEdit && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={initDraft}
                    onChange={(e) => setInitDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitInit();
                      }
                    }}
                    maxLength={LIMITS.initiative}
                    placeholder={t("initiative.new")}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                  <button
                    type="button"
                    disabled={!initDraft.trim() || m.addInit.isPending}
                    onClick={submitInit}
                    className="btn-mono inline-flex h-10 items-center justify-center rounded-md border border-primary/25 bg-white px-4 hover:bg-primary/5 transition-colors disabled:opacity-50"
                  >
                    {t("initiative.add")}
                  </button>
                </div>
              )}
            </section>

            {canEdit && (
              <div className="mt-8 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t("kr.deleteConfirm"))) {
                      m.deleteKr.mutate({ id: kr.id });
                      onClose();
                    }
                  }}
                  className="text-xs font-medium text-destructive hover:underline"
                >
                  {t("kr.delete")}
                </button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}


// ---------- Alignment table ----------

function ContribCell({
  value, canEdit, onCycle, label,
}: {
  value: Contribution;
  canEdit: boolean;
  onCycle: () => void;
  label: string;
}) {
  const dots =
    value === "none" ? (
      <span className="text-muted-foreground/40" aria-hidden="true">—</span>
    ) : (
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        {value === "primary" && (
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        )}
      </span>
    );
  const a11yLabel = `${label}: ${value} contribution`;
  if (!canEdit) {
    return (
      <span role="img" aria-label={a11yLabel}>
        {dots}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`${a11yLabel}. Click to cycle`}
      title="Click to cycle: none → secondary → primary"
      className="rounded-sm px-1 py-0.5 hover:bg-primary/5"
    >
      {dots}
    </button>
  );
}

function AlignmentTable({
  rows, canEdit, m,
}: {
  rows: AlignmentRowDTO[];
  canEdit: boolean;
  m: OkrMutations;
}) {
  const { locale, t } = useLocale();
  const cycle = (curr: Contribution): Contribution =>
    CONTRIBUTION_CYCLE[(CONTRIBUTION_CYCLE.indexOf(curr) + 1) % 3];

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
      <h2 className="text-2xl font-bold text-foreground">{t("section.alignmentTitle")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("section.alignmentIntro")}{" "}
        <span className="inline-flex items-center gap-1 align-middle">
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        </span>{" "}
        {t("section.alignmentPrimary")}{" "}
        <span className="inline-flex items-center align-middle">
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        </span>{" "}
        {t("section.alignmentSecondary")}
        {canEdit && (
          <span className="ml-1 text-muted-foreground/70">
            {t("section.alignmentCycleHint")}
          </span>
        )}
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="py-3 pl-4 font-semibold">{t("section.alignmentPillar")}</th>
              <th className="w-20 py-3 font-semibold">SG</th>
              <th className="w-20 py-3 font-semibold">OE</th>
              <th className="w-20 py-3 font-semibold">CE</th>
              <th className="py-3 pr-4 font-semibold">{t("section.alignmentHow")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pillarText = pickTranslation(row, "pillar", row.pillar, locale);
              const howText = pickTranslation(row, "how", row.how, locale);
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-border/60 align-top",
                    i % 2 === 1 ? "bg-muted/20" : "bg-white",
                  )}
                >
                  <td className="py-4 pl-4 font-semibold text-foreground">
                    <EditableText
                      value={pillarText}
                      canEdit={canEdit}
                      maxLength={LIMITS.alignmentPillar}
                      onSave={(v) => m.updateAlign.mutate({ id: row.id, patch: { pillar: v } })}
                    />
                  </td>
                  {(["sg", "oe", "ce"] as const).map((col) => (
                    <td key={col} className="py-4">
                      <ContribCell
                        value={row[col]}
                        canEdit={canEdit}
                        label={`${pillarText} → ${col.toUpperCase()}`}
                        onCycle={() =>
                          m.updateAlign.mutate({ id: row.id, patch: { [col]: cycle(row[col]) } })
                        }
                      />
                    </td>
                  ))}
                  <td className="py-4 pr-4 leading-relaxed text-muted-foreground">
                    <EditableText
                      multiline
                      value={howText}
                      canEdit={canEdit}
                      maxLength={LIMITS.alignmentHow}
                      onSave={(v) => m.updateAlign.mutate({ id: row.id, patch: { how: v } })}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

// ---------- Page ----------

function Index() {
  return (
    <IndexSuspense />
  );
}

function IndexSuspense() {
  const { t } = useLocale();
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">{t("common.loading")}</div>}>
      <IndexContent />
    </Suspense>
  );
}

function IndexContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { canEdit } = useAuth();
  const { locale, t } = useLocale();
  const m = useOkrMutations(locale);

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-8 pt-6 pb-14">
          <div className="flex items-start justify-between gap-4 mb-6">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-20 w-auto -ml-3 -mt-2"
            />
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="eyebrow !text-accent">{t("hero.eyebrow")}</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {t("hero.title")}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                {t("hero.subtitle")}
              </p>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => m.addSet.mutate()}
                disabled={m.addSet.isPending}
                className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 !text-primary shadow-sm hover:shadow transition-shadow disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> {t("hero.addOkrSet")}
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-8 max-w-6xl px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((code) => {
            const p =
              data.pillars.find((x) => x.code === code) ??
              ({ code, label: code, description: "" } as PillarSummaryDTO);
            const labelText = pickTranslation(p, "label", p.label, locale);
            const descText = pickTranslation(p, "description", p.description, locale);
            return (
              <div
                key={code}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <PillarDot code={code} />
                  <EditableText
                    as="h2"
                    value={labelText}
                    canEdit={canEdit}
                    maxLength={LIMITS.pillarLabel}
                    onSave={(v) => m.updatePillar.mutate({ code, patch: { label: v } })}
                    className="text-[15px] font-semibold text-foreground"
                  />
                </div>
                <EditableText
                  as="p"
                  multiline
                  value={descText}
                  canEdit={canEdit}
                  maxLength={LIMITS.pillarDescription}
                  onSave={(v) =>
                    m.updatePillar.mutate({ code, patch: { description: v } })
                  }
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-8 py-12">
        {data.okr_sets.map((set) => (
          <OkrCard key={set.id} set={set} canEdit={canEdit} m={m} />
        ))}
        {canEdit && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => m.addSet.mutate()}
              disabled={m.addSet.isPending}
              className="btn-mono inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-5 py-2.5 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> {t("okr.addOkrSet")}
            </button>
          </div>
        )}
        <AlignmentTable rows={data.alignment_rows} canEdit={canEdit} m={m} />
      </section>
    </main>
  );
}
