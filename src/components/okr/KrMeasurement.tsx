import type { KeyResultDTO } from "@/lib/okr-schemas";
import { useLocale } from "@/lib/i18n";
import { pickTranslation } from "@/lib/i18n";
import {
  computeKrProgress,
  formatSwissDate,
  isValueStale,
} from "./kr-metrics";

/**
 * Read-only measurement block for a key result.
 *
 * Metric KRs show the Baseline 2026 | Current | Target 2027 triplet plus a
 * progress bar; milestone KRs show status and due date instead. Missing
 * baselines and stale current values are flagged in the warning colour.
 */
export function KrMeasurement({
  kr,
  showContext = true,
  variant = "full",
}: {
  kr: KeyResultDTO;
  /** Render the measure / instrument context lines above the values. */
  showContext?: boolean;
  /**
   * "compact" is the card view: a single progress signal only. All numbers,
   * context lines and dates live in the key result detail sheet.
   */
  variant?: "full" | "compact";
}) {
  const { locale, t } = useLocale();
  const measure = pickTranslation(kr, "measure", kr.measure, locale);
  const instrument = pickTranslation(kr, "instrument", kr.instrument, locale);
  const stale = isValueStale(kr.current_as_of);
  const progress = computeKrProgress(kr.baseline_2026, kr.current_value, kr.target_2027);

  const context = showContext && variant === "full" && (measure || instrument) ? (
    <div className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-muted-foreground">
      {measure && <p className="line-clamp-2">{measure}</p>}
      {instrument && (
        <p className="line-clamp-1 italic">
          {t("kr.instrument")}: {instrument}
        </p>
      )}
    </div>
  ) : null;

  if (variant === "compact") {
    const needsAttention = kr.kr_type === "metric" && (stale || !kr.baseline_2026.trim());
    return (
      <div className="flex items-center gap-2">
        {kr.kr_type === "milestone" ? (
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary-foreground">
            {t(`kr.milestone.${kr.milestone_status}` as const)}
          </span>
        ) : progress !== null ? (
          <>
            <div
              className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label={t("kr.progress")}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
              {Math.round(progress * 100)}%
            </span>
          </>
        ) : (
          <span className="text-[11px] italic text-muted-foreground">{t("kr.notMeasurable")}</span>
        )}
        {kr.kr_type === "milestone" && kr.milestone_due && (
          <span className="text-[11px] text-muted-foreground">
            {formatSwissDate(kr.milestone_due)}
          </span>
        )}
        {needsAttention && (
          <span
            aria-label={stale ? t("kr.stale") : t("kr.baselinePending")}
            title={stale ? t("kr.stale") : t("kr.baselinePending")}
            className="ml-auto h-2 w-2 shrink-0 rounded-full bg-warning"
          />
        )}
      </div>
    );
  }

  if (kr.kr_type === "milestone") {
    return (
      <div>
        {context}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
            {t(`kr.milestone.${kr.milestone_status}` as const)}
          </span>
          {kr.milestone_due && (
            <span className="text-muted-foreground">
              {t("kr.milestoneDue")} {formatSwissDate(kr.milestone_due)}
            </span>
          )}
        </div>
      </div>
    );
  }


  return (
    <div>
      {context}
      <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <ValueCell label={t("kr.baseline2026")} value={kr.baseline_2026} pendingLabel={t("kr.baselinePending")} />
        <ValueCell label={t("kr.current")} value={kr.current_value} warn={stale} />
        <ValueCell label={t("kr.target2027")} value={kr.target_2027} />
      </dl>
      <div className="mt-2 min-h-4 text-[10px] leading-4">
        {kr.current_value && kr.current_as_of ? (
          <span className={stale ? "text-warning" : "text-muted-foreground"}>
            {t("kr.asAt").replace("{date}", formatSwissDate(kr.current_as_of))}
            {stale ? ` · ${t("kr.stale")}` : ""}
          </span>
        ) : null}
      </div>
      {progress !== null ? (
        <div className="mt-1">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label={t("kr.progress")}
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">
            {t("kr.progress")}: {Math.round(progress * 100)}%
          </p>
        </div>
      ) : (
        <p className="mt-1 text-[10px] italic text-muted-foreground">{t("kr.notMeasurable")}</p>
      )}
    </div>
  );
}

function ValueCell({
  label,
  value,
  pendingLabel,
  warn,
}: {
  label: string;
  value: string;
  pendingLabel?: string;
  warn?: boolean;
}) {
  const empty = !value.trim();
  return (
    <div className="min-w-0">
      <dt className="truncate uppercase tracking-wider text-muted-foreground/80">{label}</dt>
      <dd
        className={
          empty || warn
            ? "mt-0.5 truncate font-semibold text-warning"
            : "mt-0.5 truncate font-semibold text-foreground"
        }
      >
        {empty ? (pendingLabel ?? "—") : value}
      </dd>
    </div>
  );
}
