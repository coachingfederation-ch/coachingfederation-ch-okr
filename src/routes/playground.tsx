import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/lib/i18n";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { PracticeWizard } from "@/components/okr/PracticeWizard";
import { OkrChain } from "@/components/okr/OkrChain";
import {
  clearHandoffDraft,
  readHandoffDraft,
  type HandoffDraft,
} from "@/components/okr/DraftHandoff";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";
import { type PlaygroundMode } from "@/lib/playground-drafts";

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

const MODES: {
  id: PlaygroundMode;
  titleKey:
    | "playground.mode.objective.title"
    | "playground.mode.kr.title"
    | "playground.mode.initiative.title";
  descKey:
    | "playground.mode.objective.desc"
    | "playground.mode.kr.desc"
    | "playground.mode.initiative.desc";
}[] = [
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

function PlaygroundPage() {
  const { t } = useLocale();

  // Everything below is component state only: no storage, no network, no writes.
  const [mode, setMode] = useState<PlaygroundMode | null>(null);
  const [chainOpen, setChainOpen] = useState(false);
  // Session-only handoff: a draft kept before a sign-in redirect, never saved.
  const [handoff, setHandoff] = useState<HandoffDraft | null>(null);
  useEffect(() => {
    setHandoff(readHandoffDraft());
  }, []);
  const chainRef = useRef<HTMLDivElement | null>(null);

  const activeMode = MODES.find((m) => m.id === mode);

  const openChain = () => {
    setChainOpen(true);
    window.setTimeout(() => chainRef.current?.scrollIntoView({ block: "start" }), 0);
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

        {handoff && (
          <div className="mt-4 rounded-2xl border border-accent/50 bg-accent/15 px-4 py-3 shadow-soft">
            <p className="text-sm font-semibold text-foreground">
              {t("playground.handoff.restored.title")}
            </p>
            <p className="mt-1 text-sm text-foreground/90">{handoff.statement}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("playground.handoff.restored.body")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-11"
              onClick={() => {
                clearHandoffDraft();
                setHandoff(null);
              }}
            >
              {t("playground.handoff.restored.dismiss")}
            </Button>
          </div>
        )}

        {/* Primary path: the connected Objective -> Key Result -> Initiative journey. */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-card p-6 shadow-soft">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground">
              {t("playground.chain.cta.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("playground.chain.cta.desc")}
            </p>
          </div>
          <Button type="button" className="h-11" onClick={openChain}>
            {chainOpen ? t("playground.chain.cta.resume") : t("playground.chain.cta.start")}
          </Button>
        </div>

        {chainOpen && (
          <div ref={chainRef} className="mt-6 scroll-mt-6">
            <OkrChain />
          </div>
        )}

        {!chainOpen && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">
              {t("playground.chain.standalone.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("playground.chain.standalone.desc")}
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="text-lg font-semibold text-foreground">{t(m.titleKey)}</h3>
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

        {mode && activeMode && (
          <div className="mt-8">
            <PracticeWizard key={mode} mode={mode} title={t(activeMode.titleKey)} />
          </div>
        )}
      </section>
    </main>
  );
}
