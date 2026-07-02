import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getDashboard,
  updateInitiative,
} from "@/lib/okr.functions";
import {
  INITIATIVE_STATUSES,
  LIMITS,
  type DashboardDTO,
  type InitiativeDTO,
  type InitiativeStatus,
  type OkrSetDTO,
} from "@/lib/okr-schemas";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n-shared";
import { pickTranslation, useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { EditableText } from "@/components/okr/EditableText";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { NewInitiativeDialog } from "@/components/okr/NewInitiativeDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"] as const,
  queryFn: () => getDashboard(),
});

export const Route = createFileRoute("/initiatives")({
  head: () => ({
    meta: [
      { title: "Initiative Portfolio — ICF Switzerland" },
      {
        name: "description",
        content:
          "Kanban view of all ICF Switzerland initiatives grouped by status: Planned, In Progress, Done, Canceled.",
      },
      { property: "og:title", content: "Initiative Portfolio — ICF Switzerland" },
      {
        property: "og:description",
        content: "All initiatives across the 2026 OKRs, grouped by status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: InitiativesPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

// ---------- Language switcher (matches / route) ----------

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
              active ? "bg-white text-primary shadow-sm" : "text-white/80 hover:text-white",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Status metadata ----------

const STATUS_ACCENT: Record<InitiativeStatus, string> = {
  planned: "border-l-slate-400",
  in_progress: "border-l-primary",
  done: "border-l-emerald-500",
  canceled: "border-l-muted-foreground/50",
};
const STATUS_DOT: Record<InitiativeStatus, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-primary",
  done: "bg-emerald-500",
  canceled: "bg-muted-foreground/50",
};
const STATUS_KEY: Record<InitiativeStatus, StringKey> = {
  planned: "initiatives.status.planned",
  in_progress: "initiatives.status.in_progress",
  done: "initiatives.status.done",
  canceled: "initiatives.status.canceled",
};

// ---------- Page ----------

function InitiativesPage() {
  return (
    <Suspense fallback={<InitiativesFallback />}>
      <InitiativesContent />
    </Suspense>
  );
}

function InitiativesFallback() {
  const { t } = useLocale();
  return <div className="p-8 text-sm text-muted-foreground">{t("common.loading")}</div>;
}

type FlatInitiative = InitiativeDTO & {
  okrTitle: string;
  okrId: string;
  okrNumber: number;
  krLabel: string;
};

function InitiativesContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { canEdit } = useAuth();
  const { locale, t } = useLocale();

  const [okrFilter, setOkrFilter] = useState<string>("all");
  const [krFilter, setKrFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const flat: FlatInitiative[] = useMemo(() => {
    const rows: FlatInitiative[] = [];
    for (const set of data.okr_sets) {
      const okrTitle = pickTranslation(set, "title", set.title, locale);
      for (const kr of set.key_results) {
        for (const it of kr.initiatives) {
          rows.push({
            ...it,
            okrTitle,
            okrId: set.id,
            okrNumber: set.number,
            krLabel: kr.kr || "—",
          });
        }
      }
    }
    return rows;
  }, [data, locale]);

  // Reset KR filter when OKR filter changes and current KR isn't in scope.
  const krsForFilter = useMemo(() => {
    if (okrFilter === "all") {
      return data.okr_sets.flatMap((s) => s.key_results.map((k) => ({ id: k.id, kr: k.kr })));
    }
    const set = data.okr_sets.find((s) => s.id === okrFilter);
    return set ? set.key_results.map((k) => ({ id: k.id, kr: k.kr })) : [];
  }, [data, okrFilter]);

  const filtered = flat.filter((it) => {
    if (okrFilter !== "all" && it.okr_set_id !== okrFilter) return false;
    if (krFilter !== "all" && it.kr_id !== krFilter) return false;
    return true;
  });

  const byStatus: Record<InitiativeStatus, FlatInitiative[]> = {
    planned: [],
    in_progress: [],
    done: [],
    canceled: [],
  };
  for (const it of filtered) byStatus[it.status].push(it);

  const updateInitFn = useServerFn(updateInitiative);
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });

  const updateInit = useMutation<
    unknown,
    Error,
    { id: string; patch: Partial<Pick<InitiativeDTO, "text" | "owner" | "description" | "status">> },
    { prev: DashboardDTO | undefined }
  >({
    mutationFn: (v) =>
      updateInitFn({ data: { id: v.id, patch: v.patch, sourceLang: locale } }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["dashboard"] });
      const prev = qc.getQueryData<DashboardDTO>(["dashboard"]);
      if (prev) {
        const next = structuredClone(prev);
        for (const s of next.okr_sets)
          for (const k of s.key_results) {
            const it = k.initiatives.find((i) => i.id === v.id);
            if (it) Object.assign(it, v.patch);
          }
        qc.setQueryData(["dashboard"], next);
      }
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
      toast.error(e instanceof Error ? e.message : "Save failed");
    },
    onSettled: invalidate,
  });

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-7xl px-8 pt-6 pb-14">
          <div className="mb-6 flex items-start justify-between gap-4">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-20 w-auto -ml-3 -mt-2"
            />
            <div className="flex items-center gap-3">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow !text-accent">{t("hero.eyebrow")}</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {t("initiatives.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
              {t("initiatives.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-8 max-w-7xl px-8">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]">
          <div className="flex flex-wrap items-center gap-3">
            <FilterBlock label={t("initiatives.filterOkr")}>
              <Select
                value={okrFilter}
                onValueChange={(v) => {
                  setOkrFilter(v);
                  setKrFilter("all");
                }}
              >
                <SelectTrigger className="h-9 w-[240px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("initiatives.filterAllOkrs")}</SelectItem>
                  {data.okr_sets.map((s: OkrSetDTO) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.number}. {pickTranslation(s, "title", s.title, locale) || "Untitled"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBlock>
            <FilterBlock label={t("initiatives.filterKr")}>
              <Select value={krFilter} onValueChange={setKrFilter}>
                <SelectTrigger className="h-9 w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("initiatives.filterAllKrs")}</SelectItem>
                  {krsForFilter.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      KR {k.kr || "—"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBlock>
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} / {flat.length}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {INITIATIVE_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              items={byStatus[status]}
              canEdit={canEdit}
              onUpdate={(id, patch) => updateInit.mutate({ id, patch })}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary hover:underline">
            ← {t("nav.okrs")}
          </Link>
        </p>
      </section>
    </main>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function KanbanColumn({
  status,
  items,
  canEdit,
  onUpdate,
}: {
  status: InitiativeStatus;
  items: FlatInitiative[];
  canEdit: boolean;
  onUpdate: (
    id: string,
    patch: Partial<Pick<InitiativeDTO, "text" | "owner" | "description" | "status">>,
  ) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col rounded-2xl bg-muted/40 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[status])} aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">{t(STATUS_KEY[status])}</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{items.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-white/40 px-3 py-6 text-center text-xs italic text-muted-foreground">
            {t("initiatives.emptyColumn")}
          </div>
        ) : (
          items.map((it) => (
            <InitiativeCard key={it.id} item={it} canEdit={canEdit} onUpdate={onUpdate} />
          ))
        )}
      </div>
    </div>
  );
}

function InitiativeCard({
  item,
  canEdit,
  onUpdate,
}: {
  item: FlatInitiative;
  canEdit: boolean;
  onUpdate: (
    id: string,
    patch: Partial<Pick<InitiativeDTO, "text" | "owner" | "description" | "status">>,
  ) => void;
}) {
  const { locale, t } = useLocale();
  const title = pickTranslation(item, "text", item.text, locale);
  const owner = pickTranslation(item, "owner", item.owner, locale);
  const description = pickTranslation(item, "description", item.description, locale);

  return (
    <article
      className={cn(
        "rounded-xl border border-border/70 border-l-4 bg-white p-3 shadow-[0_1px_2px_rgba(20,20,60,0.03)] transition-shadow hover:shadow-[0_4px_16px_-8px_rgba(20,20,60,0.15)]",
        STATUS_ACCENT[item.status],
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
          {item.okrNumber}.{item.krLabel.includes(".") ? item.krLabel.split(".")[1] : item.krLabel}
        </span>
        <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {item.okrTitle}
        </span>
      </div>

      <EditableText
        multiline
        value={title}
        canEdit={canEdit}
        maxLength={LIMITS.initiative}
        onSave={(v) => onUpdate(item.id, { text: v })}
        placeholder={t("initiative.new")}
        className="block text-sm font-semibold leading-snug text-foreground"
      />

      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground/80">{t("initiatives.owner")}:</span>
        <EditableText
          value={owner}
          canEdit={canEdit}
          maxLength={LIMITS.initiativeOwner}
          onSave={(v) => onUpdate(item.id, { owner: v })}
          placeholder={t("initiatives.addOwner")}
          className="min-w-0 flex-1 truncate font-medium text-foreground"
        />
      </div>

      <EditableText
        multiline
        as="p"
        value={description}
        canEdit={canEdit}
        maxLength={LIMITS.initiativeDescription}
        onSave={(v) => onUpdate(item.id, { description: v })}
        placeholder={t("initiatives.addDescription")}
        className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted-foreground"
      />

      <div className="mt-3 border-t border-border/50 pt-2">
        {canEdit ? (
          <Select
            value={item.status}
            onValueChange={(v) => onUpdate(item.id, { status: v as InitiativeStatus })}
          >
            <SelectTrigger className="h-7 w-full text-xs" aria-label={t("initiatives.status")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INITIATIVE_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} aria-hidden />
                    {t(STATUS_KEY[s])}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[item.status])} aria-hidden />
            {t(STATUS_KEY[item.status])}
          </span>
        )}
      </div>
    </article>
  );
}
