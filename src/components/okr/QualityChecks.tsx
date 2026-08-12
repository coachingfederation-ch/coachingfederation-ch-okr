import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { runQualityChecks, type CheckTone } from "@/lib/playground-checks";
import type { PlaygroundMode } from "@/lib/playground-drafts";

const TONE_STYLES: Record<CheckTone, string> = {
  positive: "border-primary/40 bg-primary/5",
  amber: "border-accent/60 bg-accent/15",
  neutral: "border-border/70 bg-muted/40",
};

const TONE_DOT: Record<CheckTone, string> = {
  positive: "bg-primary",
  amber: "bg-accent",
  neutral: "bg-muted-foreground/50",
};

/**
 * Deterministic quality guidance for one practice draft.
 * Pure presentation over local heuristics — no network, no persistence.
 */
export function QualityChecks({
  mode,
  statement,
  answers,
}: {
  mode: PlaygroundMode;
  statement: string;
  answers: string[];
}) {
  const { t } = useLocale();
  const checks = runQualityChecks(mode, statement, answers);
  if (checks.length === 0) return null;

  return (
    <section className="mt-4 border-t border-border/60 pt-3" aria-live="polite">
      <h6 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {t("playground.check.heading")}
      </h6>
      <ul className="mt-2 space-y-2">
        {checks.map((c) => (
          <li key={c.id} className={cn("rounded-lg border px-3 py-2", TONE_STYLES[c.tone])}>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span
                aria-hidden="true"
                className={cn("h-2 w-2 shrink-0 rounded-full", TONE_DOT[c.tone])}
              />
              {t(c.titleKey)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/85">{t(c.bodyKey)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">{t("playground.check.disclaimer")}</p>
    </section>
  );
}
