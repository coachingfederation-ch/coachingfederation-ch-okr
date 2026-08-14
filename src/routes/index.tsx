import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Handshake,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { dashboardQueryOptions } from "@/lib/dashboard-query";
import { submitInitiativeInterest } from "@/lib/interests.functions";
import {
  type DashboardDTO,
  type InitiativeCommitment,
  type InitiativeDTO,
  type InitiativeHelpNeeded,
  type Pillar,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import { type StringKey } from "@/lib/i18n-strings";
import type { Locale } from "@/lib/i18n-shared";
import {
  AVAILABILITY_KEY,
  COMMITMENT_KEY,
  HELP_NEEDED_KEY,
} from "@/components/okr/initiative-meta";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
/** `objective` holds an OKR set id, or "any" when the volunteer is open. */
type Answers = { objective: string | "any" | null; time: TimeChoice | null; help: HelpChoice | null };

const EMPTY: Answers = { objective: null, time: null, help: null };
const STORAGE_KEY = "icfs.getInvolved.answers.v2";

/** Speaking icons for each objective, keyed by objective number. */
const OBJECTIVE_ICONS: Record<number, React.ReactNode> = {
  1: <ShieldCheck className="h-5 w-5" />,
  2: <Users className="h-5 w-5" />,
  3: <TrendingUp className="h-5 w-5" />,
  4: <Handshake className="h-5 w-5" />,
  5: <Megaphone className="h-5 w-5" />,
};


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
        if (parsed.objective && parsed.time && parsed.help) setStep(3);
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
  const matches = useMemo(() => rank(data, answers, locale, t), [data, answers, locale, t]);

  const complete = step >= 3;
  const visible = showAll ? matches : matches.slice(0, 6);

  return (
    <main className="min-h-dvh bg-wash">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          {/* Chrome keeps the Deep Blue band, now as a compact tile on the wash. */}
          <header className="col-span-12 flex flex-wrap items-center justify-between gap-4 rounded-tile bg-hero px-5 py-4 text-hero-foreground shadow-tile">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-14 w-auto"
              width={62}
              height={56}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="flex w-full max-w-full flex-wrap items-center justify-end gap-3 md:w-auto">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>

          </header>

          {/* Welcome tile */}
          <section className="relative col-span-12 flex flex-col justify-center overflow-hidden rounded-tile-lg bg-card p-8 shadow-tile md:p-12 lg:col-span-8">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/20"
            />
            <p className="eyebrow !text-highlight">{t("involve.eyebrow")}</p>
            <h1 className="display-xl mt-4 max-w-2xl text-foreground">{t("involve.title")}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-foreground/70">
              {t("involve.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#journey"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-highlight px-7 text-sm font-bold text-highlight-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" /> {t("involve.cta.start")}
              </a>
              <Link
                to="/initiatives"
                className="inline-flex min-h-11 items-center rounded-full border-2 border-foreground/10 px-7 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5"
              >
                {t("involve.cta.browse")}
              </Link>
            </div>
          </section>

          {/* Live pulse of the chapter, so the page opens with real facts. */}
          <section className="col-span-12 lg:col-span-4">
            <dl className="grid h-full gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  value: stats.objectives,
                  label: t("involve.stat.objectives"),
                  tone: "bg-highlight text-highlight-foreground shadow-lift",
                  sub: "text-highlight-foreground/80",
                },
                {
                  value: stats.open,
                  label: t("involve.stat.open"),
                  tone: "bg-card text-foreground shadow-tile",
                  sub: "text-foreground/60",
                },
                {
                  value: stats.teams,
                  label: t("involve.stat.teams"),
                  tone: "bg-accent text-accent-foreground shadow-spark",
                  sub: "text-accent-foreground/70",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    "flex flex-col justify-center rounded-tile px-6 py-6 lg:flex-1",
                    s.tone,
                  )}
                >
                  <dd className="font-display text-3xl font-bold">{s.value}</dd>
                  <dt className={cn("mt-1 text-sm font-medium", s.sub)}>{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          {/* ---- The three questions ---- */}
          <section
            id="journey"
            className="col-span-12 rounded-tile-xl bg-card p-6 shadow-tile sm:p-10 md:p-12"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    {t("involve.step")} {Math.min(step + 1, 3)} {t("involve.of")} 3
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {t("involve.journeyTitle")}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-wash md:w-56"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={3}
                  aria-valuenow={Math.min(step + 1, 3)}
                >
                  <span
                    className="block h-full rounded-full bg-highlight transition-[width] duration-300"
                    style={{ width: `${((Math.min(step, 2) + 1) / 3) * 100}%` }}
                  />
                </div>
                {(step > 0 || complete) && (
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers(EMPTY);
                      setStep(0);
                      setShowAll(false);
                    }}
                    className="whitespace-nowrap text-xs font-semibold text-foreground/50 transition-colors hover:text-highlight"
                  >
                    {t("involve.restart")}
                  </button>
                )}
              </div>
            </div>

            {step === 0 && (
              <Question
                title={t("involve.q1.title")}
                help={t("involve.q1.help")}
                columns="lg:grid-cols-5"
              >
                {data.okr_sets.map((set) => (
                  <ChoiceCard
                    key={set.id}
                    selected={answers.objective === set.id}
                    eyebrow={`${t("involve.q1.objective")} ${set.number}`}
                    title={pickTranslation(set, "title", set.title, locale)}
                    body={pickTranslation(set, "objective", set.objective, locale)}
                    accent={
                      set.pillars[0]
                        ? `var(--color-pillar-${set.pillars[0].toLowerCase()})`
                        : undefined
                    }
                    icon={OBJECTIVE_ICONS[set.number] ?? <Sparkles className="h-5 w-5" />}
                    onSelect={() => {
                      setAnswers((a) => ({ ...a, objective: set.id }));
                      setStep(1);
                    }}
                  />
                ))}

                <ChoiceCard
                  selected={answers.objective === "any"}
                  title={t("involve.q1.any")}
                  body={t("involve.q1.anyHelp")}
                  className="lg:col-span-5"
                  icon={<Sparkles className="h-5 w-5" />}
                  onSelect={() => {
                    setAnswers((a) => ({ ...a, objective: "any" }));
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

            {complete && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {[
                  answers.objective === "any"
                    ? t("involve.q1.any")
                    : answers.objective
                      ? (() => {
                          const set = data.okr_sets.find((x) => x.id === answers.objective);
                          return set ? pickTranslation(set, "title", set.title, locale) : null;
                        })()
                      : null,
                  answers.time ? t(`involve.time.${answers.time}` as never) : null,
                  answers.help ? t(`involve.help.${answers.help}` as never) : null,
                ]
                  .filter(Boolean)
                  .map((label) => (
                    <li
                      key={label as string}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-wash px-5 text-sm font-bold text-foreground"
                    >
                      <Check className="h-4 w-4 text-highlight" />
                      {label}
                    </li>
                  ))}
              </ul>
            )}


            {step > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="inline-flex min-h-11 items-center rounded-full border-2 border-foreground/10 px-6 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5"
                >
                  {t("involve.back")}
                </button>
              </div>
            )}
          </section>

          {/* ---- Shortlist ---- */}
          {complete && (
            <section className="col-span-12" aria-live="polite">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 px-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {t("involve.results.title")}
                </h2>
                <span className="text-xs font-semibold text-foreground/50">
                  {matches.length} {t("involve.results.count")}
                </span>
              </div>

              {matches.length === 0 ? (
                <p className="rounded-tile border-2 border-dashed border-foreground/10 bg-card/60 px-6 py-12 text-center text-sm text-foreground/60">
                  {t("involve.results.empty")}
                </p>
              ) : (
                <>
                  <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visible.map((m) => (
                      <MatchCard
                        key={m.initiative.id}
                        match={m}
                        onInterest={() => setInterestFor(m)}
                      />
                    ))}
                  </ul>
                  {!showAll && matches.length > visible.length && (
                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAll(true)}
                        className="inline-flex min-h-11 items-center rounded-full border-2 border-foreground/10 bg-card px-7 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5"
                      >
                        {t("involve.results.showAll")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>

      <InterestSheet match={interestFor} onClose={() => setInterestFor(null)} />
    </main>
  );
}


// ---------- Pieces ----------

function Question({
  title,
  help,
  columns = "lg:grid-cols-4",
  children,
}: {
  title: string;
  help: string;
  columns?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-foreground/60">{help}</p>
      <div className={cn("mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3", columns)}>
        {children}
      </div>
    </div>
  );
}

function ChoiceCard({
  selected,
  eyebrow,
  title,
  body,
  accent,
  icon,
  className,
  onSelect,
}: {
  selected?: boolean;
  eyebrow?: string;
  title: string;
  body?: string;
  accent?: string;
  icon?: React.ReactNode;
  className?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group flex min-h-[9rem] flex-col rounded-tile border-2 p-4 text-left transition-all duration-300 sm:p-5",
        selected
          ? "border-highlight bg-highlight text-highlight-foreground shadow-lift"
          : "border-transparent bg-wash text-foreground hover:-translate-y-0.5 hover:border-highlight hover:bg-highlight hover:text-highlight-foreground",
        className,
      )}
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-card transition-transform group-hover:scale-110">
        {icon ? (
          <span
            aria-hidden
            style={accent ? { color: accent } : undefined}
            className={cn(selected && "!text-highlight-foreground")}
          >
            {icon}
          </span>
        ) : selected ? (
          <Check className="h-5 w-5 text-highlight" />
        ) : (
          <Sparkles className="h-5 w-5 text-highlight" />
        )}
      </span>

      {eyebrow && (
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-widest",
            selected ? "text-highlight-foreground/80" : "text-foreground/45 group-hover:text-highlight-foreground/80",
          )}
        >
          {eyebrow}
        </span>
      )}
      <span className="mt-1 font-display text-base font-bold leading-snug sm:text-lg">
        {title}
      </span>
      {body && (
        <span
          className={cn(
            "mt-2 line-clamp-3 text-sm leading-relaxed",
            selected
              ? "text-highlight-foreground/85"
              : "text-foreground/60 group-hover:text-highlight-foreground/85",
          )}
        >
          {body}
        </span>
      )}
    </button>
  );
}


function MatchCard({ match, onInterest }: { match: Match; onInterest: () => void }) {
  const { t, locale } = useLocale();
  const it = match.initiative;
  const text = pickTranslation(it, "text", it.text, locale);
  const description = pickTranslation(it, "description", it.description, locale);

  return (
    <li className="flex flex-col rounded-tile bg-card p-6 shadow-tile transition-transform hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center gap-2">
        {match.pillars.map((p) => (
          <span
            key={p}
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-wash px-3 text-[11px] font-bold text-highlight"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: `var(--color-pillar-${p.toLowerCase()})` }}
            />
            {p}
          </span>
        ))}
        <span className="inline-flex h-7 items-center rounded-full bg-accent px-3 text-[11px] font-bold text-accent-foreground">
          {match.okrNumber}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-foreground">{text}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-foreground/50">{match.krText}</p>
      {description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70">
          {description}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5">
        <Meta>{t(AVAILABILITY_KEY[it.availability])}</Meta>
        {it.commitment && <Meta>{t(COMMITMENT_KEY[it.commitment])}</Meta>}
        {it.help_needed && <Meta>{t(HELP_NEEDED_KEY[it.help_needed])}</Meta>}
      </ul>

      {match.reasons.length > 0 && (
        <p className="mt-4 rounded-2xl bg-wash px-4 py-3 text-xs leading-relaxed text-foreground/65">
          <span className="font-bold text-foreground">{t("involve.match.why")}</span>{" "}
          {match.reasons.join(" · ")}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        <button
          type="button"
          onClick={onInterest}
          className="inline-flex min-h-11 items-center rounded-full bg-highlight px-6 text-sm font-bold text-highlight-foreground shadow-lift transition-transform hover:-translate-y-0.5"
        >
          {t("involve.interest.cta")}
        </button>
        <Link
          to="/initiatives/$initiativeId"
          params={{ initiativeId: it.id }}
          className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-highlight hover:underline"
        >
          {t("initiative.open")} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </li>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex h-7 items-center rounded-full bg-wash px-3 text-[11px] font-semibold text-foreground/60">
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
    <Dialog open={!!match} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto border-none bg-wash p-0 shadow-tile sm:max-w-lg [&>button]:top-5 [&>button]:right-5">
        {match && (
          <>
            <DialogHeader className="relative space-y-3 overflow-hidden rounded-t-lg bg-card px-6 pt-6 pb-6 text-left">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-8 size-28 rounded-full bg-accent/30"
              />
              <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-highlight/12 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.14em] text-highlight uppercase">
                <Sparkles className="size-3.5" aria-hidden />
                {t("involve.interest.cta")}
              </span>
              <DialogTitle className="relative text-left text-2xl leading-snug">
                {pickTranslation(match.initiative, "text", match.initiative.text, locale)}
              </DialogTitle>
              <DialogDescription className="relative text-left text-foreground/70">
                {t("involve.interest.intro")}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 pt-6 pb-7">
              {done ? (
                <p
                  role="status"
                  className="rounded-3xl bg-card px-5 py-5 text-sm font-medium text-foreground shadow-tile"
                >
                  {t("involve.interest.success")}
                </p>
              ) : (
                <div className="space-y-4 rounded-3xl bg-card p-5 shadow-tile">
                  <Field label={t("involve.interest.name")}>
                    <input
                      value={name}
                      maxLength={100}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-wash px-4 py-3 text-sm text-foreground focus:border-highlight/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </Field>
                  <Field label={t("involve.interest.email")}>
                    <input
                      type="email"
                      value={email}
                      maxLength={255}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-wash px-4 py-3 text-sm text-foreground focus:border-highlight/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </Field>
                  <Field label={t("involve.interest.message")}>
                    <textarea
                      rows={4}
                      value={message}
                      maxLength={1000}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-wash px-4 py-3 text-sm text-foreground focus:border-highlight/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </Field>

                  <Button
                    type="button"
                    className="h-12 w-full rounded-full bg-highlight text-highlight-foreground shadow-lift hover:bg-highlight/90"
                    disabled={!valid || busy}
                    onClick={() => void send()}
                  >
                    {busy ? t("involve.interest.sending") : t("involve.interest.submit")}
                  </Button>
                  <p className="text-center text-xs text-foreground/60">
                    {t("involve.interest.privacy")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

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
function rank(
  data: DashboardDTO,
  answers: Answers,
  locale: Locale,
  t: (key: StringKey) => string,
): Match[] {
  if (!answers.objective || !answers.time || !answers.help) return [];
  const out: Match[] = [];

  for (const set of data.okr_sets) {
    const okrTitle = pickTranslation(set, "title", set.title, locale);
    for (const kr of set.key_results) {
      const krText = pickTranslation(kr, "text", kr.text, locale);
      for (const it of kr.initiatives) {
        if (it.status === "done" || it.status === "canceled") continue;
        if (it.availability !== "open") continue;

        let score = 1;
        const reasons: string[] = [];

        if (answers.objective !== "any" && set.id === answers.objective) {
          score += 4;
          reasons.push(okrTitle);
        }
        if (it.commitment && TIME_FIT[answers.time].includes(it.commitment)) {
          score += answers.time === "any" ? 0 : 2;
          if (answers.time !== "any") reasons.push(t(COMMITMENT_KEY[it.commitment]));
        }
        if (answers.help !== "any" && it.help_needed === answers.help) {
          score += 2;
          reasons.push(t(HELP_NEEDED_KEY[it.help_needed]));
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
