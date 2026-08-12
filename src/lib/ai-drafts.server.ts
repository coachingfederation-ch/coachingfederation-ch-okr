import type { Locale } from "./i18n-shared";

/**
 * AI-backed OKR drafting service.
 *
 * Follows the project's established gateway pattern (see `translate.server.ts`):
 * a server-only raw fetch to the Lovable AI gateway with the key read from the
 * environment inside the call. No key ever reaches the client, no model output
 * is written to the database — callers receive drafts and the editor decides.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export type DraftMode = "objective" | "kr" | "initiative";
export type DraftQualityLevel = "strong" | "usable" | "refine";
export type BaselineState = "known" | "pending" | "exploratory";

export type ObjectiveDraft = {
  title: string;
  rationale: string;
  quality: DraftQualityLevel;
  warnings: string[];
};

export type KrDraft = {
  statement: string;
  measurement: string;
  baseline_state: BaselineState;
  target_suggestion: string;
  instrument_suggestion: string;
  quality: DraftQualityLevel;
  warnings: string[];
};

export type InitiativeDraft = {
  title: string;
  why: string;
  owner_role: string;
  effort: string;
  timing: string;
  quality: DraftQualityLevel;
  warnings: string[];
};

export type GeneratedDrafts = {
  mode: DraftMode;
  drafts: Array<ObjectiveDraft | KrDraft | InitiativeDraft>;
  /** Objective mode only: coaching questions to ask next. */
  nextQuestions: string[];
};

const LANG_NAME: Record<Locale, string> = {
  en: "English",
  de: "German (Swiss orthography, no ß)",
  fr: "French",
  it: "Italian",
};

/* ------------------------------------------------------------------ *
 * Abuse protection
 * ------------------------------------------------------------------ */

/** Max characters accepted per free-text answer / context field. */
export const MAX_FIELD_CHARS = 600;

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 5 * 60_000;
const PER_CLIENT_LIMIT = 8; // anonymous playground users
const PER_CLIENT_LIMIT_AUTHED = 30;
const GLOBAL_LIMIT = 200;

/**
 * In-memory sliding-window limiter. The backend has no shared rate-limiting
 * primitive, so this is per server instance — enough to stop casual abuse of
 * the public playground endpoint without adding infrastructure.
 */
export function checkRateLimit(clientKey: string, authed: boolean): boolean {
  const now = Date.now();
  const prune = (b: Bucket) => {
    b.hits = b.hits.filter((t) => now - t < WINDOW_MS);
    return b;
  };

  const global = prune(buckets.get("__global__") ?? { hits: [] });
  buckets.set("__global__", global);
  if (global.hits.length >= GLOBAL_LIMIT) return false;

  const client = prune(buckets.get(clientKey) ?? { hits: [] });
  buckets.set(clientKey, client);
  if (client.hits.length >= (authed ? PER_CLIENT_LIMIT_AUTHED : PER_CLIENT_LIMIT)) return false;

  client.hits.push(now);
  global.hits.push(now);

  // Keep the map from growing without bound on a long-lived instance.
  if (buckets.size > 5000) {
    for (const [key, bucket] of buckets) {
      if (key !== "__global__" && prune(bucket).hits.length === 0) buckets.delete(key);
    }
  }
  return true;
}

/* ------------------------------------------------------------------ *
 * Prompting
 * ------------------------------------------------------------------ */

const SHARED_RULES = [
  "You coach a non-profit board through OKR drafting. Teach, do not merely generate:",
  "every draft must make the reasoning visible so the user learns the pattern.",
  "Keep a clear distinction between an Objective (qualitative direction),",
  "a Key Result (evidence that the objective is being achieved), and",
  "an Initiative (work undertaken to move a Key Result).",
  "Treat unknown measurements honestly: never invent a baseline, current value,",
  "target figure, instrument, budget or date as if it were a fact. When a number",
  "is unknown, say what would have to be established and label it as a suggestion.",
  "Use concise plain language, no management jargon, no marketing tone.",
  "Do not add commentary outside the JSON and do not wrap the JSON in markdown.",
];

const SCHEMAS: Record<DraftMode, string> = {
  objective: `{
  "drafts": [ // 2 to 3 items
    {
      "title": "the objective, one sentence",
      "rationale": "why this framing works, 1-2 sentences",
      "quality": "strong" | "usable" | "refine",
      "warnings": ["short caution", "..."]  // may be empty
    }
  ],
  "next_questions": ["question to sharpen the objective", "..."] // 2 to 3
}`,
  kr: `{
  "drafts": [ // 2 to 3 items
    {
      "statement": "the key result, one sentence",
      "measurement": "the metric or observation logic used as evidence",
      "baseline_state": "known" | "pending" | "exploratory",
      "target_suggestion": "a suggested target, explicitly framed as a suggestion to confirm",
      "instrument_suggestion": "how the evidence could be captured",
      "quality": "strong" | "usable" | "refine",
      "warnings": ["short caution", "..."]
    }
  ],
  "next_questions": []
}`,
  initiative: `{
  "drafts": [ // 2 to 3 items
    {
      "title": "the initiative, short",
      "why": "why it supports the key result",
      "owner_role": "a role, not a person's name",
      "effort": "rough effort estimate, e.g. small / medium / large with a short reason",
      "timing": "timing or dependency note",
      "quality": "strong" | "usable" | "refine",
      "warnings": ["short caution", "..."]
    }
  ],
  "next_questions": []
}`,
};

const MODE_FOCUS: Record<DraftMode, string> = {
  objective:
    "Draft Objectives: qualitative, directional, meaningful to a beneficiary group. No metrics in the title.",
  kr: "Draft Key Results: evidence of progress, not tasks. Baseline state must be 'known' only if the user actually stated a baseline; otherwise 'pending' (a baseline can be established) or 'exploratory' (the right measure is still unclear).",
  initiative:
    "Draft Initiatives: concrete work that moves the key result. Never restate the key result as an initiative.",
};

/* ------------------------------------------------------------------ *
 * Generation
 * ------------------------------------------------------------------ */

export class DraftGenerationError extends Error {
  code: "unavailable" | "rate_limited" | "invalid";
  constructor(code: DraftGenerationError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

function clampField(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD_CHARS) : "";
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

function strList(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .map((x) => x.trim())
        .slice(0, 4)
    : [];
}

function quality(v: unknown): DraftQualityLevel {
  return v === "strong" || v === "usable" || v === "refine" ? v : "usable";
}

function baseline(v: unknown): BaselineState {
  return v === "known" || v === "pending" || v === "exploratory" ? v : "pending";
}

/**
 * Ask the model for drafts in the given mode and language.
 * Throws `DraftGenerationError` on any failure so the UI can fall back to
 * manual editing instead of showing a half-broken result.
 */
export async function generateDrafts(input: {
  mode: DraftMode;
  answers: string[];
  locale: Locale;
  /** Non-sensitive parent context (objective / key result text) from the dashboard. */
  context?: string;
}): Promise<GeneratedDrafts> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new DraftGenerationError("unavailable", "LOVABLE_API_KEY missing");

  const answers = input.answers.slice(0, 3).map(clampField);
  const context = clampField(input.context);

  const system = [
    ...SHARED_RULES,
    MODE_FOCUS[input.mode],
    `Write all user-facing text in ${LANG_NAME[input.locale]}.`,
    "Return STRICT JSON with exactly this shape:",
    SCHEMAS[input.mode],
  ].join("\n");

  const user = JSON.stringify({
    mode: input.mode,
    answers,
    ...(context ? { parent_context: context } : {}),
  });

  let res: Response;
  try {
    res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      }),
    });
  } catch (e) {
    console.warn("[ai-drafts] gateway fetch failed", e);
    throw new DraftGenerationError("unavailable", "gateway unreachable");
  }

  if (res.status === 429) throw new DraftGenerationError("rate_limited", "upstream rate limit");
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(`[ai-drafts] gateway ${res.status}: ${body.slice(0, 300)}`);
    throw new DraftGenerationError("unavailable", `gateway ${res.status}`);
  }

  let raw: string | undefined;
  try {
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    raw = json?.choices?.[0]?.message?.content;
  } catch {
    throw new DraftGenerationError("invalid", "non-JSON gateway response");
  }
  if (!raw) throw new DraftGenerationError("invalid", "empty completion");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new DraftGenerationError("invalid", "model returned non-JSON content");
  }

  const rawDrafts = Array.isArray(parsed["drafts"]) ? (parsed["drafts"] as unknown[]) : [];
  const items = rawDrafts
    .filter((d): d is Record<string, unknown> => Boolean(d) && typeof d === "object")
    .slice(0, 3);
  if (items.length === 0) throw new DraftGenerationError("invalid", "no drafts returned");

  const drafts = items
    .map((d) => {
      if (input.mode === "objective") {
        const title = str(d["title"]);
        if (!title) return null;
        return {
          title,
          rationale: str(d["rationale"]),
          quality: quality(d["quality"]),
          warnings: strList(d["warnings"]),
        } satisfies ObjectiveDraft;
      }
      if (input.mode === "kr") {
        const statement = str(d["statement"]);
        if (!statement) return null;
        return {
          statement,
          measurement: str(d["measurement"]),
          baseline_state: baseline(d["baseline_state"]),
          target_suggestion: str(d["target_suggestion"]),
          instrument_suggestion: str(d["instrument_suggestion"]),
          quality: quality(d["quality"]),
          warnings: strList(d["warnings"]),
        } satisfies KrDraft;
      }
      const title = str(d["title"]);
      if (!title) return null;
      return {
        title,
        why: str(d["why"]),
        owner_role: str(d["owner_role"]),
        effort: str(d["effort"]),
        timing: str(d["timing"]),
        quality: quality(d["quality"]),
        warnings: strList(d["warnings"]),
      } satisfies InitiativeDraft;
    })
    .filter((d): d is ObjectiveDraft | KrDraft | InitiativeDraft => d !== null);

  if (drafts.length === 0) throw new DraftGenerationError("invalid", "no usable drafts");

  return {
    mode: input.mode,
    drafts,
    nextQuestions: input.mode === "objective" ? strList(parsed["next_questions"]) : [],
  };
}
