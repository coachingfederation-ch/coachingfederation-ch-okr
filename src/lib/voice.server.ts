import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CHAPTER_KNOWLEDGE } from "@/lib/assistant/knowledge";
import { ASPIRA_IDENTITY, ASPIRA_PERSONALITY, LANG_NAME } from "@/lib/assistant/persona";

/**
 * Realtime voice session for Aspira.
 *
 * The ElevenLabs agent holds only a placeholder prompt; every session is
 * started with an override that carries the live objectives and key results,
 * so the spoken walkthrough can never drift from the dashboard. Read-only:
 * the agent has no tool that writes anything.
 */
export const VOICE_AGENT_ID = "agent_8601m16f5mgmfmh9jbq3q93m4sqj";

/**
 * One narrator per language — a native-sounding voice beats a single
 * multilingual one, so each locale gets its own.
 */
const VOICE_ID: Record<string, string> = {
  en: "6rOxfAnZpbM3VIEhFaeV",
  de: "t6LrOJGOwJlvBxDA0qqG",
  fr: "gAx9hUOvSB0WdmtuJSBl",
  it: "uC9VI5XrTxXRNlCzGSKR",
};

/** Optional playful Swiss German narrator, offered only on top of German. */
const SWISS_GERMAN_VOICE_ID = "ogdlaxy0T9rCSVdH0VJM";

/**
 * Greetings written natively per language rather than translated, so the
 * opening line sounds like a person and not like a localisation string.
 */
const FIRST_MESSAGE: Record<string, string> = {
  en: "Hi, I'm Aspira. I can walk you through the chapter's strategy, objective by objective — or jump straight to whichever one you're curious about. Where shall we start?",
  de: "Hallo, ich bin Aspira. Ich kann dich Objective für Objective durch die Strategie des Chapters führen – oder wir springen direkt zu dem, was dich interessiert. Womit fangen wir an?",
  fr: "Bonjour, je suis Aspira. Je peux vous présenter la stratégie du chapitre, objectif par objectif – ou aller directement à celui qui vous intéresse. Par quoi commençons-nous ?",
  it: "Ciao, sono Aspira. Posso accompagnarti nella strategia del chapter, obiettivo per obiettivo – oppure andiamo subito a quello che ti interessa. Da dove cominciamo?",
};

/** Anything unexpected falls back to English rather than failing the call. */
function normalizeLocale(locale: string): string {
  return locale in FIRST_MESSAGE ? locale : "en";
}

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Supabase public credentials missing");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { apikey: key } },
  });
}

type Snapshot = { number: number; title: string; text: string };

/** Compact, speakable snapshot of the whole portfolio. */
async function strategySnapshot(): Promise<Snapshot[]> {
  const db = publicClient();
  const { data: sets, error } = await db
    .from("okr_sets")
    .select("id, number, title, role_label, role_name, customer, pillars, objective, alignment")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);

  const { data: krs } = await db
    .from("key_results")
    .select("okr_set_id, kr, text, measure, baseline_2026, current_value, target_2027, sort_order")
    .order("sort_order", { ascending: true });

  return (sets ?? []).map((s) => {
    const own = (krs ?? []).filter((k) => k.okr_set_id === s.id);
    const lines = [
      `OBJECTIVE ${s.number}: ${s.title}`,
      `Objective statement: ${s.objective}`,
      `Steward: ${s.role_name || "not assigned"}${s.role_label ? ` (${s.role_label})` : ""}`,
      `Customer: ${s.customer || "not stated"}`,
      `Strategic Focus Areas: ${(s.pillars ?? []).join(", ") || "not stated"}`,
      s.alignment ? `Global alignment: ${s.alignment}` : "",
      own.length
        ? `Key results:\n${own
            .map(
              (k) =>
                `  - ${k.kr}: ${k.text}${k.measure ? ` | measure: ${k.measure}` : ""}` +
                `${k.baseline_2026 ? ` | 2026 baseline: ${k.baseline_2026}` : ""}` +
                `${k.current_value ? ` | current: ${k.current_value}` : ""}` +
                `${k.target_2027 ? ` | 2027 target: ${k.target_2027}` : ""}`,
            )
            .join("\n")}`
        : "Key results: none recorded yet.",
    ].filter(Boolean);
    return { number: s.number, title: s.title, text: lines.join("\n") };
  });
}

function voicePrompt(locale: string, snapshot: Snapshot[]) {
  return [
    ASPIRA_IDENTITY,
    "",
    "You are speaking out loud in a live voice conversation. This is not a chat window.",
    "",
    ASPIRA_PERSONALITY,
    "",
    "Speaking style:",
    "- Short spoken sentences. No markdown, no bullet characters, no headings, no emoji — everything you say is heard, not read.",
    "- Say numbers and dates the way a person would say them.",
    "- Speak in chunks of at most three or four sentences, then pause and invite the listener in ('Shall I go on?', 'Any questions on that one?').",
    "- If you are interrupted, stop, answer the question, then offer to pick up where you left off.",
    "",
    "Your job in this session — a guided walkthrough:",
    "1. Greet the listener, say what you can do, and ask whether they'd like the full walkthrough or a specific objective.",
    "2. For the walkthrough, take the objectives in order. For each one: its number and title, who stewards it, who it is for, what change it describes, and the key results in plain language with baseline and target where they exist.",
    "3. Call the highlight_objective tool with the objective number before you start talking about that objective, every single time, so the listener sees it on screen.",
    "4. After the last objective, briefly tie the picture together and call the end_walkthrough tool.",
    "5. Answer questions at any point using only the facts below.",
    "",
    "Rules:",
    "- You are read-only. You never save, change or delete anything. Say so if asked.",
    "- Use only the facts below. Never invent stewards, numbers, dates, owners or initiatives. If something is not in the facts, say plainly that it is not recorded.",
    "- When a baseline or target is unknown, say what would have to be established instead of inventing a figure.",
    "- Use terminology exactly: The Switzerland Chapter of ICF, Steward, Customer, Strategic Focus Area.",
    `- Speak only ${LANG_NAME[locale] ?? "English"}, from the very first word, whatever language the listener uses.`,
    `- The strategy data below is stored in English. Say it in ${LANG_NAME[locale] ?? "English"} anyway: translate objective titles, key results, numbers and dates as you speak them. Never read an English sentence aloud.`,
    "- Keep these terms unchanged in every language: The Switzerland Chapter of ICF, Steward, Customer, Strategic Focus Area, Objective, Key Result, Initiative.",
    "",
    CHAPTER_KNOWLEDGE,
    "",
    "LIVE STRATEGY DATA (the current objectives and key results):",
    snapshot.map((s) => s.text).join("\n\n"),
  ].join("\n");
}

export type VoiceSession = {
  agentId: string;
  token: string;
  prompt: string;
  firstMessage: string;
  voiceId: string;
  /** Session language passed to the agent override (en | de | fr | it). */
  language: string;
  objectives: { number: number; title: string }[];
};

export async function createVoiceSession(rawLocale: string): Promise<VoiceSession> {
  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) throw new Error("Voice is not connected for this project");

  const locale = normalizeLocale(rawLocale);


  const snapshot = await strategySnapshot();

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${VOICE_AGENT_ID}`,
    { headers: { "xi-api-key": apiKey } },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`[voice] token request failed [${res.status}]: ${body}`);
    throw new Error(`Voice session could not be started [${res.status}]`);
  }
  const { token } = (await res.json()) as { token?: string };
  if (!token) throw new Error("Voice session returned no token");

  return {
    agentId: VOICE_AGENT_ID,
    token,
    prompt: voicePrompt(locale, snapshot),
    firstMessage: FIRST_MESSAGE[locale] ?? FIRST_MESSAGE["en"]!,
    voiceId: VOICE_ID,
    language: locale,
    objectives: snapshot.map((s) => ({ number: s.number, title: s.title })),
  };
}
