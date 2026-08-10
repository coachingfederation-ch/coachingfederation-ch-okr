import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale } from "@/lib/i18n";
import { pickTranslation } from "@/lib/i18n";
import { INITIATIVE_STATUSES, type InitiativeStatus } from "@/lib/okr-schemas";
import type { ReportModel } from "@/lib/report-data";

/**
 * Report charts.
 *
 * All of them use explicit pixel width/height instead of ResponsiveContainer:
 * during print layout some browsers measure the container as zero and the
 * chart renders blank. Animation is off for the same reason.
 */

const CHART_WIDTH = 700;

const COLORS = {
  deep: "var(--hero)",
  blue: "var(--primary)",
  light: "var(--highlight)",
  amber: "var(--warning)",
  border: "var(--border)",
  muted: "var(--muted-foreground)",
};

const STATUS_FILL: Record<InitiativeStatus, string> = {
  planned: COLORS.light,
  in_progress: COLORS.blue,
  done: COLORS.deep,
  canceled: COLORS.border,
};

const axisStyle = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

/** 1. Measurement readiness: three stages, counted out of the metric KRs. */
export function ReadinessChart({ model }: { model: ReportModel }) {
  const { t } = useLocale();
  const { readiness } = model;
  const rows = [
    { name: t("scorecard.instrument"), value: readiness.instrument },
    { name: t("scorecard.baseline"), value: readiness.baseline },
    { name: t("scorecard.current"), value: readiness.current },
  ];
  const total = readiness.metricTotal;

  return (
    <figure
      className="chart-block m-0"
      role="img"
      aria-label={`${t("report.readiness.title")} — ${rows
        .map((r) => `${r.name}: ${r.value}/${total}`)
        .join(", ")}`}
    >
      <BarChart
        width={CHART_WIDTH}
        height={200}
        data={rows}
        layout="vertical"
        margin={{ top: 8, right: 24, bottom: 24, left: 8 }}
      >
        <CartesianGrid horizontal={false} stroke={COLORS.border} />
        <XAxis
          type="number"
          domain={[0, total]}
          allowDecimals={false}
          tick={axisStyle}
          label={{
            value: t("report.readiness.axis").replace("{total}", String(total)),
            position: "insideBottom",
            offset: -12,
            style: axisStyle,
          }}
        />
        <YAxis type="category" dataKey="name" width={190} tick={axisStyle} />
        <Tooltip cursor={false} />
        <Bar dataKey="value" isAnimationActive={false} barSize={22} radius={[0, 4, 4, 0]}>
          {rows.map((r) => (
            <Cell key={r.name} fill={r.value === total && total > 0 ? COLORS.blue : COLORS.amber} />
          ))}
        </Bar>
      </BarChart>
    </figure>
  );
}

/** 2. Readiness by objective: where the measurement gap concentrates. */
export function ReadinessByObjectiveChart({ model }: { model: ReportModel }) {
  const { locale, t } = useLocale();
  const rows = model.objectives.map((o) => ({
    name: `${o.set.number}. ${pickTranslation(o.set, "title", o.set.title, locale)}`,
    total: o.metricCount,
    instrument: o.withInstrument,
    baseline: o.withBaseline,
  }));

  return (
    <figure
      className="chart-block m-0"
      role="img"
      aria-label={`${t("report.byObjective.title")} — ${rows
        .map(
          (r) =>
            `${r.name}: ${r.total} ${t("report.byObjective.total")}, ${r.instrument} ${t(
              "report.byObjective.instrument",
            )}, ${r.baseline} ${t("report.byObjective.baseline")}`,
        )
        .join("; ")}`}
    >
      <BarChart
        width={CHART_WIDTH}
        height={80 + rows.length * 64}
        data={rows}
        layout="vertical"
        margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
      >
        <CartesianGrid horizontal={false} stroke={COLORS.border} />
        <XAxis type="number" allowDecimals={false} tick={axisStyle} />
        <YAxis type="category" dataKey="name" width={210} tick={axisStyle} />
        <Tooltip cursor={false} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar
          dataKey="total"
          name={t("report.byObjective.total")}
          fill={COLORS.light}
          isAnimationActive={false}
          barSize={12}
        />
        <Bar
          dataKey="instrument"
          name={t("report.byObjective.instrument")}
          fill={COLORS.blue}
          isAnimationActive={false}
          barSize={12}
        />
        <Bar
          dataKey="baseline"
          name={t("report.byObjective.baseline")}
          fill={COLORS.deep}
          isAnimationActive={false}
          barSize={12}
        />
      </BarChart>
    </figure>
  );
}

/** 3. Initiative portfolio per objective, stacked by status. */
export function PortfolioChart({ model }: { model: ReportModel }) {
  const { locale, t } = useLocale();
  const rows = model.objectives.map((o) => ({
    name: `${o.set.number}. ${pickTranslation(o.set, "title", o.set.title, locale)}`,
    ...o.statusCounts,
  }));

  return (
    <figure
      className="chart-block m-0"
      role="img"
      aria-label={`${t("report.portfolio.title")} — ${rows
        .map(
          (r) =>
            `${r.name}: ${INITIATIVE_STATUSES.map(
              (s) => `${r[s]} ${t(`initiatives.status.${s}` as const)}`,
            ).join(", ")}`,
        )
        .join("; ")}`}
    >
      <BarChart
        width={CHART_WIDTH}
        height={80 + rows.length * 56}
        data={rows}
        layout="vertical"
        margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
      >
        <CartesianGrid horizontal={false} stroke={COLORS.border} />
        <XAxis type="number" allowDecimals={false} tick={axisStyle} />
        <YAxis type="category" dataKey="name" width={210} tick={axisStyle} />
        <Tooltip cursor={false} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {INITIATIVE_STATUSES.map((s) => (
          <Bar
            key={s}
            dataKey={s}
            stackId="portfolio"
            name={t(`initiatives.status.${s}` as const)}
            fill={STATUS_FILL[s]}
            isAnimationActive={false}
            barSize={20}
          />
        ))}
      </BarChart>
    </figure>
  );
}
