import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  alignmentRowPatchSchema,
  initiativeCreateSchema,
  initiativePatchSchema,
  learningEntryPatchSchema,
  milestonePatchSchema,
  signalPatchSchema,
  keyResultPatchSchema,
  localeSchema,
  okrSetPatchSchema,
  pillarSummaryPatchSchema,
  TRANSLATABLE_FIELDS,
  uuidSchema,
  type AlignmentRowDTO,
  type Contribution,
  type DashboardDTO,
  type InitiativeDTO,
  type KeyResultDTO,
  type LearningEntryDTO,
  type MilestoneDTO,
  type OkrSetDTO,
  type Pillar,
  type PillarSummaryDTO,
  type RoleLabel,
  type SignalDTO,
  type TeamDTO,
} from "./okr-schemas";
import type { Locale, TranslationsMap } from "./i18n-shared";
import { z } from "zod";

function serverPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// -------- Translation helpers (server) --------

/**
 * Keep a row's translations consistent after a write.
 *
 * Important: a row has ONE authoritative source language, stored in
 * `source_lang`, and the base columns always hold text in that language.
 * An editor may however be working in a different UI locale. In that case we
 * must NOT re-label the row (that would make every untouched base column —
 * still written in the old source language — be served raw to viewers of the
 * new one, discarding their cached translations).
 *
 * Instead, when `editorLang !== row.source_lang`, we translate the edited
 * fields from the editor's language back into the row's source language,
 * write that back into the base columns, and cache the editor's own wording
 * under `translations[editorLang]`. `source_lang` stays untouched.
 */
async function translateRow(args: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: { supabase: any };
  table: keyof typeof TRANSLATABLE_FIELDS;
  id: string;
  idColumn?: string;
  sourceLang: Locale;
  patch: Record<string, unknown>;
}) {
  const { ctx, table, id, idColumn = "id", sourceLang: editorLang, patch } = args;
  const fieldKeys = TRANSLATABLE_FIELDS[table] as readonly string[];
  const changed: Record<string, string> = {};
  for (const k of fieldKeys) {
    const v = patch[k];
    if (typeof v === "string") changed[k] = v;
  }

  if (Object.keys(changed).length === 0) return;

  // Read existing translations + the row's authoritative source language.
  const { data: existing } = await ctx.supabase
    .from(table)
    .select("translations,source_lang")
    .eq(idColumn, id)
    .maybeSingle();

  const existingRow = existing as
    | { translations?: unknown; source_lang?: string | null }
    | null;
  const rowSource = ((existingRow?.source_lang ?? editorLang) as Locale);

  const { translateFields, mergeTranslations } = await import("./translate.server");
  const fresh = await translateFields(editorLang, changed);
  const merged = mergeTranslations(existingRow?.translations ?? {}, fresh);

  if (rowSource === editorLang) {
    // Base columns already hold source-language text; just cache translations.
    delete merged[rowSource];
    await ctx.supabase
      .from(table)
      .update({ translations: merged, source_lang: rowSource })
      .eq(idColumn, id);
    return;
  }

  // Cross-language edit: base columns must go back to the row's source
  // language, and the editor's own wording becomes the cached translation.
  const backToSource = fresh[rowSource] ?? {};
  const basePatch: Record<string, string> = {};
  for (const [k, v] of Object.entries(changed)) {
    const translated = backToSource[k];
    if (typeof translated === "string" && translated.trim().length > 0) {
      basePatch[k] = translated;
    } else {
      // Translation unavailable — keep what the editor typed rather than
      // losing the edit. Worst case that one field reads in editorLang.
      basePatch[k] = v;
    }
  }
  merged[editorLang] = { ...(merged[editorLang] ?? {}), ...changed };
  delete merged[rowSource];

  await ctx.supabase
    .from(table)
    .update({ ...basePatch, translations: merged, source_lang: rowSource })
    .eq(idColumn, id);
}


// -------- READ (public) --------

export const getDashboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardDTO> => {
    const supabase = serverPublicClient();
    const [
      pillars,
      sets,
      krs,
      inits,
      aligns,
      secLinks,
      teams,
      signals,
      milestones,
      learning,
    ] = await Promise.all([
      supabase
        .from("pillar_summaries")
        .select("code,label,description,translations,source_lang"),
      supabase
        .from("okr_sets")
        .select(
          "id,number,title,role_label,role_name,customer,pillars,objective,alignment,sort_order,translations,source_lang",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("key_results")
        .select(
          "id,okr_set_id,kr,text,target,lead,sort_order,translations,source_lang,kr_type,measure,instrument,baseline_2026,baseline_locked,current_value,current_as_of,target_2027,milestone_status,milestone_due",
        )
        .order("sort_order", { ascending: true }),

      supabase
        .from("initiatives")
        .select(
          "id,okr_set_id,kr_id,text,owner,description,status,availability,blocked_reason,commitment,help_needed,skill_note,updated_at,sort_order,translations,source_lang,kind,size,team_id,idea,why_now,proposed_owner,start_date,end_date,phase,phase_type,aspiration,bet_action,bet_change,bet_question,confidence,learning_checkpoint,support_needed,out_of_scope,lead_name",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("alignment_rows")
        .select("id,pillar,sg,oe,ce,how,sort_order,translations,source_lang")
        .order("sort_order", { ascending: true }),
      supabase
        .from("initiative_secondary_krs")
        .select("initiative_id,kr_id"),
      supabase
        .from("teams")
        .select("id,name,position,translations,source_lang")
        .order("position", { ascending: true }),
      supabase
        .from("initiative_signals")
        .select(
          "id,initiative_id,name,evidence,how_noticed,starting_point,direction,sort_order,translations,source_lang",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("initiative_milestones")
        .select(
          "id,initiative_id,title,owner,due_date,sort_order,translations,source_lang",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("initiative_learning_entries")
        .select(
          "id,initiative_id,entry_date,author_name,decision,what_happened,signals_telling,surprised_us,proud_of,do_next,next_move,translations,source_lang",
        )
        .order("entry_date", { ascending: false }),
    ]);

    const err =
      pillars.error ||
      sets.error ||
      krs.error ||
      inits.error ||
      aligns.error ||
      secLinks.error ||
      teams.error ||
      signals.error ||
      milestones.error ||
      learning.error;
    if (err) throw new Error(err.message);

    const secByInit = new Map<string, string[]>();
    for (const r of secLinks.data ?? []) {
      const arr = secByInit.get(r.initiative_id) ?? [];
      arr.push(r.kr_id);
      secByInit.set(r.initiative_id, arr);
    }

    const withMeta = <T extends { translations?: unknown; source_lang?: string }>(r: T) => ({
      translations: (r.translations as TranslationsMap) ?? {},
      source_lang: ((r.source_lang ?? "en") as Locale),
    });

    const signalsByInit = new Map<string, SignalDTO[]>();
    for (const r of signals.data ?? []) {
      const arr = signalsByInit.get(r.initiative_id) ?? [];
      arr.push({
        id: r.id,
        initiative_id: r.initiative_id,
        name: r.name ?? "",
        evidence: (r.evidence ?? "see") as SignalDTO["evidence"],
        how_noticed: r.how_noticed ?? "",
        starting_point: r.starting_point ?? "",
        direction: (r.direction as SignalDTO["direction"]) ?? null,
        sort_order: r.sort_order,
        ...withMeta(r),
      });
      signalsByInit.set(r.initiative_id, arr);
    }

    const milestonesByInit = new Map<string, MilestoneDTO[]>();
    for (const r of milestones.data ?? []) {
      const arr = milestonesByInit.get(r.initiative_id) ?? [];
      arr.push({
        id: r.id,
        initiative_id: r.initiative_id,
        title: r.title ?? "",
        owner: r.owner ?? "",
        due_date: r.due_date ?? null,
        sort_order: r.sort_order,
        ...withMeta(r),
      });
      milestonesByInit.set(r.initiative_id, arr);
    }

    const learningByInit = new Map<string, LearningEntryDTO[]>();
    for (const r of learning.data ?? []) {
      const arr = learningByInit.get(r.initiative_id) ?? [];
      arr.push({
        id: r.id,
        initiative_id: r.initiative_id,
        entry_date: r.entry_date,
        author_name: r.author_name ?? "",
        decision: (r.decision ?? "growing") as LearningEntryDTO["decision"],
        what_happened: r.what_happened ?? "",
        signals_telling: r.signals_telling ?? "",
        surprised_us: r.surprised_us ?? "",
        proud_of: r.proud_of ?? "",
        do_next: r.do_next ?? "",
        next_move: r.next_move ?? "",
        ...withMeta(r),
      });
      learningByInit.set(r.initiative_id, arr);
    }

    const initsByKr = new Map<string, InitiativeDTO[]>();
    for (const r of inits.data ?? []) {
      const arr = initsByKr.get(r.kr_id) ?? [];
      arr.push({
        id: r.id,
        okr_set_id: r.okr_set_id,
        kr_id: r.kr_id,
        text: r.text,
        owner: r.owner ?? "",
        description: r.description ?? "",
        status: ((r.status as InitiativeDTO["status"]) ?? "planned"),
        availability: ((r.availability as InitiativeDTO["availability"]) ?? "open"),
        blocked_reason: r.blocked_reason ?? "",
        commitment: (r.commitment as InitiativeDTO["commitment"]) ?? null,
        help_needed: (r.help_needed as InitiativeDTO["help_needed"]) ?? null,
        skill_note: r.skill_note ?? "",
        updated_at: r.updated_at ?? null,
        sort_order: r.sort_order,
        secondary_kr_ids: secByInit.get(r.id) ?? [],
        kind: (r.kind as InitiativeDTO["kind"]) ?? "initiative",
        size: (r.size as InitiativeDTO["size"]) ?? null,
        team_id: r.team_id ?? null,
        idea: r.idea ?? "",
        why_now: r.why_now ?? "",
        proposed_owner: r.proposed_owner ?? "",
        start_date: r.start_date ?? null,
        end_date: r.end_date ?? null,
        phase: r.phase ?? 1,
        phase_type: (r.phase_type as InitiativeDTO["phase_type"]) ?? null,
        aspiration: r.aspiration ?? "",
        bet_action: r.bet_action ?? "",
        bet_change: r.bet_change ?? "",
        bet_question: r.bet_question ?? "",
        confidence: (r.confidence as InitiativeDTO["confidence"]) ?? null,
        learning_checkpoint: r.learning_checkpoint ?? null,
        support_needed: r.support_needed ?? "",
        out_of_scope: r.out_of_scope ?? "",
        lead_name: r.lead_name ?? "",
        signals: signalsByInit.get(r.id) ?? [],
        milestones: milestonesByInit.get(r.id) ?? [],
        learning_entries: learningByInit.get(r.id) ?? [],
        translations: (r as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((r as { source_lang?: string }).source_lang ?? "en") as Locale,
      });
      initsByKr.set(r.kr_id, arr);
    }



    const krsBySet = new Map<string, KeyResultDTO[]>();
    for (const r of krs.data ?? []) {
      const arr = krsBySet.get(r.okr_set_id) ?? [];
      arr.push({
        id: r.id,
        okr_set_id: r.okr_set_id,
        kr: r.kr,
        text: r.text,
        target: r.target,
        lead: r.lead,
        sort_order: r.sort_order,
        kr_type: (r.kr_type ?? "metric") as KeyResultDTO["kr_type"],
        measure: r.measure ?? "",
        instrument: r.instrument ?? "",
        baseline_2026: r.baseline_2026 ?? "",
        baseline_locked: r.baseline_locked ?? false,
        current_value: r.current_value ?? "",
        current_as_of: r.current_as_of ?? null,
        target_2027: r.target_2027 ?? "",
        milestone_status: (r.milestone_status ?? "not_started") as KeyResultDTO["milestone_status"],
        milestone_due: r.milestone_due ?? null,
        translations: (r as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((r as { source_lang?: string }).source_lang ?? "en") as Locale,
        initiatives: initsByKr.get(r.id) ?? [],
      });

      krsBySet.set(r.okr_set_id, arr);
    }

    const okr_sets: OkrSetDTO[] = (sets.data ?? []).map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      role_label: (s.role_label as RoleLabel) ?? "Owner",
      role_name: s.role_name,
      customer: s.customer,
      pillars: (s.pillars ?? []) as Pillar[],
      objective: s.objective,
      alignment: s.alignment,
      sort_order: s.sort_order,
      translations: (s as { translations?: TranslationsMap }).translations ?? {},
      source_lang: ((s as { source_lang?: string }).source_lang ?? "en") as Locale,
      key_results: krsBySet.get(s.id) ?? [],
    }));

    return {
      pillars: (pillars.data ?? []).map((p) => ({
        code: p.code as Pillar,
        label: p.label,
        description: p.description,
        translations: (p as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((p as { source_lang?: string }).source_lang ?? "en") as Locale,
      })) as PillarSummaryDTO[],
      okr_sets,
      alignment_rows: (aligns.data ?? []).map((r) => ({
        ...(r as Omit<AlignmentRowDTO, "translations" | "source_lang" | "sg" | "oe" | "ce">),
        sg: r.sg as Contribution,
        oe: r.oe as Contribution,
        ce: r.ce as Contribution,
        translations: (r as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((r as { source_lang?: string }).source_lang ?? "en") as Locale,
      })) as AlignmentRowDTO[],
      teams: (teams.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        position: r.position,
        translations: (r as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((r as { source_lang?: string }).source_lang ?? "en") as Locale,
      })) as TeamDTO[],
    };
  },
);


// -------- WRITES (editor-only via RLS) --------

// OKR sets
export const updateOkrSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, patch: okrSetPatchSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("okr_sets")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "okr_sets",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

export const addOkrSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ sourceLang: localeSchema.default("en") }).default({ sourceLang: "en" }).parse(raw ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { data: maxRow } = await context.supabase
      .from("okr_sets")
      .select("number,sort_order")
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextNumber = (maxRow?.number ?? 0) + 1;
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("okr_sets")
      .insert({
        number: nextNumber,
        title: "New OKR set",
        role_label: "Owner",
        role_name: "",
        customer: "",
        pillars: [],
        objective: "",
        alignment: "",
        sort_order: nextSort,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteOkrSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("okr_sets")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Key results
export const addKeyResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ okr_set_id: uuidSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: setRow, error: setErr } = await context.supabase
      .from("okr_sets")
      .select("number")
      .eq("id", data.okr_set_id)
      .single();
    if (setErr) throw new Error(setErr.message);
    const { data: maxRow } = await context.supabase
      .from("key_results")
      .select("sort_order")
      .eq("okr_set_id", data.okr_set_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    const kr = `${setRow.number}.${nextSort}`;
    const { data: row, error } = await context.supabase
      .from("key_results")
      .insert({
        okr_set_id: data.okr_set_id,
        kr,
        text: "",
        target: "",
        lead: "",
        sort_order: nextSort,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateKeyResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, patch: keyResultPatchSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("key_results")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "key_results",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

export const deleteKeyResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("key_results")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Initiatives
export const addInitiative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        kr_id: uuidSchema,
        text: initiativeCreateSchema.shape.text,
        owner: initiativeCreateSchema.shape.owner,
        description: initiativeCreateSchema.shape.description,
        status: initiativeCreateSchema.shape.status,
        kind: initiativeCreateSchema.shape.kind,
        team_id: initiativeCreateSchema.shape.team_id,
        idea: initiativeCreateSchema.shape.idea,
        why_now: initiativeCreateSchema.shape.why_now,
        proposed_owner: initiativeCreateSchema.shape.proposed_owner,
        // The guided journey captures the whole framing in one pass, so the
        // create call accepts the same planning layer as the edit patch.
        size: initiativePatchSchema.shape.size,
        start_date: initiativePatchSchema.shape.start_date,
        end_date: initiativePatchSchema.shape.end_date,
        phase: initiativePatchSchema.shape.phase,
        phase_type: initiativePatchSchema.shape.phase_type,
        aspiration: initiativePatchSchema.shape.aspiration,
        bet_action: initiativePatchSchema.shape.bet_action,
        bet_change: initiativePatchSchema.shape.bet_change,
        bet_question: initiativePatchSchema.shape.bet_question,
        confidence: initiativePatchSchema.shape.confidence,
        learning_checkpoint: initiativePatchSchema.shape.learning_checkpoint,
        lead_name: initiativePatchSchema.shape.lead_name,
        secondary_kr_ids: z.array(uuidSchema).max(50).optional(),
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: krRow, error: krErr } = await context.supabase
      .from("key_results")
      .select("okr_set_id")
      .eq("id", data.kr_id)
      .single();
    if (krErr) throw new Error(krErr.message);
    const { data: maxRow } = await context.supabase
      .from("initiatives")
      .select("sort_order")
      .eq("kr_id", data.kr_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("initiatives")
      .insert({
        kr_id: data.kr_id,
        okr_set_id: krRow.okr_set_id,
        text: data.text,
        owner: data.owner ?? "",
        description: data.description ?? "",
        status: data.status ?? "planned",
        kind: data.kind ?? "initiative",
        team_id: data.team_id ?? null,
        idea: data.idea ?? "",
        why_now: data.why_now ?? "",
        proposed_owner: data.proposed_owner ?? "",
        size: data.size ?? null,
        start_date: data.start_date ?? null,
        end_date: data.end_date ?? null,
        phase: data.phase ?? 1,
        phase_type: data.phase_type ?? null,
        aspiration: data.aspiration ?? "",
        bet_action: data.bet_action ?? "",
        bet_change: data.bet_change ?? "",
        bet_question: data.bet_question ?? "",
        confidence: data.confidence ?? null,
        learning_checkpoint: data.learning_checkpoint || null,
        lead_name: data.lead_name ?? "",
        sort_order: nextSort,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const secondary = (data.secondary_kr_ids ?? []).filter((id) => id !== data.kr_id);
    if (secondary.length > 0) {
      const { error: secErr } = await context.supabase
        .from("initiative_secondary_krs")
        .insert(
          Array.from(new Set(secondary)).map((kr_id) => ({
            initiative_id: row.id,
            kr_id,
          })),
        );
      if (secErr) throw new Error(secErr.message);
    }
    const translatePatch: Record<string, string> = { text: data.text };
    if (data.owner) translatePatch.owner = data.owner;
    if (data.description) translatePatch.description = data.description;
    if (data.idea) translatePatch.idea = data.idea;
    if (data.why_now) translatePatch.why_now = data.why_now;
    if (data.proposed_owner) translatePatch.proposed_owner = data.proposed_owner;
    if (data.aspiration) translatePatch.aspiration = data.aspiration;
    if (data.bet_action) translatePatch.bet_action = data.bet_action;
    if (data.bet_change) translatePatch.bet_change = data.bet_change;
    if (data.bet_question) translatePatch.bet_question = data.bet_question;
    await translateRow({
      ctx: context,
      table: "initiatives",
      id: row.id,
      sourceLang: data.sourceLang,
      patch: translatePatch,
    });
    return { id: row.id };
  });


export const updateInitiative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, patch: initiativePatchSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiatives")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiatives",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

export const deleteInitiative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiatives")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setInitiativeSecondaryKrs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, kr_ids: z.array(uuidSchema).max(50) })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: initRow, error: initErr } = await context.supabase
      .from("initiatives")
      .select("kr_id")
      .eq("id", data.id)
      .single();
    if (initErr) throw new Error(initErr.message);
    const seen = new Set<string>();
    const clean = data.kr_ids.filter((k) => {
      if (k === initRow.kr_id || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const { error: delErr } = await context.supabase
      .from("initiative_secondary_krs")
      .delete()
      .eq("initiative_id", data.id);
    if (delErr) throw new Error(delErr.message);
    if (clean.length > 0) {
      const { error: insErr } = await context.supabase
        .from("initiative_secondary_krs")
        .insert(clean.map((kr_id) => ({ initiative_id: data.id, kr_id })));
      if (insErr) throw new Error(insErr.message);
    }
    return { ok: true };
  });

// Re-parent an initiative to a new primary KR. Also removes any secondary
// link to that same KR (mutually exclusive). Used by the KR view's
// "Link initiatives" dialog to move an initiative between KRs.
export const setInitiativePrimaryKr = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: uuidSchema, kr_id: uuidSchema }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiatives")
      .update({ kr_id: data.kr_id })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    const { error: delErr } = await context.supabase
      .from("initiative_secondary_krs")
      .delete()
      .eq("initiative_id", data.id)
      .eq("kr_id", data.kr_id);
    if (delErr) throw new Error(delErr.message);
    return { ok: true };
  });



// Alignment rows
export const updateAlignmentRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, patch: alignmentRowPatchSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("alignment_rows")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "alignment_rows",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

// Pillar summaries
export const updatePillarSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        code: z.enum(["SG", "OE", "CE"]),
        patch: pillarSummaryPatchSchema,
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("pillar_summaries")
      .update(data.patch)
      .eq("code", data.code);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "pillar_summaries",
      id: data.code,
      idColumn: "code",
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

// -------- ASPIRE child records (signals / milestones / learning) --------
// Each follows the same shape as the initiative writes: editor-only via RLS,
// with translations refreshed from the editor's UI language.

export const addSignal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        initiative_id: uuidSchema,
        patch: signalPatchSchema,
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: maxRow } = await context.supabase
      .from("initiative_signals")
      .select("sort_order")
      .eq("initiative_id", data.initiative_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data: row, error } = await context.supabase
      .from("initiative_signals")
      .insert({
        initiative_id: data.initiative_id,
        ...data.patch,
        sort_order: (maxRow?.sort_order ?? 0) + 1,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiative_signals",
      id: row.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { id: row.id };
  });

export const updateSignal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({ id: uuidSchema, patch: signalPatchSchema, sourceLang: localeSchema.default("en") })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiative_signals")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiative_signals",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

export const deleteSignal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiative_signals")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        initiative_id: uuidSchema,
        patch: milestonePatchSchema,
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: maxRow } = await context.supabase
      .from("initiative_milestones")
      .select("sort_order")
      .eq("initiative_id", data.initiative_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data: row, error } = await context.supabase
      .from("initiative_milestones")
      .insert({
        initiative_id: data.initiative_id,
        ...data.patch,
        sort_order: (maxRow?.sort_order ?? 0) + 1,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiative_milestones",
      id: row.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { id: row.id };
  });

export const updateMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        id: uuidSchema,
        patch: milestonePatchSchema,
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiative_milestones")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiative_milestones",
      id: data.id,
      sourceLang: data.sourceLang,
      patch: data.patch,
    });
    return { ok: true };
  });

export const deleteMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiative_milestones")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addLearningEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        initiative_id: uuidSchema,
        patch: learningEntryPatchSchema,
        sourceLang: localeSchema.default("en"),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { entry_date, ...rest } = data.patch;
    const { data: row, error } = await context.supabase
      .from("initiative_learning_entries")
      .insert({
        initiative_id: data.initiative_id,
        ...rest,
        ...(entry_date ? { entry_date } : {}),
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiative_learning_entries",
      id: row.id,
      sourceLang: data.sourceLang,
      patch: rest,
    });
    return { id: row.id };
  });

export const deleteLearningEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: uuidSchema }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiative_learning_entries")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
