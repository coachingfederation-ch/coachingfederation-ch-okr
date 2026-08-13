import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { pickTranslation, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FlatInitiative } from "./initiative-meta";
import { AVAILABILITY_CHIP, AVAILABILITY_KEY } from "./initiative-meta";
import {
  CONFIDENCE_CHIP,
  CONFIDENCE_KEY,
  DECISION_CHIP,
  DECISION_KEY,
  KIND_CHIP,
  KIND_KEY,
  formatDateRange,
} from "./work-meta";

/**
 * One piece of work in the portfolio. The card carries only what a reader
 * needs to decide whether to open the one-pager: what it is, who owns it,
 * which key result it serves, and the most recent signal of movement.
 */
export function WorkCard({ item }: { item: FlatInitiative }) {
  const { locale, t } = useLocale();

  const title = pickTranslation(item, "text", item.text, locale);
  const owner = pickTranslation(item, "owner", item.owner, locale);
  const idea = pickTranslation(item, "idea", item.idea, locale);
  const aspiration = pickTranslation(item, "aspiration", item.aspiration, locale);
  const summary = aspiration || idea || pickTranslation(item, "description", item.description, locale);

  const latest = item.learning_entries[0] ?? null;
  const range = formatDateRange(item.start_date, item.end_date, locale);

  return (
    <article className="group relative rounded-xl border border-border/70 bg-card p-4 shadow-soft transition-shadow hover:shadow-md">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-semibold uppercase tracking-wider",
            KIND_CHIP[item.kind],
          )}
        >
          {t(KIND_KEY[item.kind])}
        </span>
        <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
          {item.okrNumber}.
          {item.krLabel.includes(".") ? item.krLabel.split(".")[1] : item.krLabel}
        </span>
        {item.secondaryLabels.map((label) => (
          <span
            key={label}
            title={t("initiative.secondary")}
            className="inline-flex h-5 items-center rounded border border-primary/30 px-1.5 text-[10px] font-semibold text-primary/80"
          >
            {label}
          </span>
        ))}
        {item.status === "planned" && (
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-semibold",
              AVAILABILITY_CHIP[item.availability],
            )}
          >
            {t(AVAILABILITY_KEY[item.availability])}
          </span>
        )}
      </div>

      <h3 className="pr-6 text-sm font-semibold leading-snug text-foreground">
        <Link
          to="/initiatives/$initiativeId"
          params={{ initiativeId: item.id }}
          className="after:absolute after:inset-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {title || t("initiative.new")}
        </Link>
      </h3>
      <ArrowUpRight
        className="absolute right-3 top-4 h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
        aria-hidden
      />

      {summary && (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{summary}</p>
      )}

      <dl className="mt-3 grid gap-1 text-[11px] text-muted-foreground">
        {owner && (
          <div className="flex gap-1.5">
            <dt>{t("initiatives.owner")}:</dt>
            <dd className="min-w-0 truncate font-medium text-foreground">{owner}</dd>
          </div>
        )}
        {item.teamName && (
          <div className="flex gap-1.5">
            <dt>{t("work.team")}:</dt>
            <dd className="min-w-0 truncate font-medium text-foreground">{item.teamName}</dd>
          </div>
        )}
        {range && (
          <div className="flex gap-1.5">
            <dt>
              {t("work.phaseNumber")} {item.phase}:
            </dt>
            <dd className="min-w-0 truncate">{range}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-2 text-[10px]">
        {item.confidence && (
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-full border px-2 font-semibold",
              CONFIDENCE_CHIP[item.confidence],
            )}
          >
            {t(CONFIDENCE_KEY[item.confidence])}
          </span>
        )}
        {item.signals.length > 0 && (
          <span className="inline-flex h-5 items-center rounded-full border border-border px-2 font-medium text-muted-foreground">
            {item.signals.length} · {t("work.signals")}
          </span>
        )}
        {latest && (
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-full border px-2 font-semibold",
              DECISION_CHIP[latest.decision],
            )}
          >
            {t(DECISION_KEY[latest.decision])}
          </span>
        )}
        {item.help_needed && (
          <span className="inline-flex h-5 items-center rounded-full border border-accent/50 bg-accent/15 px-2 font-semibold text-foreground">
            {t("work.lookingForPeople")}
          </span>
        )}
      </div>
    </article>
  );
}
