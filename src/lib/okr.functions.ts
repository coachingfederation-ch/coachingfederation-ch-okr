import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  alignmentRowPatchSchema,
  initiativeCreateSchema,
  initiativePatchSchema,

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
  type OkrSetDTO,
  type Pillar,
  type PillarSummaryDTO,
  type RoleLabel,
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

async function translateRow(args: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: { supabase: any };
  table: keyof typeof TRANSLATABLE_FIELDS;
  id: string;
  idColumn?: string;
  sourceLang: Locale;
  patch: Record<string, unknown>;
}) {
  const { ctx, table, id, idColumn = "id", sourceLang, patch } = args;
  const fieldKeys = TRANSLATABLE_FIELDS[table] as readonly string[];
  const changed: Record<string, string> = {};
  for (const k of fieldKeys) {
    const v = patch[k];
    if (typeof v === "string") changed[k] = v;
  }

  // Nothing translatable in this patch → still make sure source_lang is set.
  if (Object.keys(changed).length === 0) return;

  // Read existing translations blob so we can merge non-changed fields.
  const { data: existing } = await ctx.supabase
    .from(table)
    .select("translations")
    .eq(idColumn, id)
    .maybeSingle();

  const { translateFields, mergeTranslations } = await import("./translate.server");
  const fresh = await translateFields(sourceLang, changed);
  const merged = mergeTranslations(
    (existing as { translations?: unknown } | null)?.translations ?? {},
    fresh,
  );

  await ctx.supabase
    .from(table)
    .update({ translations: merged, source_lang: sourceLang })
    .eq(idColumn, id);
}

// -------- READ (public) --------

export const getDashboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardDTO> => {
    const supabase = serverPublicClient();
    const [pillars, sets, krs, inits, aligns] = await Promise.all([
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
        .select("id,okr_set_id,kr,text,target,lead,sort_order,translations,source_lang")
        .order("sort_order", { ascending: true }),
      supabase
        .from("initiatives")
        .select("id,okr_set_id,kr_id,text,owner,description,status,sort_order,translations,source_lang")
        .order("sort_order", { ascending: true }),
      supabase
        .from("alignment_rows")
        .select("id,pillar,sg,oe,ce,how,sort_order,translations,source_lang")
        .order("sort_order", { ascending: true }),
    ]);

    const err =
      pillars.error || sets.error || krs.error || inits.error || aligns.error;
    if (err) throw new Error(err.message);

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
        sort_order: r.sort_order,
        translations: (r as { translations?: TranslationsMap }).translations ?? {},
        source_lang: ((r as { source_lang?: string }).source_lang ?? "en") as Locale,
      });
      initsByKr.set(r.kr_id, arr);
    }

    const krsBySet = new Map<string, KeyResultDTO[]>();
    for (const r of krs.data ?? []) {
      const arr = krsBySet.get(r.okr_set_id) ?? [];
      arr.push({
        ...(r as Omit<KeyResultDTO, "initiatives" | "translations" | "source_lang">),
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
        sort_order: nextSort,
        source_lang: data.sourceLang,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await translateRow({
      ctx: context,
      table: "initiatives",
      id: row.id,
      sourceLang: data.sourceLang,
      patch: { text: data.text },
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
