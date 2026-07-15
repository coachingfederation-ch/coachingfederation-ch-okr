import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, ChevronDown } from "lucide-react";

import { TopNav } from "@/components/okr/TopNav";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import icfLogo from "@/assets/icf-switzerland-charter-chapter.png.asset.json";

export const Route = createFileRoute("/style-guide")({
  head: () => ({
    meta: [
      { title: "Style Guide — ICF Switzerland OKR" },
      {
        name: "description",
        content:
          "Design system reference for the ICF Switzerland OKR dashboard: typography, color, spacing, components.",
      },
      { property: "og:title", content: "Style Guide — ICF Switzerland OKR" },
      {
        property: "og:description",
        content: "Canonical typography, colors, and components for the ICFS OKR dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StyleGuidePage,
});

// ---------- Layout primitives ----------

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4">
        <p className="section-label">{id}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {intro && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
        )}
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]">
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border/60 py-4 last:border-b-0 last:pb-0 first:pt-0 md:grid-cols-[160px_1fr] md:items-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-primary">
      {children}
    </code>
  );
}

// ---------- Page ----------

function StyleGuidePage() {
  return (
    <main className="min-h-dvh">
      {/* Canonical header */}
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-7xl px-8 pt-6 pb-14">
          <div className="mb-6 flex items-start justify-between gap-4">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-20 w-auto -ml-3 -mt-2"
            />
            <div className="flex items-center gap-3">
              <TopNav />
              <AuthBadge />
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow !text-accent">Design System</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Style Guide
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
              The canonical typography, colors, spacing, and components used across the ICFS OKR
              dashboard. Reuse these exact patterns — do not introduce new variants.
            </p>
          </div>
        </div>
      </header>

      {/* TOC card, using the same overlap pattern as other pages */}
      <section className="mx-auto -mt-8 max-w-7xl px-8">
        <nav
          aria-label="Style guide sections"
          className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]"
        >
          <ul className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              ["01", "Typography"],
              ["02", "Color"],
              ["03", "Spacing"],
              ["04", "Logo"],
              ["05", "Header"],
              ["06", "Navigation"],
              ["07", "Buttons"],
              ["08", "Cards"],
              ["09", "Forms"],
              ["10", "Footer"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-chip px-3 py-1.5 text-chip-foreground transition-colors hover:border-chip-active-border"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">{id}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-8 py-12">
        {/* Typography */}
        <Section
          id="01"
          title="Typography"
          intro="Inter for UI and prose. JetBrains Mono for numeric/code chips. Headings are tight (-0.02em) and bold; body text stays at 14–16px."
        >
          <Row label="Font family">
            <p className="text-sm">
              Sans: <Code>Inter</Code> · Mono: <Code>JetBrains Mono</Code>
            </p>
          </Row>
          <Row label="H1 · Hero">
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              The quick brown fox
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              <Code>text-4xl md:text-5xl font-bold tracking-tight</Code>
            </p>
          </Row>
          <Row label="H2 · Section">
            <h2 className="text-2xl font-bold tracking-tight">Section heading</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              <Code>text-2xl font-bold tracking-tight</Code>
            </p>
          </Row>
          <Row label="H3 · Subsection">
            <h3 className="text-lg font-semibold tracking-tight">Subsection heading</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              <Code>text-lg font-semibold tracking-tight</Code>
            </p>
          </Row>
          <Row label="Body">
            <p className="text-sm leading-relaxed">
              Regular paragraph copy sits at 14px with relaxed leading for scannable dashboard
              content.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              <Code>text-sm leading-relaxed</Code>
            </p>
          </Row>
          <Row label="Muted / helper">
            <p className="text-xs text-muted-foreground">
              Secondary text, hints, meta — always <Code>text-muted-foreground</Code>.
            </p>
          </Row>
          <Row label="Eyebrow">
            <p className="eyebrow">Eyebrow label</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Utility <Code>.eyebrow</Code> — 11px, 700, uppercase, primary color.
            </p>
          </Row>
          <Row label="Section label">
            <p className="section-label">Section label</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Utility <Code>.section-label</Code> — same as eyebrow but muted.
            </p>
          </Row>
          <Row label="Mono / numeric">
            <span className="btn-mono">KR 1.2 · 87%</span>
            <p className="mt-1 text-xs text-muted-foreground">
              Utility <Code>.btn-mono</Code> for identifiers and numbers.
            </p>
          </Row>
        </Section>

        {/* Color */}
        <Section
          id="02"
          title="Color"
          intro="Only use semantic tokens. Never hardcode hex or Tailwind color classes like text-white / bg-slate-500 in components."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "background", cls: "bg-background", fg: "text-foreground" },
              { name: "foreground", cls: "bg-foreground", fg: "text-background" },
              { name: "card", cls: "bg-card border border-border", fg: "text-card-foreground" },
              { name: "muted", cls: "bg-muted", fg: "text-muted-foreground" },
              { name: "primary", cls: "bg-primary", fg: "text-primary-foreground" },
              { name: "accent", cls: "bg-accent", fg: "text-accent-foreground" },
              { name: "hero", cls: "bg-hero", fg: "text-hero-foreground" },
              { name: "border", cls: "bg-border", fg: "text-foreground" },
              { name: "ring", cls: "bg-ring", fg: "text-primary-foreground" },
              { name: "chip", cls: "bg-chip border border-border", fg: "text-chip-foreground" },
              { name: "pillar-sg", cls: "bg-pillar-sg", fg: "text-primary-foreground" },
              { name: "pillar-oe", cls: "bg-pillar-oe", fg: "text-primary-foreground" },
            ].map((c) => (
              <div key={c.name} className="overflow-hidden rounded-lg border border-border/70">
                <div className={cn("flex h-20 items-end p-3", c.cls, c.fg)}>
                  <span className="font-mono text-[11px] font-semibold">{c.name}</span>
                </div>
                <div className="bg-card px-3 py-2 text-[11px] text-muted-foreground">
                  <Code>--color-{c.name}</Code>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Spacing */}
        <Section
          id="03"
          title="Spacing & radius"
          intro="Use the Tailwind 4px scale. Cards use rounded-2xl; controls use rounded-md; chips use rounded-full."
        >
          <Row label="Scale">
            <div className="flex items-end gap-3">
              {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                <div key={n} className="text-center">
                  <div
                    className="bg-primary/80"
                    style={{ width: 40, height: n * 4 }}
                    aria-hidden
                  />
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {n} · {n * 4}px
                  </div>
                </div>
              ))}
            </div>
          </Row>
          <Row label="Container">
            <p className="text-sm">
              Page content: <Code>mx-auto max-w-7xl px-8</Code>. Section rhythm:{" "}
              <Code>space-y-12</Code>.
            </p>
          </Row>
          <Row label="Radius">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted text-[10px] font-mono">
                md
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-[10px] font-mono">
                lg
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-[10px] font-mono">
                2xl
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-[10px] font-mono">
                full
              </div>
            </div>
          </Row>
          <Row label="Elevation">
            <div className="inline-block rounded-2xl border border-border/70 bg-card px-6 py-4 text-sm shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]">
              Card shadow — the only shadow used.
            </div>
          </Row>
        </Section>

        {/* Logo */}
        <Section
          id="04"
          title="Logo usage"
          intro="Always the ICF Switzerland Charter Chapter mark on the indigo hero. Height 80px (h-20). Do not recolor, crop, or place on light backgrounds."
        >
          <div className="rounded-xl bg-hero p-6">
            <img
              src={icfLogo.url}
              alt="ICF Switzerland Charter Chapter"
              className="h-20 w-auto"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Import from <Code>@/assets/icf-switzerland-charter-chapter.png.asset.json</Code>.
          </p>
        </Section>

        {/* Header */}
        <Section
          id="05"
          title="Header"
          intro="Every page uses the same indigo hero with logo (top-left), controls cluster (top-right: TopNav, language, auth), and eyebrow + H1 + subtitle stacked left."
        >
          <div className="overflow-hidden rounded-xl border border-border/70">
            <div className="bg-hero px-6 pt-5 pb-10 text-hero-foreground">
              <div className="mb-4 flex items-start justify-between gap-4">
                <img src={icfLogo.url} alt="" className="h-14 w-auto" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                    Nav
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                    Lang
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                    Auth
                  </span>
                </div>
              </div>
              <p className="eyebrow !text-accent">Eyebrow</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Page title</h3>
              <p className="mt-2 max-w-md text-sm text-white/75">
                One-line subtitle that explains the page.
              </p>
            </div>
          </div>
        </Section>

        {/* Navigation */}
        <Section
          id="06"
          title="Navigation"
          intro="Pill nav on white/10 background. Active pill is solid white with primary text. Language switcher follows the same pattern at 24px height."
        >
          <div className="rounded-xl bg-hero p-6">
            <div className="flex flex-wrap items-center gap-3">
              <TopNav />
              <div
                role="group"
                aria-label="Language sample"
                className="inline-flex items-center rounded-full bg-white/10 p-0.5 text-[11px] font-semibold"
              >
                {["en", "de", "fr", "it"].map((l, i) => (
                  <span
                    key={l}
                    className={cn(
                      "inline-flex h-6 items-center rounded-full px-2.5 uppercase tracking-wider",
                      i === 0 ? "bg-white text-primary shadow-sm" : "text-white/80",
                    )}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Use <Code>&lt;TopNav /&gt;</Code> from <Code>@/components/okr/TopNav</Code>. Do not
            build ad-hoc nav bars.
          </p>
        </Section>

        {/* Buttons */}
        <Section
          id="07"
          title="Buttons"
          intro="One button component with two variants in use: default (primary) and outline. Sizes: default and sm. Icon buttons use the same component with an icon child."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button size="sm">Primary sm</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="outline" size="sm">
              Outline sm
            </Button>
            <Button variant="ghost" size="sm">
              Ghost sm
            </Button>
            <Button size="sm">
              <Plus className="mr-1 h-3.5 w-3.5" />
              With icon
            </Button>
            <Button variant="ghost" size="icon" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Import <Code>Button</Code> from <Code>@/components/ui/button</Code>. Do not restyle
            with arbitrary classes.
          </p>
        </Section>

        {/* Cards */}
        <Section
          id="08"
          title="Cards"
          intro="Rounded 2xl card on card background, 1px border at border/70, subtle two-layer shadow. Padding p-4 for toolbars, p-6 for content."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]">
              <p className="section-label">Objective 1</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">Growth &amp; Belonging</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Standard content card. Use for OKRs, KRs, and initiative panels.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Toolbar card</p>
                <Button size="sm">Action</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Forms */}
        <Section
          id="09"
          title="Forms"
          intro="Labels are 11px semibold uppercase muted. Inputs and selects share height 36px (h-9). Group inline controls with 12px gap."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="sg-input"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Text input
              </label>
              <input
                id="sg-input"
                type="text"
                placeholder="Type here"
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label
                htmlFor="sg-select"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Select
              </label>
              <Select>
                <SelectTrigger id="sg-select" className="h-9 w-full">
                  <SelectValue placeholder="Pick one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="sg-textarea"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Textarea
              </label>
              <textarea
                id="sg-textarea"
                rows={3}
                placeholder="Longer description…"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Editable inline text uses <Code>&lt;EditableText /&gt;</Code>. Modals use{" "}
            <Code>&lt;Sheet /&gt;</Code> or <Code>&lt;Dialog /&gt;</Code> from the ui library.
          </p>
        </Section>

        {/* Footer */}
        <Section
          id="10"
          title="Footer"
          intro="A slim indigo bar at the bottom of every page with copyright left and quick links right."
        >
          <StyleGuideFooter preview />
        </Section>
      </div>

      <StyleGuideFooter />
    </main>
  );
}

function StyleGuideFooter({ preview = false }: { preview?: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer
      className={cn(
        "bg-hero text-hero-foreground",
        preview ? "rounded-xl" : "mt-16",
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-8 py-6 text-xs sm:flex-row sm:items-center">
        <p className="text-white/70">© {year} ICF Switzerland — Charter Chapter</p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link to="/" className="text-white/80 hover:text-white">
            OKRs
          </Link>
          <Link to="/initiatives" className="text-white/80 hover:text-white">
            Initiatives
          </Link>
          <Link to="/style-guide" className="text-white/80 hover:text-white">
            Style guide
          </Link>
        </nav>
      </div>
    </footer>
  );
}
