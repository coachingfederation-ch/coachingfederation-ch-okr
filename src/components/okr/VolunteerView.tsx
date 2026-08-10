import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { pickTranslation, useLocale } from "@/lib/i18n";
import type { InitiativeHelpNeeded } from "@/lib/okr-schemas";
import { cn } from "@/lib/utils";
import {
  AMBER_NOTE,
  COMMITMENT_KEY,
  HELP_GROUP_KEY,
  HELP_NEEDED_KEY,
  commitmentRank,
  formatUpdated,
  type FlatInitiative,
} from "./initiative-meta";

const GROUPS: (InitiativeHelpNeeded | "unscoped")[] = [
  "lead",
  "helpers",
  "skill",
  "unscoped",
];

/**
 * Volunteer-facing read of the same portfolio data.
 *
 * Board view answers "how is delivery going". This answers "what could I do,
 * and what will it cost me", so it only surfaces planned + open work, grouped
 * by the kind of person needed and sorted smallest-commitment-first.
 */
export function VolunteerView({
  items,
  onOpen,
}: {
  items: FlatInitiative[];
  onOpen: (id: string) => void;
}) {
  const { t } = useLocale();

  // Availability only carries meaning while status is 'planned'.
  const planned = useMemo(() => items.filter((i) => i.status === "planned"), [items]);
  const open = planned.filter((i) => i.availability === "open");
  const blocked = planned.filter((i) => i.availability === "blocked");
  const parked = planned.filter((i) => i.availability === "parked");

  const grouped = useMemo(() => {
    const map = new Map<InitiativeHelpNeeded | "unscoped", FlatInitiative[]>(
      GROUPS.map((g) => [g, [] as FlatInitiative[]]),
    );
    for (const it of open) map.get(it.help_needed ?? "unscoped")!.push(it);
    for (const list of map.values())
      list.sort(
        (a, b) =>
          commitmentRank(a.commitment) - commitmentRank(b.commitment) ||
          a.sort_order - b.sort_order,
      );
    return map;
  }, [open]);

  return (
    <div>
      <h2 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
        {t("volunteer.openLead").replace("{n}", String(open.length))}
      </h2>

      {open.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border/60 bg-card/40 px-4 py-8 text-center text-sm italic text-muted-foreground">
          {t("volunteer.empty")}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GROUPS.map((g) => {
            const list = grouped.get(g) ?? [];
            return (
              <section key={g} className="flex flex-col rounded-2xl bg-muted/40 p-3">
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t(HELP_GROUP_KEY[g])}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    {list.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {list.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border/60 bg-card/40 px-3 py-6 text-center text-xs italic text-muted-foreground">
                      {t("volunteer.groupEmpty")}
                    </p>
                  ) : (
                    list.map((it) => (
                      <VolunteerCard key={it.id} item={it} onOpen={onOpen} />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <QuietSection
          title={t("volunteer.blocked")}
          count={blocked.length}
          emptyLabel={t("volunteer.blockedEmpty")}
        >
          {blocked.map((it) => (
            <QuietRow key={it.id} item={it} onOpen={onOpen} showReason />
          ))}
        </QuietSection>
        <QuietSection
          title={t("volunteer.parked")}
          count={parked.length}
          emptyLabel={t("volunteer.parkedEmpty")}
        >
          {parked.map((it) => (
            <QuietRow key={it.id} item={it} onOpen={onOpen} />
          ))}
        </QuietSection>
      </div>
    </div>
  );
}

function KrContext({ item }: { item: FlatInitiative }) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
        {item.okrNumber}.
        {item.krLabel.includes(".") ? item.krLabel.split(".")[1] : item.krLabel}
      </span>
      <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {item.okrTitle}
      </span>
    </div>
  );
}

function VolunteerCard({
  item,
  onOpen,
}: {
  item: FlatInitiative;
  onOpen: (id: string) => void;
}) {
  const { locale, t } = useLocale();
  const title = pickTranslation(item, "text", item.text, locale);
  const description = pickTranslation(item, "description", item.description, locale);
  const owner = pickTranslation(item, "owner", item.owner, locale);
  const skillNote = pickTranslation(item, "skill_note", item.skill_note, locale);
  const scopeMissing = !item.commitment || !item.help_needed;

  return (
    <article className="rounded-xl border border-border/70 bg-card p-3 shadow-soft transition-shadow hover:shadow-md">
      <KrContext item={item} />

      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="block w-full min-h-[44px] text-left text-sm font-semibold leading-snug text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded"
      >
        {title || "—"}
      </button>

      {description && (
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.commitment && (
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
            {t(COMMITMENT_KEY[item.commitment])}
          </span>
        )}
        {item.help_needed && (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {t(HELP_NEEDED_KEY[item.help_needed])}
          </span>
        )}
        {scopeMissing && <span className={AMBER_NOTE}>{t("volunteer.scopeMissing")}</span>}
      </div>

      {item.help_needed === "skill" && skillNote && (
        <p className="mt-2 text-xs text-foreground">{skillNote}</p>
      )}

      {owner && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("initiatives.owner")}: <span className="font-medium text-foreground">{owner}</span>
        </p>
      )}

      <p className="mt-3 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
        {t("volunteer.lastUpdated").replace("{date}", formatUpdated(item.updated_at, locale))}
      </p>
    </article>
  );
}

function QuietSection({
  title,
  count,
  emptyLabel,
  children,
}: {
  title: string;
  count: number;
  emptyLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-2xl border border-border/60 bg-muted/20">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>
            {title} <span className="text-xs">({count})</span>
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </h3>
      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {count === 0 ? (
            <p className="text-xs italic text-muted-foreground">{emptyLabel}</p>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  );
}

function QuietRow({
  item,
  onOpen,
  showReason = false,
}: {
  item: FlatInitiative;
  onOpen: (id: string) => void;
  showReason?: boolean;
}) {
  const { locale, t } = useLocale();
  const title = pickTranslation(item, "text", item.text, locale);
  const reason = pickTranslation(item, "blocked_reason", item.blocked_reason, locale);

  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <KrContext item={item} />
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="block w-full text-left text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded"
      >
        {title || "—"}
      </button>
      {showReason && (
        <p className="mt-1.5">
          {reason ? (
            <span className="text-xs text-muted-foreground">{reason}</span>
          ) : (
            <span className={AMBER_NOTE}>{t("volunteer.noReason")}</span>
          )}
        </p>
      )}
    </div>
  );
}
