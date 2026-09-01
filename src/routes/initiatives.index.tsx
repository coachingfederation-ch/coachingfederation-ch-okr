import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";

import { getDashboard } from "@/lib/okr.functions";
import {
  INITIATIVE_KINDS,
  INITIATIVE_STATUSES,
  type InitiativeStatus,
  type OkrSetDTO,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { WorkJourney } from "@/components/okr/WorkJourney";
import { WorkCard } from "@/components/okr/WorkCard";
import { KIND_PLURAL_KEY } from "@/components/okr/work-meta";
import type { FlatInitiative } from "@/components/okr/initiative-meta";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { HeaderControls } from "@/components/okr/HeaderControls";

const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"] as const,
  queryFn: () => getDashboard(),
});

export const Route = createFileRoute("/initiatives/")({
  head: () => ({
    meta: [
      { title: "Initiative Portfolio — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "Ideas, simple tasks and initiatives across the chapter's OKRs, grouped by team and tracked in 90-day legs.",
      },
      {
        property: "og:title",
        content: "Initiative Portfolio — The Switzerland Chapter of ICF",
      },
      {
        property: "og:description",
        content: "Ideas, simple tasks and initiatives grouped by team and status.",
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

const STATUS_DOT: Record<InitiativeStatus, string> = {
  planned: "bg-muted-foreground/40",
  in_progress: "bg-highlight",
  done: "bg-primary",
  canceled: "bg-border",
};
const STATUS_KEY: Record<InitiativeStatus, StringKey> = {
  planned: "initiatives.status.planned",
  in_progress: "initiatives.status.in_progress",
  done: "initiatives.status.done",
  canceled: "initiatives.status.canceled",
};

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

function InitiativesContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { canEdit } = useAuth();
  const { locale, t } = useLocale();

  const [okrFilter, setOkrFilter] = useState<string>("all");
  const [krFilter, setKrFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [showCommunities, setShowCommunities] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Teams mirror the Welcome app's operational structure. Communities live in
  // the same structure but are not delivery teams, so they stay out of the way
  // unless someone asks for them.
  const teams = useMemo(
    () => data.teams.filter((team) => showCommunities || !team.is_community),
    [data.teams, showCommunities],
  );

  const teamNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of data.teams) {
      map.set(team.id, pickTranslation(team, "name", team.name, locale) || team.name);
    }
    return map;
  }, [data.teams, locale]);

  const flat: FlatInitiative[] = useMemo(() => {
    // An initiative can serve several key results (one primary + secondary
    // links), so every link is surfaced on the card to keep the portfolio and
    // the OKR page telling the same story.
    const krLabelById = new Map<string, string>();
    for (const set of data.okr_sets) {
      for (const kr of set.key_results) {
        krLabelById.set(kr.id, kr.kr || `${set.number}`);
      }
    }
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
            secondaryLabels: (it.secondary_kr_ids ?? [])
              .map((id) => krLabelById.get(id))
              .filter((v): v is string => !!v),
            teamName: it.team_id ? (teamNameById.get(it.team_id) ?? null) : null,
          });
        }
      }
    }
    return rows;
  }, [data, locale, teamNameById]);

  const krsForFilter = useMemo(() => {
    if (okrFilter === "all") {
      return data.okr_sets.flatMap((s) => s.key_results.map((k) => ({ id: k.id, kr: k.kr })));
    }
    const set = data.okr_sets.find((s) => s.id === okrFilter);
    return set ? set.key_results.map((k) => ({ id: k.id, kr: k.kr })) : [];
  }, [data, okrFilter]);

  const filtered = flat.filter((it) => {
    if (kindFilter !== "all" && it.kind !== kindFilter) return false;
    if (teamFilter !== "all") {
      if (teamFilter === "none" ? !!it.team_id : it.team_id !== teamFilter) return false;
    }
    if (krFilter !== "all") {
      return it.kr_id === krFilter || (it.secondary_kr_ids ?? []).includes(krFilter);
    }
    if (okrFilter !== "all" && it.okr_set_id !== okrFilter) return false;
    return true;
  });

  // Grouped by team first — the chapter organises its work by who carries it —
  // then stacked by status inside each team so progress stays scannable.
  const groups = useMemo(() => {
    const byTeam = new Map<string, FlatInitiative[]>();
    for (const it of filtered) {
      const key = it.team_id ?? "none";
      const arr = byTeam.get(key) ?? [];
      arr.push(it);
      byTeam.set(key, arr);
    }
    const ordered: { id: string; label: string; items: FlatInitiative[] }[] = [];
    // Visible teams keep the structure's own order; a hidden community that
    // still carries work is appended rather than swallowed.
    const seen = new Set<string>();
    for (const team of [...teams, ...data.teams]) {
      if (seen.has(team.id)) continue;
      seen.add(team.id);
      const items = byTeam.get(team.id);
      if (items?.length) {
        ordered.push({
          id: team.id,
          label: teamNameById.get(team.id) ?? team.name,
          items,
        });
      }
    }
    const orphans = byTeam.get("none");
    if (orphans?.length) {
      ordered.push({ id: "none", label: t("work.noTeam"), items: orphans });
    }
    return ordered;
  }, [filtered, teams, data.teams, teamNameById, t]);

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-7xl px-8 pt-6 pb-14">
          <div className="mb-6 flex items-start justify-between gap-4">
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
            <HeaderControls />
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow !text-accent">{t("hero.eyebrow")}</p>
            <h1 className="display-xl mt-3">{t("initiatives.title")}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-foreground/75">
              {t("initiatives.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-8 max-w-7xl px-8">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            <FilterBlock label={t("work.filterKind")}>
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("work.filterAllKinds")}</SelectItem>
                  {INITIATIVE_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {t(KIND_PLURAL_KEY[k])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBlock>

            <FilterBlock label={t("work.filterTeam")}>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("work.filterAllTeams")}</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {teamNameById.get(team.id) ?? team.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="none">{t("work.noTeam")}</SelectItem>
                </SelectContent>
              </Select>
            </FilterBlock>

            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
              <Checkbox
                checked={showCommunities}
                onCheckedChange={(v) => {
                  setShowCommunities(v === true);
                  setTeamFilter("all");
                }}
              />
              <span className="uppercase tracking-wider">{t("work.includeCommunities")}</span>
            </label>


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
                <SelectTrigger className="h-9 w-[160px]">
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

            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {filtered.length} / {flat.length}
              </span>
              {canEdit && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  + {t("journey.add")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {krFilter !== "all" &&
          (() => {
            const set = data.okr_sets.find((s) => s.key_results.some((k) => k.id === krFilter));
            const kr = set?.key_results.find((k) => k.id === krFilter);
            if (!set || !kr) return null;
            const okrTitle = pickTranslation(set, "title", set.title, locale) || "Untitled";
            const krText = pickTranslation(kr, "text", kr.text, locale) || "Untitled KR";
            return (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-soft">
                <span className="mt-0.5 inline-flex h-6 shrink-0 items-center rounded bg-primary/10 px-2 text-[11px] font-bold text-primary">
                  {set.number}.{kr.kr?.includes(".") ? kr.kr.split(".")[1] : kr.kr || "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {set.number}. {okrTitle}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{krText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setKrFilter("all")}
                  className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {t("common.cancel")}
                </button>
              </div>
            );
          })()}
      </section>

      <section className="mx-auto max-w-7xl px-8 py-8">
        {groups.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center text-sm text-muted-foreground">
            {t("work.empty")}
          </p>
        ) : (
          <div className="grid gap-10">
            {groups.map((group) => (
              <TeamGroup key={group.id} label={group.label} items={group.items} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          <Link to="/okrs" className="hover:text-primary hover:underline">
            ← {t("nav.okrs")}
          </Link>
        </p>
      </section>

      <WorkJourney
        open={createOpen}
        onOpenChange={setCreateOpen}
        dashboard={data}
        defaultKrId={krFilter !== "all" ? krFilter : undefined}
      />
    </main>
  );
}

function TeamGroup({ label, items }: { label: string; items: FlatInitiative[] }) {
  const { t } = useLocale();
  const byStatus: Record<InitiativeStatus, FlatInitiative[]> = {
    planned: [],
    in_progress: [],
    done: [],
    canceled: [],
  };
  for (const it of items) byStatus[it.status].push(it);

  return (
    <section aria-label={label}>
      <div className="mb-4 flex items-baseline gap-3 border-b border-border/60 pb-2">
        <h2 className="font-display text-xl font-bold text-foreground">{label}</h2>
        <span className="text-xs text-muted-foreground">
          {items.length} · {t("work.count")}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {INITIATIVE_STATUSES.map((status) => (
          <div key={status} className="flex flex-col rounded-2xl bg-muted/40 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[status])} aria-hidden />
                <h3 className="text-sm font-semibold text-foreground">{t(STATUS_KEY[status])}</h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {byStatus[status].length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {byStatus[status].length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-card/40 px-3 py-6 text-center text-xs italic text-muted-foreground">
                  {t("work.emptyStatus")}
                </div>
              ) : (
                byStatus[status].map((it) => <WorkCard key={it.id} item={it} />)
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
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
