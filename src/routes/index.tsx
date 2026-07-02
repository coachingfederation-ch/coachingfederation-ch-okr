import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
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
import { EditableText } from "@/components/okr/EditableText";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"],
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

// ---- Mutations helper ----
function useDashboardMutations() {
  const qc = useQueryClient();
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

  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });
  const onErr = (e: unknown) =>
    toast.error(e instanceof Error ? e.message : "Save failed");

  const optimistic = <T,>(mutator: (draft: DashboardDTO) => void, run: () => Promise<T>) =>
    useMutation({
      mutationFn: run,
      onMutate: async () => {
        await qc.cancelQueries({ queryKey: ["dashboard"] });
        const prev = qc.getQueryData<DashboardDTO>(["dashboard"]);
        if (prev) {
          const next = structuredClone(prev);
          mutator(next);
          qc.setQueryData(["dashboard"], next);
        }
        return { prev };
      },
      onError: (err, _v, ctx) => {
        if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
        onErr(err);
      },
      onSettled: invalidate,
    });

  return {
    updateOkrSet: (id: string, patch: Partial<OkrSetDTO>) =>
      optimistic(
        (d) => {
          const s = d.okr_sets.find((x) => x.id === id);
          if (s) Object.assign(s, patch);
        },
        () => updateOkrSetFn({ data: { id, patch: patch as never } }),
      ),
    addOkrSet: () =>
      useMutation({
        mutationFn: () => addOkrSetFn({}),
        onError: onErr,
        onSuccess: invalidate,
      }),
    deleteOkrSet: (id: string) =>
      optimistic(
        (d) => {
          d.okr_sets = d.okr_sets.filter((x) => x.id !== id);
        },
        () => deleteOkrSetFn({ data: { id } }),
      ),
    addKeyResult: (okr_set_id: string) =>
      useMutation({
        mutationFn: () => addKrFn({ data: { okr_set_id } }),
        onError: onErr,
        onSuccess: invalidate,
      }),
    updateKeyResult: (id: string, patch: Partial<KeyResultDTO>) =>
      optimistic(
        (d) => {
          for (const s of d.okr_sets) {
            const kr = s.key_results.find((k) => k.id === id);
            if (kr) Object.assign(kr, patch);
          }
        },
        () => updateKrFn({ data: { id, patch: patch as never } }),
      ),
    deleteKeyResult: (id: string) =>
      optimistic(
        (d) => {
          for (const s of d.okr_sets)
            s.key_results = s.key_results.filter((k) => k.id !== id);
        },
        () => deleteKrFn({ data: { id } }),
      ),
    addInitiative: (okr_set_id: string, text: string) =>
      useMutation({
        mutationFn: () => addInitFn({ data: { okr_set_id, text } }),
        onError: onErr,
        onSuccess: invalidate,
      }),
    updateInitiative: (id: string, text: string) =>
      optimistic(
        (d) => {
          for (const s of d.okr_sets) {
            const it = s.initiatives.find((i) => i.id === id);
            if (it) it.text = text;
          }
        },
        () => updateInitFn({ data: { id, patch: { text } } }),
      ),
    deleteInitiative: (id: string) =>
      optimistic(
        (d) => {
          for (const s of d.okr_sets)
            s.initiatives = s.initiatives.filter((i) => i.id !== id);
        },
        () => deleteInitFn({ data: { id } }),
      ),
    updateAlignmentRow: (id: string, patch: Partial<AlignmentRowDTO>) =>
      optimistic(
        (d) => {
          const r = d.alignment_rows.find((x) => x.id === id);
          if (r) Object.assign(r, patch);
        },
        () => updateAlignFn({ data: { id, patch: patch as never } }),
      ),
    updatePillarSummary: (code: Pillar, patch: Partial<PillarSummaryDTO>) =>
      optimistic(
        (d) => {
          const p = d.pillars.find((x) => x.code === code);
          if (p) Object.assign(p, patch);
        },
        () => updatePillarFn({ data: { code, patch: patch as never } }),
      ),
  };
}

// ---- Atoms ----

function PillarChip({
  code,
  active,
  canEdit,
  onToggle,
}: {
  code: Pillar;
  active: boolean;
  canEdit: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!canEdit}
      onClick={onToggle}
      className={cn(
        "inline-flex h-7 min-w-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold tracking-wide transition-colors",
        active
          ? "border-[--color-chip-active-border] bg-white text-primary"
          : "border-border bg-white text-muted-foreground",
        canEdit ? "hover:bg-primary/5 cursor-pointer" : "cursor-default",
      )}
    >
      {code}
    </button>
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

// ---- OKR card ----

function OkrCard({
  set,
  canEdit,
  m,
}: {
  set: OkrSetDTO;
  canEdit: boolean;
  m: ReturnType<typeof useDashboardMutations>;
}) {
  const deleteSet = m.deleteOkrSet(set.id);
  const updateSet = (patch: Partial<OkrSetDTO>) => m.updateOkrSet(set.id, patch).mutate();
  const addKr = m.addKeyResult(set.id);
  const [initDraft, setInitDraft] = useInitDraft();
  const addInit = m.addInitiative(set.id, initDraft);

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
              value={set.title}
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
                value={set.role_name}
                canEdit={canEdit}
                maxLength={LIMITS.roleName}
                onSave={(v) => updateSet({ role_name: v })}
                className="font-medium text-foreground"
                placeholder="Name"
              />
              <span className="ml-1 text-muted-foreground">Customer:</span>
              <EditableText
                value={set.customer}
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
            aria-label="Delete OKR set"
            onClick={() => {
              if (confirm(`Delete OKR set "${set.title}"?`)) deleteSet.mutate();
            }}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="mt-4 flex gap-2">
        {PILLARS.map((p) => (
          <PillarChip
            key={p}
            code={p}
            active={set.pillars.includes(p)}
            canEdit={canEdit}
            onToggle={() => {
              const next = set.pillars.includes(p)
                ? set.pillars.filter((x) => x !== p)
                : [...set.pillars, p];
              updateSet({ pillars: next });
            }}
          />
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-5">
        <div className="eyebrow mb-2">Objective</div>
        <EditableText
          as="p"
          multiline
          value={set.objective}
          canEdit={canEdit}
          maxLength={LIMITS.objective}
          onSave={(v) => updateSet({ objective: v })}
          className="text-[15px] font-semibold leading-relaxed text-foreground"
          placeholder="What outcome should this OKR create?"
        />
      </section>

      <section className="mt-6">
        <SectionLabel>Global alignment</SectionLabel>
        <EditableText
          as="p"
          multiline
          value={set.alignment}
          canEdit={canEdit}
          maxLength={LIMITS.alignment}
          onSave={(v) => updateSet({ alignment: v })}
          className="text-sm leading-relaxed text-muted-foreground"
          placeholder="How does this connect to the ICF Global focus areas?"
        />
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Key results</SectionLabel>
          {canEdit && (
            <button
              type="button"
              onClick={() => addKr.mutate()}
              className="btn-mono inline-flex items-center gap-1 text-primary hover:underline"
            >
              + Add key result
            </button>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="w-16 py-3 pl-4 font-semibold">KR</th>
                <th className="py-3 font-semibold">Key result</th>
                <th className="w-56 py-3 font-semibold">Target</th>
                <th className="w-32 py-3 font-semibold">Lead</th>
                {canEdit && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {set.key_results.map((r, i) => (
                <KeyResultRow
                  key={r.id}
                  kr={r}
                  striped={i % 2 === 1}
                  canEdit={canEdit}
                  m={m}
                />
              ))}
              {set.key_results.length === 0 && (
                <tr>
                  <td
                    colSpan={canEdit ? 5 : 4}
                    className="py-4 pl-4 text-sm text-muted-foreground italic"
                  >
                    No key results yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <SectionLabel>Related projects &amp; initiatives</SectionLabel>
          {set.initiatives.length > 0 && (
            <ul className="mb-3 space-y-2">
              {set.initiatives.map((it) => (
                <InitiativeRow key={it.id} init={it} canEdit={canEdit} m={m} />
              ))}
            </ul>
          )}
          {canEdit && (
            <div className="flex gap-2">
              <input
                type="text"
                value={initDraft}
                onChange={(e) => setInitDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && initDraft.trim()) {
                    e.preventDefault();
                    addInit.mutate(undefined, {
                      onSuccess: () => setInitDraft(""),
                    });
                  }
                }}
                maxLength={LIMITS.initiative}
                placeholder="New project or initiative…"
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                disabled={!initDraft.trim() || addInit.isPending}
                onClick={() =>
                  addInit.mutate(undefined, { onSuccess: () => setInitDraft("") })
                }
                className="btn-mono inline-flex h-10 items-center justify-center rounded-md border border-primary/25 bg-white px-4 hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div>
          <SectionLabel>Team members</SectionLabel>
          <p className="text-xs text-muted-foreground">
            Coming soon — track owners per key result via the Lead column above.
          </p>
        </div>
      </section>
    </article>
  );
}

function useInitDraft() {
  return [useDraftState(), null] as unknown as [
    string,
    (v: string) => void,
  ] extends never
    ? never
    : ReturnType<typeof useDraftState>;
}
// Small state helper so we don't repeat useState boilerplate
function useDraftState() {
  // biome-ignore lint: intentional
  const s = require("react") as typeof import("react");
  return s.useState("");
}

function KeyResultRow({
  kr,
  striped,
  canEdit,
  m,
}: {
  kr: KeyResultDTO;
  striped: boolean;
  canEdit: boolean;
  m: ReturnType<typeof useDashboardMutations>;
}) {
  const del = m.deleteKeyResult(kr.id);
  const update = (patch: Partial<KeyResultDTO>) =>
    m.updateKeyResult(kr.id, patch).mutate();
  return (
    <tr
      className={cn(
        "border-t border-border/60 align-top",
        striped ? "bg-muted/20" : "bg-white",
      )}
    >
      <td className="py-3 pl-4 text-primary/80 font-medium">
        <EditableText
          value={kr.kr}
          canEdit={canEdit}
          maxLength={LIMITS.kr}
          onSave={(v) => update({ kr: v })}
        />
      </td>
      <td className="py-3 pr-4 leading-relaxed text-foreground">
        <EditableText
          multiline
          value={kr.text}
          canEdit={canEdit}
          maxLength={LIMITS.krText}
          onSave={(v) => update({ text: v })}
          placeholder="Describe the key result…"
        />
      </td>
      <td className="py-3 pr-4 text-foreground">
        <EditableText
          value={kr.target}
          canEdit={canEdit}
          maxLength={LIMITS.target}
          onSave={(v) => update({ target: v })}
          placeholder="Target"
        />
      </td>
      <td className="py-3 pr-4 text-muted-foreground">
        <EditableText
          value={kr.lead}
          canEdit={canEdit}
          maxLength={LIMITS.lead}
          onSave={(v) => update({ lead: v })}
          placeholder="Lead"
        />
      </td>
      {canEdit && (
        <td className="py-3 pr-4 text-muted-foreground">
          <button
            type="button"
            onClick={() => del.mutate()}
            aria-label="Delete key result"
            className="rounded-sm p-0.5 hover:bg-muted hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </td>
      )}
    </tr>
  );
}

function InitiativeRow({
  init,
  canEdit,
  m,
}: {
  init: InitiativeDTO;
  canEdit: boolean;
  m: ReturnType<typeof useDashboardMutations>;
}) {
  const del = m.deleteInitiative(init.id);
  return (
    <li className="flex items-start justify-between gap-3 text-sm text-foreground">
      <span className="flex items-start gap-2 flex-1">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <EditableText
          className="flex-1"
          multiline
          value={init.text}
          canEdit={canEdit}
          maxLength={LIMITS.initiative}
          onSave={(v) => m.updateInitiative(init.id, v).mutate()}
        />
      </span>
      {canEdit && (
        <button
          type="button"
          onClick={() => del.mutate()}
          aria-label="Delete initiative"
          className="mt-1 rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );
}

function RoleLabelSelect({
  value,
  canEdit,
  onChange,
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
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-primary" />
    </span>
  );
}

// ---- Alignment table ----

function ContribCell({
  value,
  canEdit,
  onCycle,
}: {
  value: Contribution;
  canEdit: boolean;
  onCycle: () => void;
}) {
  const inner =
    value === "none" ? (
      <span className="text-muted-foreground/40">—</span>
    ) : (
      <span className="inline-flex items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        {value === "primary" && (
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        )}
      </span>
    );
  if (!canEdit) return inner;
  return (
    <button
      type="button"
      onClick={onCycle}
      title="Click to cycle: none → secondary → primary"
      className="rounded-sm px-1 py-0.5 hover:bg-primary/5"
    >
      {inner}
    </button>
  );
}

function AlignmentTable({
  rows,
  canEdit,
  m,
}: {
  rows: AlignmentRowDTO[];
  canEdit: boolean;
  m: ReturnType<typeof useDashboardMutations>;
}) {
  const cycle = (curr: Contribution): Contribution =>
    CONTRIBUTION_CYCLE[(CONTRIBUTION_CYCLE.indexOf(curr) + 1) % 3];

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
      <h2 className="text-2xl font-bold text-foreground">Global alignment analysis</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        How each ICFS pillar contributes to the three ICF Global 2026–2029 focus areas.{" "}
        <span className="inline-flex items-center gap-1 align-middle">
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        </span>{" "}
        = primary contribution,{" "}
        <span className="inline-flex items-center align-middle">
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
        </span>{" "}
        = secondary contribution.
        {canEdit && (
          <span className="ml-1 text-muted-foreground/70">
            Click a dot cell to cycle none → secondary → primary.
          </span>
        )}
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="py-3 pl-4 font-semibold">ICFS pillar</th>
              <th className="w-20 py-3 font-semibold">SG</th>
              <th className="w-20 py-3 font-semibold">OE</th>
              <th className="w-20 py-3 font-semibold">CE</th>
              <th className="py-3 pr-4 font-semibold">How it contributes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  "border-t border-border/60 align-top",
                  i % 2 === 1 ? "bg-muted/20" : "bg-white",
                )}
              >
                <td className="py-4 pl-4 font-semibold text-foreground">
                  <EditableText
                    value={row.pillar}
                    canEdit={canEdit}
                    maxLength={LIMITS.alignmentPillar}
                    onSave={(v) => m.updateAlignmentRow(row.id, { pillar: v }).mutate()}
                  />
                </td>
                {(["sg", "oe", "ce"] as const).map((col) => (
                  <td key={col} className="py-4">
                    <ContribCell
                      value={row[col]}
                      canEdit={canEdit}
                      onCycle={() =>
                        m.updateAlignmentRow(row.id, { [col]: cycle(row[col]) }).mutate()
                      }
                    />
                  </td>
                ))}
                <td className="py-4 pr-4 leading-relaxed text-muted-foreground">
                  <EditableText
                    multiline
                    value={row.how}
                    canEdit={canEdit}
                    maxLength={LIMITS.alignmentHow}
                    onSave={(v) => m.updateAlignmentRow(row.id, { how: v }).mutate()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

// ---- Page ----

function Index() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <IndexContent />
    </Suspense>
  );
}

function IndexContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { canEdit } = useAuth();
  const m = useDashboardMutations();
  const addSet = m.addOkrSet();

  return (
    <main className="min-h-screen">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-8 pt-6 pb-14">
          <div className="flex items-center justify-end mb-6">
            <AuthBadge />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="eyebrow !text-accent">ICF Switzerland · OKR Dashboard</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                2026 OKRs with Global Alignment
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                One inspiring, customer-centric objective per strategic pillar —
                aligned to the ICF Global Strategic Plan 2026–2029 and the Arbon board
                retreat, 1 June 2026.
              </p>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => addSet.mutate()}
                disabled={addSet.isPending}
                className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 !text-primary shadow-sm hover:shadow transition-shadow disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Add OKR set
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
            return (
              <div
                key={code}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <PillarDot code={code} />
                  <EditableText
                    as="h3"
                    value={p.label}
                    canEdit={canEdit}
                    maxLength={LIMITS.pillarLabel}
                    onSave={(v) => m.updatePillarSummary(code, { label: v }).mutate()}
                    className="text-[15px] font-semibold text-foreground"
                  />
                </div>
                <EditableText
                  as="p"
                  multiline
                  value={p.description}
                  canEdit={canEdit}
                  maxLength={LIMITS.pillarDescription}
                  onSave={(v) =>
                    m.updatePillarSummary(code, { description: v }).mutate()
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
              onClick={() => addSet.mutate()}
              disabled={addSet.isPending}
              className="btn-mono inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-5 py-2.5 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add OKR set
            </button>
          </div>
        )}
        <AlignmentTable rows={data.alignment_rows} canEdit={canEdit} m={m} />
      </section>
    </main>
  );
}
