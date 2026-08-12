import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { LOCALES, type Locale } from "./i18n-shared";
import {
  checkRateLimit,
  DraftGenerationError,
  generateDrafts,
  MAX_FIELD_CHARS,
  type DraftMode,
  type GeneratedDrafts,
} from "./ai-drafts.server";

const MODES: DraftMode[] = ["objective", "kr", "initiative"];

export type DraftRequest = {
  mode: DraftMode;
  answers: string[];
  locale: Locale;
  /** Non-sensitive parent objective / key result text from the live dashboard. */
  context?: string;
};

export type DraftResponse =
  | { ok: true; result: GeneratedDrafts }
  | { ok: false; code: "unavailable" | "rate_limited" | "invalid" };

function validate(input: unknown): DraftRequest {
  const raw = (input ?? {}) as Record<string, unknown>;
  const mode = MODES.includes(raw["mode"] as DraftMode) ? (raw["mode"] as DraftMode) : "objective";
  const locale = LOCALES.includes(raw["locale"] as Locale) ? (raw["locale"] as Locale) : "en";
  const answers = (Array.isArray(raw["answers"]) ? raw["answers"] : [])
    .slice(0, 3)
    .map((a) => (typeof a === "string" ? a.slice(0, MAX_FIELD_CHARS) : ""));
  const context = typeof raw["context"] === "string" ? raw["context"].slice(0, MAX_FIELD_CHARS) : undefined;
  if (answers.every((a) => a.trim().length === 0)) throw new Error("empty input");
  return { mode, answers, locale, ...(context ? { context } : {}) };
}

function clientKey(): { key: string; authed: boolean } {
  const request = getRequest();
  const headers = request?.headers;
  const forwarded = headers?.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    headers?.get("cf-connecting-ip") ||
    headers?.get("x-real-ip") ||
    "unknown";
  const authed = Boolean(headers?.get("authorization"));
  return { key: `${authed ? "a" : "p"}:${ip}`, authed };
}

/**
 * Public generation endpoint used by both the /playground and the authenticated
 * assistant drawer. Rate limited per client, never writes to the database, and
 * only receives the user's own free-text answers plus optional parent OKR text.
 */
export const generateOkrDrafts = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }): Promise<DraftResponse> => {
    const { key, authed } = clientKey();
    if (!checkRateLimit(key, authed)) return { ok: false, code: "rate_limited" };

    try {
      const result = await generateDrafts(data);
      return { ok: true, result };
    } catch (e) {
      const code = e instanceof DraftGenerationError ? e.code : "unavailable";
      return { ok: false, code };
    }
  });
