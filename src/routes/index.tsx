import { createFileRoute } from "@tanstack/react-router";
import { X, Plus, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICFS OKR Dashboard" },
      {
        name: "description",
        content:
          "ICF Switzerland 2026 OKRs with global alignment — one customer-centric objective per strategic pillar.",
      },
      { property: "og:title", content: "ICFS OKR Dashboard" },
      {
        property: "og:description",
        content:
          "ICF Switzerland 2026 OKRs aligned to the ICF Global Strategic Plan 2026–2029.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// ---------- Data ----------

type Pillar = "SG" | "OE" | "CE";

const pillarSummary: Record<
  Pillar,
  { label: string; description: string }
> = {
  SG: {
    label: "Sustainable Growth & Impact",
    description:
      "Expand the reach of coaching globally while demonstrating measurable social impact.",
  },
  OE: {
    label: "Org. Development & Excellence",
    description:
      "Modernise ICF governance, systems, infrastructure and talent management to build a high-performing, future-focused organisation.",
  },
  CE: {
    label: "Coaching Excellence & Value",
    description:
      "Set the standard for world-class coaching, leading with credentials and education.",
  },
};

type OkrSet = {
  number: number;
  title: string;
  roleLabel: string;
  roleName: string;
  customer: string;
  pillars: Pillar[]; // which pillar chips are highlighted
  objective: string;
  alignment: string;
  keyResults: { kr: string; text: string; target: string; lead?: string }[];
  initiatives: string[];
};

const okrSets: OkrSet[] = [
  {
    number: 1,
    title: "Excellence & Ethics",
    roleLabel: "Steward",
    roleName: "Natacha",
    customer: "Members & Volunteers",
    pillars: [],
    objective:
      "Members and volunteers feel confident and well-supported in practicing to the highest ethical and professional standards.",
    alignment:
      "Ethics education and quality standards sit at the core of ICF's Coaching Excellence focus area. The governance aspect (volunteer ethical alignment) also supports Org. Excellence. Growing trust through ethical rigour feeds Sustainable Growth.",
    keyResults: [
      {
        kr: "1.1",
        text: "Increase meaningful and deep learning occasions for ethical and professional development (DE/FR/IT/EN)",
        target: "1 → 4",
      },
      {
        kr: "1.2",
        text: "Provide free group mentoring sessions to the members led by an ICF MSQ mentor (3 per year)",
        target: "Full preparation in 2026",
      },
      {
        kr: "1.3",
        text: "Provide individual supervision occasions to the volunteers for free (2 sessions per year) led by an ICF MCC supervisor",
        target: "Full preparation in 2026",
      },
      {
        kr: "1.4",
        text: "Develop a program for senior (MCCs) coaches to further develop their excellence",
        target: "Full preparation in 2026",
      },
      {
        kr: "1.5",
        text: "At least 50% of ethics/professional development events are accessible in a second language (FR, IT, or DE) beyond the primary delivery language.",
        target: "By Q4",
      },
    ],
    initiatives: [
      "Ethics workshops in 4 languages every year",
      "Ethical's support and clarity on processes and roles available through an easy guide for volunteers",
      "Business series",
      "AI learnings",
      "Educational events provided by community leaders",
      "Building an ICFS Mentoring group for members ready to launch in 2027",
      "Building an ICFS Supervision team for volunteers ready to launch in 2027",
      "Workgroup on ICF MCC's needs",
    ],
  },
  {
    number: 2,
    title: "Community & Belonging",
    roleLabel: "Steward",
    roleName: "Beril",
    customer: "Members",
    pillars: ["SG"],
    objective:
      "Members feel they have a genuine professional home where they belong, connect, and grow – in every region and language.",
    alignment:
      "Thriving local communities are ICF's primary engine of Sustainable Growth – membership retention and word-of-mouth expand the profession's reach. Active peer engagement also reinforces Coaching Excellence by creating learning environments.",
    keyResults: [
      { kr: "2.1", text: "Increase the average sense of belonging score", target: "3.66 → 4.00/5" },
      {
        kr: "2.2",
        text: "Local communities organized their events in the local language first whenever possible.",
        target: "75% in local language (trending up)",
      },
      {
        kr: "2.3",
        text: "Increase unique member event participation by 25%, or reach at least 150 unique members through community events",
        target: "+25% / 150 members",
      },
      {
        kr: "2.4",
        text: "At least 30% of community event participants attend two or more community activities during the year.",
        target: "30%",
      },
      {
        kr: "2.5",
        text: "Every community keeps a simple baseline rhythm: one local event/quarter, one peer-learning touchpoint/quarter, one monthly update.",
        target: "Ongoing",
      },
    ],
    initiatives: [],
  },
  {
    number: 3,
    title: "Social Impact",
    roleLabel: "Contact",
    roleName: "Alessandra",
    customer: "Swiss Public & Media",
    pillars: [],
    objective:
      "More people in Switzerland understand and trust professional coaching as a credible and valuable contribution to society.",
    alignment:
      "Directly serves ICF's Sustainable Growth & Impact goal – expanding coaching's reach beyond the current community into public and organisational life. Media visibility also builds the credibility that underpins Coaching Excellence.",
    keyResults: [
      { kr: "3.1", text: "Public-facing events attracting non-member audiences", target: "+30%" },
      {
        kr: "3.2",
        text: "Public resonance from CIE, roundtables and school directors, used for communications",
        target: "Baseline TBD",
      },
      { kr: "3.3", text: "CIIO roundtable reach and public resonance", target: "Baseline TBD" },
    ],
    initiatives: [],
  },
  {
    number: 4,
    title: "Ecosystem & Partnerships",
    roleLabel: "Contact",
    roleName: "Hardy & Lilly",
    customer: "Partner Organisations & Coaching Bodies",
    pillars: ["SG", "OE"],
    objective:
      "Swiss bodies and partner organisations experience ICF Switzerland as a trusted, valuable partner in advancing the coaching profession.",
    alignment:
      "Partnerships expand the Swiss coaching market (Sustainable Growth) and strengthen the governance reach of the chapter by aligning with BSO, EMCC, SCA, and federal bodies (Org. Excellence). Coach Finder usage directly benefits members' professional practice.",
    keyResults: [
      {
        kr: "4.1",
        text: "Establishing the Swiss-wide Industry Pool Coaching Schweiz (IPC) as a partnership",
        target: "EOY, official",
      },
      {
        kr: "4.2",
        text: "Active partnership engagements (joint events, meetings, collaborations)",
        target: "Set baseline for 2026",
      },
    ],
    initiatives: [
      "Improved Coach Finder, with increased communication about it across our channels",
      "Every Swiss member should have the opportunity to be present in the Coach Finder",
    ],
  },
  {
    number: 5,
    title: "Communication & Visibility",
    roleLabel: "Owner",
    roleName: "Susan",
    customer: "Potential Members & Public",
    pillars: [],
    objective:
      "Anyone who encounters ICFS experiences one clear, consistent, and trustworthy voice of the chapter.",
    alignment:
      "A consistent, professional brand presence drives new member acquisition (Sustainable Growth) and reinforces the credibility of ICF credentials and standards in the Swiss market (Coaching Excellence).",
    keyResults: [
      { kr: "5.1", text: "Potential-member inquiries (forms, event registrations, email)", target: "+30%" },
      {
        kr: "5.2",
        text: "Media partnerships (reduced cost or free publications) or inbound inquiries referencing ICF Switzerland",
        target: "+40%",
      },
      { kr: "5.3", text: "Website reflecting all activities and current messaging", target: "EoQ4" },
      { kr: "5.4", text: "Marketing materials updated and distributed to communities", target: "EoQ4" },
    ],
    initiatives: [],
  },
];

type Contribution = "primary" | "secondary" | "none";
const alignmentTable: {
  pillar: string;
  sg: Contribution;
  oe: Contribution;
  ce: Contribution;
  how: string;
}[] = [
  {
    pillar: "Excellence & Ethics",
    sg: "secondary",
    oe: "secondary",
    ce: "primary",
    how: "Directly advances Coaching Excellence (ethics, quality). Also supports Org. Excellence through volunteer ethical governance, and Growth by building the trust that enables profession expansion.",
  },
  {
    pillar: "Community & Belonging",
    sg: "primary",
    oe: "none",
    ce: "secondary",
    how: "The primary local driver of Sustainable Growth — ICF grows when communities thrive. Also contributes to Coaching Excellence by creating peer learning environments.",
  },
  {
    pillar: "Societal Impact",
    sg: "primary",
    oe: "none",
    ce: "secondary",
    how: "Squarely serves Sustainable Growth & Impact — putting coaching in front of new audiences and building public legitimacy. Secondary link to Coaching Excellence (public perception of credentials).",
  },
  {
    pillar: "Ecosystem & Partnerships",
    sg: "primary",
    oe: "secondary",
    ce: "none",
    how: "The chapter's primary growth engine — partnerships expand the coaching market and drive Coach Finder traffic. Contributes to Org. Excellence by extending governance reach into partner organisations.",
  },
  {
    pillar: "Communication & Visibility",
    sg: "primary",
    oe: "none",
    ce: "secondary",
    how: "Supports Sustainable Growth by attracting new members. Also reinforces Coaching Excellence by projecting a consistent, credible brand for credentialled coaches.",
  },
];

// ---------- Small UI atoms ----------

function PillarChip({ code, active }: { code: Pillar; active: boolean }) {
  return (
    <span
      className={
        "inline-flex h-7 min-w-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold tracking-wide " +
        (active
          ? "border-[--color-chip-active-border] bg-white text-primary"
          : "border-border bg-white text-muted-foreground")
      }
    >
      {code}
    </span>
  );
}

function PillarDot({ code }: { code: Pillar }) {
  const bg =
    code === "SG"
      ? "var(--color-pillar-sg)"
      : code === "OE"
        ? "var(--color-pillar-oe)"
        : "var(--color-pillar-ce)";
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: bg }}
    >
      {code}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label mb-2">{children}</div>;
}

function TextInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
    />
  );
}

function AddButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="btn-mono inline-flex h-10 items-center justify-center rounded-md border border-primary/25 bg-white px-4 hover:bg-primary/5 transition-colors">
      {children}
    </button>
  );
}

// ---------- Blocks ----------

function OkrCard({ set }: { set: OkrSet }) {
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {set.number}
          </span>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{set.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <button className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-white px-2 py-1 text-xs font-semibold text-primary">
                {set.roleLabel} <ChevronDown className="h-3 w-3" />
              </button>
              <span className="text-muted-foreground/60">:</span>
              <span className="font-medium text-foreground">{set.roleName}</span>
              <span className="ml-1 text-muted-foreground">Customer:</span>
              <span className="font-medium text-foreground">{set.customer}</span>
            </div>
          </div>
        </div>
        <button
          aria-label="Remove"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-4 flex gap-2">
        {(["SG", "OE", "CE"] as Pillar[]).map((p) => (
          <PillarChip key={p} code={p} active={set.pillars.includes(p)} />
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-5">
        <div className="eyebrow mb-2">Objective</div>
        <p className="text-[15px] font-semibold leading-relaxed text-foreground">
          {set.objective}
        </p>
      </section>

      <section className="mt-6">
        <SectionLabel>Global alignment</SectionLabel>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {set.alignment}
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Key results</SectionLabel>
          <button className="btn-mono inline-flex items-center gap-1 text-primary hover:underline">
            + Add key result
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="w-16 py-3 pl-4 font-semibold">KR</th>
                <th className="py-3 font-semibold">Key result</th>
                <th className="w-56 py-3 font-semibold">Target</th>
                <th className="w-32 py-3 font-semibold">Lead</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {set.keyResults.map((r, i) => (
                <tr
                  key={r.kr}
                  className={
                    "border-t border-border/60 " +
                    (i % 2 === 1 ? "bg-muted/20" : "bg-white")
                  }
                >
                  <td className="py-3 pl-4 align-top text-primary/80 font-medium">
                    {r.kr}
                  </td>
                  <td className="py-3 pr-4 align-top leading-relaxed text-foreground">
                    {r.text}
                  </td>
                  <td className="py-3 pr-4 align-top text-foreground">
                    {r.target}
                  </td>
                  <td className="py-3 pr-4 align-top text-muted-foreground">
                    {r.lead ?? ""}
                  </td>
                  <td className="py-3 pr-4 align-top text-muted-foreground">
                    <X className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <SectionLabel>Related projects &amp; initiatives</SectionLabel>
          {set.initiatives.length > 0 && (
            <ul className="mb-3 space-y-2">
              {set.initiatives.map((it) => (
                <li
                  key={it}
                  className="flex items-start justify-between gap-3 text-sm text-foreground"
                >
                  <span className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{it}</span>
                  </span>
                  <X className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <TextInput placeholder="New project or initiative…" />
            <AddButton>Add</AddButton>
          </div>
        </div>

        <div>
          <SectionLabel>Team members</SectionLabel>
          <div className="flex gap-2">
            <TextInput placeholder="Add team member…" />
            <AddButton>Add</AddButton>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <SectionLabel>Explore more (external links)</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <div className="min-w-56 flex-1">
            <TextInput placeholder="Link label (e.g. Project brief)" />
          </div>
          <div className="min-w-64 flex-[2]">
            <TextInput placeholder="https://…" />
          </div>
          <AddButton>Add link</AddButton>
        </div>
      </section>
    </article>
  );
}

function ContribCell({ v }: { v: Contribution }) {
  if (v === "none") return <span className="text-muted-foreground/40">—</span>;
  const dot = <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />;
  return (
    <span className="inline-flex items-center gap-1">
      {dot}
      {v === "primary" && dot}
    </span>
  );
}

// ---------- Page ----------

function Index() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-8 py-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="eyebrow !text-accent">
                ICF Switzerland · OKR Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                2026 OKRs with Global Alignment
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                One inspiring, customer-centric objective per strategic pillar —
                aligned to the ICF Global Strategic Plan 2026–2029 and the Arbon
                board retreat, 1 June 2026.
              </p>
            </div>
            <button className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 !text-primary shadow-sm hover:shadow transition-shadow">
              <Plus className="h-4 w-4" /> Add OKR set
            </button>
          </div>
        </div>
      </header>

      {/* Pillar summary cards */}
      <section className="mx-auto -mt-8 max-w-6xl px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(pillarSummary) as Pillar[]).map((code) => {
            const p = pillarSummary[code];
            return (
              <div
                key={code}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_20px_-14px_rgba(20,20,60,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <PillarDot code={code} />
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {p.label}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* OKR sets */}
      <section className="mx-auto max-w-6xl space-y-10 px-8 py-12">
        {okrSets.map((set) => (
          <OkrCard key={set.number} set={set} />
        ))}

        {/* Alignment table */}
        <article className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
          <h2 className="text-2xl font-bold text-foreground">
            Global alignment analysis
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How each ICFS pillar contributes to the three ICF Global 2026–2029
            focus areas.{" "}
            <span className="inline-flex items-center gap-1 align-middle">
              <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
            </span>{" "}
            = primary contribution,{" "}
            <span className="inline-flex items-center align-middle">
              <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
            </span>{" "}
            = secondary contribution.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 pl-4 font-semibold">ICFS pillar</th>
                  <th className="w-20 py-3 font-semibold">SG</th>
                  <th className="w-20 py-3 font-semibold">OE</th>
                  <th className="w-20 py-3 font-semibold">CE</th>
                  <th className="py-3 pr-4 font-semibold">How it contributes</th>
                </tr>
              </thead>
              <tbody>
                {alignmentTable.map((row, i) => (
                  <tr
                    key={row.pillar}
                    className={
                      "border-t border-border/60 align-top " +
                      (i % 2 === 1 ? "bg-muted/20" : "bg-white")
                    }
                  >
                    <td className="py-4 pl-4 font-semibold text-foreground">
                      {row.pillar}
                    </td>
                    <td className="py-4"><ContribCell v={row.sg} /></td>
                    <td className="py-4"><ContribCell v={row.oe} /></td>
                    <td className="py-4"><ContribCell v={row.ce} /></td>
                    <td className="py-4 pr-4 leading-relaxed text-muted-foreground">
                      {row.how}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
