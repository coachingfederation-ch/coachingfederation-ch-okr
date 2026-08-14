import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { dashboardQueryOptions } from "@/lib/dashboard-query";
import { submitInitiativeInterest } from "@/lib/interests.functions";
import {
  PILLARS,
  type DashboardDTO,
  type InitiativeCommitment,
  type InitiativeDTO,
  type InitiativeHelpNeeded,
  type Pillar,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import { pillarName } from "@/lib/i18n-strings";
import { AVAILABILITY_KEY, COMMITMENT_KEY, HELP_NEEDED_KEY } from "@/components/okr/initiative-meta";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Get involved — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "Answer three short questions and find the chapter work that fits your interests, your time and your skills.",
      },
      { property: "og:title", content: "Get involved — The Switzerland Chapter of ICF" },
      {
        property: "og:description",
        content: "A guided way for volunteers to find where they can contribute in the chapter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions),
  component: GetInvolvedPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive" role="alert">
      {error.message}
    </div>
  ),
});

// ---------- Answer model ----------

type TimeChoice = "small" | "medium" | "any";
type HelpChoice = InitiativeHelpNeeded | "any";
type Answers = { pillar: Pillar | "any" | null; time: TimeChoice | null; help: HelpChoice | null };

const EMPTY: Answers = { pillar: null, time: null, help: null };
const STORAGE_KEY = "icfs.getInvolved.answers";

/** Smallest commitments read as the lightest time ask. */
const TIME_FIT: Record<TimeChoice, InitiativeCommitment[]> = {
  small: ["one_off"],
  medium: ["recurring", "workstream"],
  any: ["one_off", "recurring", "workstream"],
};

type Match = {
  initiative: InitiativeDTO;
  score: number;
  okrNumber: number;
  okrTitle: string;
  krText: string;
  pillars: Pillar[];
  reasons: string[];
};

function GetInvolvedPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-hero" />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { t, locale } = useLocale();
  const { data } = useSuspenseQuery(dashboardQueryOptions);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [interestFor, setInterestFor] = useState<Match | null>(null);

  // Session-only memory: a volunteer who signs in or wanders off keeps their answers.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Answers;
      if (parsed && typeof parsed === "object") {
        setAnswers({ ...EMPTY, ...parsed });
        if (parsed.pillar && parsed.time && parsed.help) setStep(3);
      }
    } catch {
      /* ignore unreadable session state */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage may be unavailable */
    }
  }, [answers]);

  const stats = useMemo(() => summarise(data), [data]);
  const matches = useMemo(() => rank(data, answers, locale), [data, answers, locale]);

  const complete = step >= 3;
  const visible = showAll ? matches : matches.slice(0, 6);

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-8 pb-24 pt-6">
          <div className="mb-8 flex items-start justify-between gap-4">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="-ml-3 -mt-2 h-20 w-auto"
              width={88}
              height={80}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="flex items-center gap-3">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <p className="eyebrow !text-accent">{t("involve.eyebrow")}</p>
          <h1 className="display-xl mt-3 max-w-3xl">{t("involve.title")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-foreground/75">
            {t("involve.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#journey"
              className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 !text-hero shadow-sm transition-shadow hover:shadow"
            >
              <Sparkles className="h-4 w-4" /> {t("involve.cta.start")}
            </a>
            <Link
              to="/initiatives"
              className="btn-mono inline-flex h-11 items-center rounded-full border border-hero-foreground/30 px-5 text-hero-foreground transition-colors hover:bg-hero-foreground/10"
            >
              {t("involve.cta.browse")}
            </Link>
          </div>
        </div>
      </header>

      {/* Live pulse of the chapter, so the page opens with real facts. */}
      <section className="mx-auto -mt-12 max-w-6xl px-8">
        <dl className="grid gap-4 md:grid-cols-3">
          {[
            { value: stats.objectives, label: t("involve.stat.objectives") },
            { value: stats.open, label: t("involve.stat.open") },
            { value: stats.teams, label: t("involve.stat.teams") },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-soft"
            >
              <dt className="section-label text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-primary">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- The three questions ---- */}
      <section id="journey" className="mx-auto mt-12 max-w-6xl px-8">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <p className="section-label text-muted-foreground">
                {t("involve.step")} {Math.min(step + 1, 3)} {t("involve.of")} 3
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                {t("involve.journeyTitle")}
              </h2>
            </div>
            {(step > 0 || complete) && (
              <button
                type="button"
                onClick={() => {
                  setAnswers(EMPTY);
                  setStep(0);
                  setShowAll(false);
                }}
                className="btn-mono text-xs text-muted-foreground hover:text-primary"
              >
                {t("involve.restart")}
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-border",
                )}
              />
            ))}
          </div>

          {step === 0 && (
            <Question title={t("involve.q1.title")} help={t("involve.q1.help")}>
              {PILLARS.map((p) => {
                const summary = data.pillars.find((x) => x.code === p);
                return (
                  <ChoiceCard
                    key={p}
                    selected={answers.pillar === p}
                    eyebrow={p}
                    title={pillarName(locale, p)}
                    body={
                      summary
                        ? pickTranslation(summary, "description", summary.description, locale)
                        : ""
                    }
                    accent={`var(--color-pillar-${p.toLowerCase()})`}
                    onSelect={() => {
                      setAnswers((a) => ({ ...a, pillar: p }));
                      setStep(1);
                    }}
                  />
                );
              })}

              <ChoiceCard
                selected={answers.pillar === "any"}
                title={t("involve.q1.any")}
                body={t("involve.q1.anyHelp")}
                onSelect={() => {
                  setAnswers((a) => ({ ...a, pillar: "any" }));
                  setStep(1);
                }}
              />
            </Question>
          )}

          {step === 1 && (
            <Question title={t("involve.q2.title")} help={t("involve.q2.help")}>
              {(["small", "medium", "any"] as TimeChoice[]).map((c) => (
                <ChoiceCard
                  key={c}
                  selected={answers.time === c}
                  title={t(`involve.time.${c}` as never)}
                  body={t(`involve.time.${c}Help` as never)}
                  onSelect={() => {
                    setAnswers((a) => ({ ...a, time: c }));
                    setStep(2);
                  }}
                />
              ))}
            </Question>
          )}

          {step === 2 && (
            <Question title={t("involve.q3.title")} help={t("involve.q3.help")}>
              {(["lead", "helpers", "skill", "any"] as HelpChoice[]).map((c) => (
                <ChoiceCard
                  key={c}
                  selected={answers.help === c}
                  title={t(`involve.help.${c}` as never)}
                  body={t(`involve.help.${c}Help` as never)}
                  onSelect={() => {
                    setAnswers((a) => ({ ...a, help: c }));
                    setStep(3);
                  }}
                />
              ))}
            </Question>
          )}

          {step > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                {t("involve.back")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ---- Shortlist ---- */}
      {complete && (
        <section className="mx-auto mt-10 max-w-6xl px-8 pb-16" aria-live="polite">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-border/60 pb-3">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {t("involve.results.title")}
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              {matches.length} {t("involve.results.count")}
            </span>
          </div>

          {matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/70 bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
              {t("involve.results.empty")}
            </p>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((m) => (
                  <MatchCard key={m.initiative.id} match={m} onInterest={() => setInterestFor(m)} />
                ))}
              </ul>
              {!showAll && matches.length > visible.length && (
                <div className="mt-6 text-center">
                  <Button type="button" variant="outline" onClick={() => setShowAll(true)}>
                    {t("involve.results.showAll")}
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <InterestSheet match={interestFor} onClose={() => setInterestFor(null)} />
    </main>
  );
}

// ---------- Pieces ----------

function Question({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{help}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ChoiceCard({
  selected,
  eyebrow,
  title,
  body,
  accent,
  onSelect,
}: {
  selected?: boolean;
  eyebrow?: string;
  title: string;
  body?: string;
  accent?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group flex min-h-[6rem] flex-col rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border/70 bg-surface hover:border-primary/40 hover:bg-primary/5",
      )}
    >
      <span className="flex items-center gap-2">
        {accent && (
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )}
        {eyebrow && (
          <span className="section-label text-muted-foreground">{eyebrow}</span>
        )}
        {selected && <Check className="ml-auto h-4 w-4 text-primary" />}
      </span>
      <span className="mt-1 font-display text-base font-semibold text-foreground">{title}</span>
      {body && <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</span>}
    </button>
  );
}

function MatchCard({ match, onInterest }: { match: Match; onInterest: () => void }) {
  const { t, locale } = useLocale();
  const it = match.initiative;
  const text = pickTranslation(it, "text", it.text, locale);
  const description = pickTranslation(it, "description", it.description, locale);

  return (
    <li className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        {match.pillars.map((p) => (
          <span
            key={p}
            className="inline-flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-[11px] font-semibold text-primary"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: `var(--color-pillar-${p.toLowerCase()})` }}
            />
            {p}
          </span>
        ))}
        <span className="inline-flex h-6 items-center rounded bg-accent/25 px-2 text-[11px] font-bold text-hero">
          {match.okrNumber}
        </span>
      </div>

      <h3 className="mt-3 font-display text-base font-bold leading-snug text-foreground">{text}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{match.krText}</p>
      {description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/85">
          {description}
        </p>
      )}

      <ul className="mt-3 flex flex-wrap gap-1.5">
        <Meta>{t(AVAILABILITY_KEY[it.availability])}</Meta>
        {it.commitment && <Meta>{t(COMMITMENT_KEY[it.commitment])}</Meta>}
        {it.help_needed && <Meta>{t(HELP_NEEDED_KEY[it.help_needed])}</Meta>}
      </ul>

      {match.reasons.length > 0 && (
        <p className="mt-3 rounded-xl border-l-4 border-l-accent bg-surface px-3 py-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{t("involve.match.why")}</span>{" "}
          {match.reasons.join(" · ")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <Button type="button" size="sm" onClick={onInterest}>
          {t("involve.interest.cta")}
        </Button>
        <Link
          to="/initiatives/$initiativeId"
          params={{ initiativeId: it.id }}
          className="btn-mono inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {t("initiative.open")} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </li>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex h-6 items-center rounded-full border border-border bg-surface px-2.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </li>
  );
}

function InterestSheet({ match, onClose }: { match: Match | null; onClose: () => void }) {
  const { t, locale } = useLocale();
  const submit = useServerFn(submitInitiativeInterest);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (match) setDone(false);
  }, [match]);

  const valid = name.trim().length > 0 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const send = async () => {
    if (!match || !valid) return;
    setBusy(true);
    try {
      await submit({
        data: {
          initiative_id: match.initiative.id,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      });
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error(t("involve.interest.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={!!match} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {match && (
          <>
            <SheetHeader>
              <p className="section-label text-left text-primary">{t("involve.interest.cta")}</p>
              <SheetTitle className="text-left">
                {pickTranslation(match.initiative, "text", match.initiative.text, locale)}
              </SheetTitle>
              <SheetDescription className="text-left">
                {t("involve.interest.intro")}
              </SheetDescription>
            </SheetHeader>

            {done ? (
              <p
                role="status"
                className="mt-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-foreground"
              >
                {t("involve.interest.success")}
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                <Field label={t("involve.interest.name")}>
                  <input
                    value={name}
                    maxLength={100}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </Field>
                <Field label={t("involve.interest.email")}>
                  <input
                    type="email"
                    value={email}
                    maxLength={255}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </Field>
                <Field label={t("involve.interest.message")}>
                  <textarea
                    rows={4}
                    value={message}
                    maxLength={1000}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </Field>

                <Button
                  type="button"
                  className="h-11 w-full"
                  disabled={!valid || busy}
                  onClick={() => void send()}
                >
                  {busy ? t("involve.interest.sending") : t("involve.interest.submit")}
                </Button>
                <p className="text-xs text-muted-foreground">{t("involve.interest.privacy")}</p>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="section-label text-muted-foreground">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

// ---------- Matching ----------

function summarise(data: DashboardDTO) {
  let open = 0;
  for (const set of data.okr_sets) {
    for (const kr of set.key_results) {
      for (const it of kr.initiatives) {
        if (it.status !== "done" && it.status !== "canceled" && it.availability === "open") open++;
      }
    }
  }
  return { objectives: data.okr_sets.length, open, teams: data.teams.length };
}

/**
 * Ranks open work against the volunteer's three answers. Nothing is filtered
 * away hard except closed work: a weaker match still deserves to be visible,
 * it just sorts lower.
 */
function rank(data: DashboardDTO, answers: Answers, locale: string): Match[] {
  if (!answers.pillar || !answers.time || !answers.help) return [];
  const out: Match[] = [];

  for (const set of data.okr_sets) {
    const okrTitle = pickTranslation(set, "title", set.title, locale as never);
    for (const kr of set.key_results) {
      const krText = pickTranslation(kr, "text", kr.text, locale as never);
      for (const it of kr.initiatives) {
        if (it.status === "done" || it.status === "canceled") continue;
        if (it.availability !== "open") continue;

        let score = 1;
        const reasons: string[] = [];

        if (answers.pillar !== "any" && set.pillars.includes(answers.pillar)) {
          score += 3;
          reasons.push(answers.pillar);
        }
        if (it.commitment && TIME_FIT[answers.time].includes(it.commitment)) {
          score += answers.time === "any" ? 0 : 2;
          if (answers.time !== "any") reasons.push(it.commitment);
        }
        if (answers.help !== "any" && it.help_needed === answers.help) {
          score += 2;
          reasons.push(it.help_needed);
        }

        out.push({
          initiative: it,
          score,
          okrNumber: set.number,
          okrTitle,
          krText,
          pillars: set.pillars,
          reasons,
        });
      }
    }
  }

  return out.sort((a, b) => b.score - a.score || a.okrNumber - b.okrNumber);
}
