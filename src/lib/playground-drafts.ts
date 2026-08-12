import type { StringKey } from "./i18n-strings";

/** Practice modes offered on the public /playground route. */
export type PlaygroundMode = "objective" | "kr" | "initiative";

export type DraftCard = {
  id: string;
  title: string;
  /** Composed suggestion sentence built from the visitor's own answers. */
  headline: string;
  lines: { label: string; value: string }[];
};

type T = (key: StringKey) => string;

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
  const a0 = clean(answers[0]);
  const a1 = clean(answers[1]);
  const a2 = clean(answers[2]);

  if (mode === "objective") {
    return [
      {
        id: "objective-a",
        title: t("playground.result.objective.a.title"),
        headline: `${dropTrailingPeriod(a0)} ${t("playground.tpl.for")} ${dropTrailingPeriod(a1)}.`,
        lines: [{ label: t("playground.tpl.byEnd"), value: a2 }],
      },
      {
        id: "objective-b",
        title: t("playground.result.objective.b.title"),
        headline: `${t("playground.tpl.by")}: ${dropTrailingPeriod(a2)}.`,
        lines: [{ label: t("playground.tpl.who"), value: a1 }],
      },
      {
        id: "objective-note",
        title: t("playground.result.objective.note.title"),
        headline: t("playground.result.objective.note.body"),
        lines: [],
      },
    ];
  }

  if (mode === "kr") {
    return [
      {
        id: "kr-metric",
        title: t("playground.result.kr.metric.title"),
        headline: `${t("playground.tpl.measure")}: ${dropTrailingPeriod(a2)}.`,
        lines: [
          { label: t("playground.tpl.evidence"), value: a1 },
          { label: t("playground.tpl.supports"), value: a0 },
        ],
      },
      {
        id: "kr-milestone",
        title: t("playground.result.kr.milestone.title"),
        headline: `${t("playground.tpl.milestone")}: ${dropTrailingPeriod(a1)}.`,
        lines: [{ label: t("playground.tpl.supports"), value: a0 }],
      },
      {
        id: "kr-note",
        title: t("playground.result.kr.note.title"),
        headline: t("playground.result.kr.note.body"),
        lines: [],
      },
    ];
  }

  return [
    {
      id: "initiative-a",
      title: t("playground.result.initiative.a.title"),
      headline: `${dropTrailingPeriod(a1)} — ${t("playground.tpl.moves")} ${dropTrailingPeriod(a0)}.`,
      lines: [{ label: t("playground.tpl.constraints"), value: a2 }],
    },
    {
      id: "initiative-b",
      title: t("playground.result.initiative.b.title"),
      headline: `${t("playground.tpl.smallStep")}: ${dropTrailingPeriod(a1)}.`,
      lines: [{ label: t("playground.tpl.moves"), value: a0 }],
    },
    {
      id: "initiative-note",
      title: t("playground.result.initiative.note.title"),
      headline: t("playground.result.initiative.note.body"),
      lines: [],
    },
  ];
}
