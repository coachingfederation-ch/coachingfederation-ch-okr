import { LOCALES, LOCALE_LABELS, type Locale } from "./i18n-shared";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-lite";

const LANG_NAME: Record<Locale, string> = {
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
};

export type TranslationOutput = Partial<
  Record<Locale, Record<string, string>>
>;

/**
 * Translate a bag of fields from `sourceLang` into all other supported locales.
 * Returns `{ de: {…}, fr: {…}, it: {…} }` (whichever locales ≠ sourceLang).
 *
 * Empty fields are skipped. On any AI/gateway failure, returns `{}` — callers
 * should treat translations as best-effort and never fail the underlying write.
 */
export async function translateFields(
  sourceLang: Locale,
  fields: Record<string, string>,
): Promise<TranslationOutput> {
  const nonEmpty = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim().length > 0),
  );
  if (Object.keys(nonEmpty).length === 0) return {};

  const targets: Locale[] = LOCALES.filter((l) => l !== sourceLang);
  if (targets.length === 0) return {};

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.warn("[translate] LOVABLE_API_KEY missing; skipping translation");
    return {};
  }

  const targetsBlock = targets
    .map((l) => `  "${l}": /* ${LANG_NAME[l]} (${LOCALE_LABELS[l]}) */ { ${Object.keys(nonEmpty).map((k) => `"${k}": "…"`).join(", ")} }`)
    .join(",\n");

  const system = [
    "You are a professional business translator for a non-profit board dashboard.",
    "Translate the given field values from " + LANG_NAME[sourceLang] + " into: " + targets.map((l) => LANG_NAME[l]).join(", ") + ".",
    "Rules:",
    "- Preserve tone and business register.",
    "- Keep proper nouns, personal names, and acronyms unchanged (ICF, ICFS, OKR, KR, SG, OE, CE).",
    "- Do not add commentary or wrap the output in markdown.",
    "- Return STRICT JSON with exactly this shape:",
    "{",
    targetsBlock,
    "}",
    "- Return one entry per target language and one entry per field key. Do NOT change field keys.",
    "- If a value is a very short label (e.g. one word), still translate it naturally.",
  ].join("\n");

  const user = JSON.stringify({ source_lang: sourceLang, fields: nonEmpty });

  let res: Response;
  try {
    res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });
  } catch (e) {
    console.warn("[translate] gateway fetch failed", e);
    return {};
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(`[translate] gateway ${res.status}: ${body.slice(0, 300)}`);
    return {};
  }

  let json: { choices?: Array<{ message?: { content?: string } }> };
  try {
    json = (await res.json()) as typeof json;
  } catch (e) {
    console.warn("[translate] gateway returned non-JSON", e);
    return {};
  }

  const raw = json?.choices?.[0]?.message?.content;
  if (!raw) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[translate] model returned non-JSON content");
    return {};
  }

  if (!parsed || typeof parsed !== "object") return {};

  const out: TranslationOutput = {};
  for (const lang of targets) {
    const langObj = (parsed as Record<string, unknown>)[lang];
    if (!langObj || typeof langObj !== "object") continue;
    const clean: Record<string, string> = {};
    for (const key of Object.keys(nonEmpty)) {
      const v = (langObj as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim().length > 0) clean[key] = v;
    }
    if (Object.keys(clean).length > 0) out[lang] = clean;
  }
  return out;
}

/**
 * Merge freshly-translated values into an existing `translations` JSONB blob.
 * For every target locale returned, only fields present in `fresh` are
 * replaced; other cached fields for that locale are preserved.
 */
export function mergeTranslations(
  existing: unknown,
  fresh: TranslationOutput,
): Record<string, Record<string, string>> {
  const base: Record<string, Record<string, string>> =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? JSON.parse(JSON.stringify(existing))
      : {};

  for (const [lang, fields] of Object.entries(fresh)) {
    if (!fields) continue;
    const prev = base[lang] && typeof base[lang] === "object" ? base[lang] : {};
    base[lang] = { ...prev, ...fields };
  }
  return base;
}
