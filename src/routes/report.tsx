import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { Printer } from "lucide-react";

import { dashboardQueryOptions } from "@/lib/dashboard-query";
import { pickTranslation, useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n-shared";
import { pillarName } from "@/lib/i18n-strings";
import {
  PILLARS,
  type AlignmentRowDTO,
  type Contribution,
  type KeyResultDTO,
  type OkrSetDTO,
} from "@/lib/okr-schemas";
import { buildReportModel, type ObjectiveReport, type ReportModel } from "@/lib/report-data";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import {
  PortfolioChart,
  ReadinessByObjectiveChart,
  ReadinessChart,
} from "@/components/okr/ReportCharts";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "OKR Board Report — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "Printable board report of the 2026–2027 objectives, key results, measurement readiness and initiative portfolio.",
      },
      { property: "og:title", content: "OKR Board Report — The Switzerland Chapter of ICF" },
      {
        property: "og:description",
        content:
          "A printable snapshot of ICFS objectives, key results and measurement readiness.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: ReportPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

function ReportPage() {
  const { t } = useLocale();
  return (
    <Suspense
      fallback={<div className="p-8 text-sm text-muted-foreground">{t("common.loading")}</div>}
    >
      <ReportContent />
    </Suspense>
  );
}

/** Locale-aware date/time for the generation line. */
function useGeneratedAt(locale: Locale) {
  return useMemo(() => {
    const now = new Date();
    const tag = locale === "en" ? "en-GB" : `${locale}-CH`;
    return {
      date: now.toLocaleDateString(tag, { day: "2-digit", month: "long", year: "numeric" }),
      time: now.toLocaleTimeString(tag, { hour: "2-digit", minute: "2-digit" }),
      filename: `ICFS-OKR-Report-${now.toISOString().slice(0, 10)}`,
    };
    // Regenerated per mount; the report is a snapshot of the moment it was opened.
  }, [locale]);
}

function ReportContent() {
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const { locale, t } = useLocale();
  const model = useMemo(() => buildReportModel(data), [data]);
  const generated = useGeneratedAt(locale);

  const generatedLine = t("report.generated")
    .replace("{date}", generated.date)
    .replace("{time}", generated.time);

  /**
   * Rename the document while printing so the saved PDF gets a sensible
   * filename, then restore it — the browser uses document.title as the default.
   */
  const handlePrint = () => {
    const previous = document.title;
    document.title = generated.filename;
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <main className="min-h-dvh bg-background">
      <header className="bg-hero text-hero-foreground print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-8 py-5">
          <img
            src={icfLogo.url}
            alt="ICF Switzerland Charter Chapter"
            className="h-14 w-auto -ml-2"
            width={62}
            height={56}
            decoding="async"
          />
          <div className="flex items-center gap-3">
            <TopNav />
            <LanguageSwitcher />
            <AuthBadge />
          </div>
        </div>
      </header>

      <div className="report-doc mx-auto max-w-5xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="eyebrow">{t("report.eyebrow")}</p>
            <h1 className="display-lg mt-2">{t("report.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {t("report.subtitle")}
            </p>
            <p className="mt-4 max-w-3xl rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              {generatedLine}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm transition-shadow hover:shadow print:hidden"
          >
            <Printer className="h-4 w-4" aria-hidden="true" /> {t("report.download")}
          </button>
        </div>

        <SummaryTiles model={model} />

        <ReportSection title={t("report.readiness.title")}>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("report.readiness.context")}
          </p>
          <ReadinessChart model={model} />
        </ReportSection>

        <ReportSection title={t("report.byObjective.title")}>
          <ReadinessByObjectiveChart model={model} />
        </ReportSection>

        <ReportSection title={t("report.portfolio.title")}>
          <PortfolioChart model={model} />
          <p className="mt-3 text-sm text-muted-foreground">
            {model.krsWithoutInitiative.length === 0
              ? t("report.portfolio.noGap")
              : t("report.portfolio.gap")
                  .replace("{count}", String(model.krsWithoutInitiative.length))
                  .replace("{list}", model.krsWithoutInitiative.join(", "))}
          </p>
        </ReportSection>

        {model.objectives.map((o, i) => (
          <ObjectiveSection key={o.set.id} objective={o} first={i === 0} />
        ))}

        <ReportSection title={t("report.sfa.title")} breakBefore>
          <AlignmentGrid rows={data.alignment_rows} />
        </ReportSection>

        <ReportSection title={t("report.open.title")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <OpenList label={t("report.open.noInstrument")} items={model.open.noInstrument} />
            <OpenList label={t("report.open.noBaseline")} items={model.open.noBaseline} />
            <OpenList label={t("report.open.noLead")} items={model.open.noLead} />
            <OpenList label={t("report.open.noInitiatives")} items={model.open.noInitiatives} />
          </div>
        </ReportSection>

        <p className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
          {t("report.provenance")
            .replace("{date}", generated.date)
            .replace("{time}", generated.time)
            .replace(
              "{url}",
              typeof window === "undefined" ? "" : window.location.origin,
            )}
        </p>
      </div>
    </main>
  );
}

function ReportSection({
  title,
  breakBefore,
  children,
}: {
  title: string;
  breakBefore?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`mt-10 ${breakBefore ? "report-page" : ""}`}>
      <h2 className="display-sm mb-3">{title}</h2>
      {children}
    </section>
  );
}

function SummaryTiles({ model }: { model: ReportModel }) {
  const { t } = useLocale();
  const tiles = [
    { label: t("report.summary.objectives"), value: model.sets.length },
    { label: t("report.summary.keyResults"), value: model.allKrs.length },
    { label: t("report.summary.metric"), value: model.metricKrs.length },
    { label: t("report.summary.milestone"), value: model.milestoneKrs.length },
    { label: t("report.summary.initiatives"), value: model.initiativeCount },
    {
      label: t("scorecard.instrument"),
      value: `${model.readiness.instrument}/${model.readiness.metricTotal}`,
    },
    {
      label: t("scorecard.baseline"),
      value: `${model.readiness.baseline}/${model.readiness.metricTotal}`,
    },
    {
      label: t("scorecard.current"),
      value: `${model.readiness.current}/${model.readiness.metricTotal}`,
    },
  ];
  return (
    <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="print-fill rounded-xl border border-border bg-muted/40 p-3"
        >
          <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {tile.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold text-foreground">{tile.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ObjectiveSection({
  objective,
  first,
}: {
  objective: ObjectiveReport;
  first: boolean;
}) {
  const { locale, t } = useLocale();
  const set = objective.set;
  const title = pickTranslation(set, "title", set.title, locale);
  const roleName = pickTranslation(set, "role_name", set.role_name, locale);
  const customer = pickTranslation(set, "customer", set.customer, locale);
  const objectiveText = pickTranslation(set, "objective", set.objective, locale);
  const alignment = pickTranslation(set, "alignment", set.alignment, locale);

  return (
    <section className={`mt-10 ${first ? "" : "report-page"}`}>
      <h2 className="display-sm">
        {set.number}. {title}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("report.meta.steward")}: {roleName || t("report.value.unassigned")} ·{" "}
        {t("okr.customer")} {customer || t("report.value.notDefined")} ·{" "}
        {t("report.meta.focus")}:{" "}
        {set.pillars.length ? set.pillars.join(" · ") : t("report.value.notDefined")}
      </p>
      <p className="mt-3 text-lg italic leading-relaxed text-foreground">
        {objectiveText || t("report.value.notDefined")}
      </p>
      {alignment && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{alignment}</p>
      )}

      <table className="mt-4 w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {t("report.table.keyResult")} — {set.number}. {title}
        </caption>
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="w-14 py-2 pr-2 font-semibold">
              {t("report.table.kr")}
            </th>
            <th scope="col" className="py-2 pr-2 font-semibold">
              {t("report.table.keyResult")}
            </th>
            <th scope="col" className="w-32 py-2 pr-2 font-semibold">
              {t("report.table.baseline")}
            </th>
            <th scope="col" className="w-32 py-2 pr-2 font-semibold">
              {t("report.table.target")}
            </th>
            <th scope="col" className="w-28 py-2 font-semibold">
              {t("report.table.lead")}
            </th>
          </tr>
        </thead>
        <tbody>
          {objective.krs.map(({ kr }) => (
            <KrRow key={kr.id} kr={kr} />
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-xs text-muted-foreground">
        {t("report.objective.footer")
          .replace("{initiatives}", String(objective.initiatives.length))
          .replace("{gap}", String(objective.krsWithoutInitiative.length))}
      </p>
    </section>
  );
}

function KrRow({ kr }: { kr: KeyResultDTO }) {
  const { locale, t } = useLocale();
  const text = pickTranslation(kr, "text", kr.text, locale);
  const measure = pickTranslation(kr, "measure", kr.measure, locale);
  const instrument = pickTranslation(kr, "instrument", kr.instrument, locale);
  const lead = pickTranslation(kr, "lead", kr.lead, locale);
  const milestone = kr.kr_type === "milestone";
  const due = kr.milestone_due
    ? new Date(kr.milestone_due).toLocaleDateString(locale === "en" ? "en-GB" : `${locale}-CH`)
    : "";

  return (
    <tr className="border-b border-border/60 align-top">
      <td className="py-2 pr-2 font-semibold">{kr.kr || "—"}</td>
      <td className="py-2 pr-2">
        <span className="block">{text}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {measure || t("report.value.notDefined")}
        </span>
        <span className="block text-xs italic text-muted-foreground">
          {t("kr.instrument")}: {instrument || t("report.value.notDefined")}
        </span>
      </td>
      <td className="py-2 pr-2">
        {milestone
          ? t("report.kr.milestone")
          : kr.baseline_2026 || t("report.value.pending")}
      </td>
      <td className="py-2 pr-2">
        {milestone
          ? due
            ? t("report.kr.due").replace("{date}", due)
            : t("report.value.notDefined")
          : kr.target_2027 || t("report.value.afterBaseline")}
      </td>
      <td className="py-2">{lead || t("report.value.unassigned")}</td>
    </tr>
  );
}

function ContributionMark({ value }: { value: Contribution }) {
  if (value === "primary") {
    return <span className="mx-auto block h-3 w-3 rounded-full bg-primary print-fill" />;
  }
  if (value === "secondary") {
    return <span className="mx-auto block h-3 w-3 rounded-full border-2 border-primary" />;
  }
  return <span className="text-muted-foreground">–</span>;
}

function AlignmentGrid({ rows }: { rows: AlignmentRowDTO[] }) {
  const { locale, t } = useLocale();
  return (
    <div>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{t("report.sfa.title")}</caption>
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="py-2 pr-2 font-semibold">
              {t("report.sfa.pillar")}
            </th>
            {PILLARS.map((p) => (
              <th key={p} scope="col" className="w-20 py-2 text-center font-semibold">
                {pillarName(locale, p)}
              </th>
            ))}
            <th scope="col" className="py-2 pl-3 font-semibold">
              {t("report.sfa.how")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60 align-top">
              <td className="py-2 pr-2 font-semibold">
                {pickTranslation(row, "pillar", row.pillar, locale)}
              </td>
              <td className="py-2 text-center">
                <ContributionMark value={row.sg} />
              </td>
              <td className="py-2 text-center">
                <ContributionMark value={row.oe} />
              </td>
              <td className="py-2 text-center">
                <ContributionMark value={row.ce} />
              </td>
              <td className="py-2 pl-3 text-muted-foreground">
                {pickTranslation(row, "how", row.how, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">{t("report.sfa.legend")}</p>
    </div>
  );
}

function OpenList({ label, items }: { label: string; items: string[] }) {
  const { t } = useLocale();
  return (
    <div className="rounded-xl border border-border p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <p className="mt-1 text-sm text-foreground">
        {items.length ? items.join(", ") : t("report.open.none")}
      </p>
    </div>
  );
}

export type { OkrSetDTO };
