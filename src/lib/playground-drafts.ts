import type { StringKey } from "./i18n-strings";

/** Practice modes offered on the public /playground route. */
export type PlaygroundMode = "objective" | "kr" | "initiative";

export type DraftQuality = "strong" | "usable" | "refine";

export type DraftCard = {
  id: string;
  title: string;
  /** One or more phrasings of the same suggestion, in order. */
  variants: string[];
  /** Short rationale shown as "Why this works". */
  why: string;
  /** Short caution shown as "Watch for" on non-strong variants. */
  watchFor: string;
  /** Quality assessed by the generator; overrides the variant-index rating. */
  quality?: DraftQuality;
  /** Labelled supporting fields (measurement, baseline, owner role, …). */
  meta?: Array<{ label: string; value: string }>;
  /** Cautions returned by the generator. */
  warnings?: string[];
};


type T = (key: StringKey) => string;

/** Quality rating per variant index — variant 0 is the tightest phrasing. */
export const VARIANT_QUALITY: DraftQuality[] = ["strong", "usable", "refine"];

export function qualityForVariant(index: number): DraftQuality {
  return VARIANT_QUALITY[index % VARIANT_QUALITY.length] ?? "usable";
}

/** The three questions asked per mode, in order. */
export const QUESTION_KEYS: Record<PlaygroundMode, StringKey[]> = {
  objective: [
    "playground.q.objective.1",
    "playground.q.objective.2",
    "playground.q.objective.3",
  ],
  kr: ["playground.q.kr.1", "playground.q.kr.2", "playground.q.kr.3"],
  initiative: [
    "playground.q.initiative.1",
    "playground.q.initiative.2",
    "playground.q.initiative.3",
  ],
};

function clean(v: string | undefined): string {
  return (v ?? "").trim().replace(/\s+/g, " ");
}

function dropTrailingPeriod(v: string): string {
  return v.replace(/[.。]+$/, "");
}

/**
 * Deterministic, locale-aware mock generator. Pure string composition — no
 * randomness and no network, so output is stable across SSR and re-renders.
 * This is a placeholder for a future AI call; the shape of the result is the
 * contract the real generator will have to satisfy.
 */
export function buildDrafts(mode: PlaygroundMode, answers: string[], t: T): DraftCard[] {
  const a0 = dropTrailingPeriod(clean(answers[0]));
  const a1 = dropTrailingPeriod(clean(answers[1]));
  const a2 = dropTrailingPeriod(clean(answers[2]));

  if (mode === "objective") {
    return [
      {
        id: "objective-a",
        title: t("playground.result.objective.a.title"),
        variants: [
          `${a0} ${t("playground.tpl.for")} ${a1}.`,
          `${t("playground.tpl.for")} ${a1}: ${a0}.`,
          `${t("playground.tpl.byEnd")}: ${a0} ${t("playground.tpl.for")} ${a1}.`,
        ],
        why: t("playground.why.objective-a"),
        watchFor: t("playground.watch.objective-a"),
      },
      {
        id: "objective-b",
        title: t("playground.result.objective.b.title"),
        variants: [
          `${t("playground.tpl.by")}: ${a2}.`,
          `${a2} — ${t("playground.tpl.for")} ${a1}.`,
          `${t("playground.tpl.byEnd")}: ${a2} (${a1}).`,
        ],
        why: t("playground.why.objective-b"),
        watchFor: t("playground.watch.objective-b"),
      },
    ];
  }

  if (mode === "kr") {
    return [
      {
        id: "kr-metric",
        title: t("playground.result.kr.metric.title"),
        variants: [
          `${t("playground.tpl.measure")}: ${a2}.`,
          `${a1} — ${t("playground.tpl.measure")}: ${a2}.`,
          `${t("playground.tpl.measure")}: ${a2}. ${t("playground.tpl.supports")}: ${a0}.`,
        ],
        why: t("playground.why.kr-metric"),
        watchFor: t("playground.watch.kr-metric"),
      },
      {
        id: "kr-milestone",
        title: t("playground.result.kr.milestone.title"),
        variants: [
          `${t("playground.tpl.milestone")}: ${a1}.`,
          `${t("playground.tpl.milestone")}: ${a1} — ${t("playground.tpl.supports")}: ${a0}.`,
          `${t("playground.tpl.byEnd")}: ${a1}.`,
        ],
        why: t("playground.why.kr-milestone"),
        watchFor: t("playground.watch.kr-milestone"),
      },
    ];
  }

  return [
    {
      id: "initiative-a",
      title: t("playground.result.initiative.a.title"),
      variants: [
        `${a1} — ${t("playground.tpl.moves")} ${a0}.`,
        `${a1}. ${t("playground.tpl.constraints")}: ${a2}.`,
        `${t("playground.tpl.moves")} ${a0}: ${a1}.`,
      ],
      why: t("playground.why.initiative-a"),
      watchFor: t("playground.watch.initiative-a"),
    },
    {
      id: "initiative-b",
      title: t("playground.result.initiative.b.title"),
      variants: [
        `${t("playground.tpl.smallStep")}: ${a1}.`,
        `${t("playground.tpl.smallStep")}: ${a1} — ${t("playground.tpl.moves")} ${a0}.`,
        `${t("playground.tpl.smallStep")}: ${a1} (${a2}).`,
      ],
      why: t("playground.why.initiative-b"),
      watchFor: t("playground.watch.initiative-b"),
    },
  ];
}
