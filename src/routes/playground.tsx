import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useLocale } from "@/lib/i18n";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "OKR Playground — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "A public practice area for drafting objectives, key results and initiatives. Nothing is saved and no live data is affected.",
      },
      { property: "og:title", content: "OKR Playground — The Switzerland Chapter of ICF" },
      {
        property: "og:description",
        content:
          "Practise drafting objectives, key results and initiatives in a safe sandbox. Nothing is saved.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaygroundPage,
});

type Mode = "objective" | "kr" | "initiative";

const MODES: { id: Mode; titleKey: "playground.mode.objective.title" | "playground.mode.kr.title" | "playground.mode.initiative.title"; descKey: "playground.mode.objective.desc" | "playground.mode.kr.desc" | "playground.mode.initiative.desc" }[] = [
  {
    id: "objective",
    titleKey: "playground.mode.objective.title",
    descKey: "playground.mode.objective.desc",
  },
  { id: "kr", titleKey: "playground.mode.kr.title", descKey: "playground.mode.kr.desc" },
  {
    id: "initiative",
    titleKey: "playground.mode.initiative.title",
    descKey: "playground.mode.initiative.desc",
  },
];

/** Session-only text field — value lives in React state and dies with the tab. */
function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const base =
    "w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40";
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, "h-11")}
        />
      )}
    </label>
  );
}

function PlaygroundPage() {
  const { t } = useLocale();
  const [mode, setMode] = useState<Mode | null>(null);

  // All drafts are component state only: no storage, no network, no persistence.
  const [objective, setObjective] = useState({ title: "", customer: "", outcome: "" });
  const [kr, setKr] = useState({ title: "", baseline: "", current: "", target: "" });
  const [draftInitiative, setDraftInitiative] = useState({
    title: "",
    owner: "",
    description: "",
  });
  const [initiatives, setInitiatives] = useState<
    { id: number; title: string; owner: string; description: string }[]
  >([]);

  const clear = () => {
    if (mode === "objective") setObjective({ title: "", customer: "", outcome: "" });
    if (mode === "kr") setKr({ title: "", baseline: "", current: "", target: "" });
    if (mode === "initiative") {
      setDraftInitiative({ title: "", owner: "", description: "" });
      setInitiatives([]);
    }
  };

  return (
    <main className="min-h-dvh">
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-7xl px-8 pt-6 pb-14">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
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
            <div className="flex flex-wrap items-center gap-3">
              <TopNav />
              <LanguageSwitcher />
              <AuthBadge />
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow !text-accent">{t("hero.eyebrow")}</p>
            <h1 className="display-xl mt-3">{t("playground.title")}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-foreground/75">
              {t("playground.intro")}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 pt-8 pb-16">
        <div
          role="status"
          className="rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-medium text-primary shadow-soft"
        >
          {t("playground.badge")}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-colors",
                  active ? "border-primary/50" : "border-border/70",
                )}
              >
                <h2 className="text-lg font-semibold text-foreground">{t(m.titleKey)}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(m.descKey)}
                </p>
                <Button
                  type="button"
                  variant={active ? "default" : "outline"}
                  className="mt-4 h-11 self-start"
                  aria-pressed={active}
                  onClick={() => setMode(m.id)}
                >
                  {t("playground.start")}
                </Button>
              </div>
            );
          })}
        </div>

        {mode && (
          <div className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("playground.draftLabel")}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {t(MODES.find((m) => m.id === mode)!.titleKey)}
                </h3>
              </div>
              <Button type="button" variant="outline" className="h-11" onClick={clear}>
                {t("playground.clear")}
              </Button>
            </div>

            {mode === "objective" && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t("playground.field.objectiveTitle")}
                  value={objective.title}
                  onChange={(v) => setObjective((o) => ({ ...o, title: v }))}
                />
                <Field
                  label={t("playground.field.customer")}
                  value={objective.customer}
                  onChange={(v) => setObjective((o) => ({ ...o, customer: v }))}
                />
                <div className="md:col-span-2">
                  <Field
                    label={t("playground.field.outcome")}
                    value={objective.outcome}
                    onChange={(v) => setObjective((o) => ({ ...o, outcome: v }))}
                    multiline
                  />
                </div>
              </div>
            )}

            {mode === "kr" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label={t("playground.field.krTitle")}
                    value={kr.title}
                    onChange={(v) => setKr((k) => ({ ...k, title: v }))}
                  />
                </div>
                <Field
                  label={t("playground.field.baseline")}
                  value={kr.baseline}
                  onChange={(v) => setKr((k) => ({ ...k, baseline: v }))}
                />
                <Field
                  label={t("playground.field.current")}
                  value={kr.current}
                  onChange={(v) => setKr((k) => ({ ...k, current: v }))}
                />
                <Field
                  label={t("playground.field.target")}
                  value={kr.target}
                  onChange={(v) => setKr((k) => ({ ...k, target: v }))}
                />
              </div>
            )}

            {mode === "initiative" && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={t("playground.field.initiativeTitle")}
                    value={draftInitiative.title}
                    onChange={(v) => setDraftInitiative((d) => ({ ...d, title: v }))}
                  />
                  <Field
                    label={t("playground.field.owner")}
                    value={draftInitiative.owner}
                    onChange={(v) => setDraftInitiative((d) => ({ ...d, owner: v }))}
                  />
                  <div className="md:col-span-2">
                    <Field
                      label={t("playground.field.description")}
                      value={draftInitiative.description}
                      onChange={(v) => setDraftInitiative((d) => ({ ...d, description: v }))}
                      multiline
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="h-11"
                  disabled={draftInitiative.title.trim().length === 0}
                  onClick={() => {
                    setInitiatives((list) => [...list, { id: Date.now(), ...draftInitiative }]);
                    setDraftInitiative({ title: "", owner: "", description: "" });
                  }}
                >
                  {t("playground.addInitiative")}
                </Button>

                {initiatives.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("playground.initiativeListEmpty")}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {initiatives.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{i.title}</p>
                          {i.owner && (
                            <p className="text-xs text-muted-foreground">{i.owner}</p>
                          )}
                          {i.description && (
                            <p className="mt-1 text-sm text-muted-foreground">{i.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-11 shrink-0"
                          onClick={() =>
                            setInitiatives((list) => list.filter((x) => x.id !== i.id))
                          }
                        >
                          {t("playground.remove")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <p className="mt-5 text-xs text-muted-foreground">{t("playground.notSaved")}</p>
          </div>
        )}
      </section>
    </main>
  );
}
