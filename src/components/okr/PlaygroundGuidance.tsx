import { useLocale } from "@/lib/i18n";

/**
 * Static teaching content shown next to the practice drafts: what each OKR
 * building block is, plus one weak-versus-improved example.
 */
export function PlaygroundGuidance() {
  const { t } = useLocale();

  const rows = [
    { term: t("playground.mode.objective.title"), body: t("playground.edu.objective") },
    { term: t("playground.mode.kr.title"), body: t("playground.edu.kr") },
    { term: t("playground.mode.initiative.title"), body: t("playground.edu.initiative") },
  ];

  return (
    <aside className="rounded-xl border border-border/70 bg-muted/40 p-5">
      <h5 className="text-sm font-semibold text-foreground">{t("playground.edu.heading")}</h5>
      <dl className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.term}>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {row.term}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground/90">{row.body}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-border/60 pt-4">
        <h6 className="text-sm font-semibold text-foreground">{t("playground.example.heading")}</h6>
        <dl className="mt-3 space-y-3">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("playground.example.weakLabel")}
            </dt>
            <dd className="text-sm text-foreground/90 line-through decoration-muted-foreground/50">
              {t("playground.example.weak")}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("playground.example.feedbackLabel")}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground/90">
              {t("playground.example.feedback")}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {t("playground.example.improvedLabel")}
            </dt>
            <dd className="text-sm font-medium leading-relaxed text-foreground">
              {t("playground.example.improved")}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
