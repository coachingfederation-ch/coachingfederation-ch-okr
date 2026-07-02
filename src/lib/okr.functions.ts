import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  alignmentRowPatchSchema,
  initiativePatchSchema,
  keyResultPatchSchema,
  okrSetPatchSchema,
  pillarSummaryPatchSchema,
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
import { z } from "zod";

function serverPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// -------- READ (public) --------

export const getDashboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardDTO> => {
    const supabase = serverPublicClient();
    const [pillars, sets, krs, inits, aligns] = await Promise.all([
      supabase.from("pillar_summaries").select("code,label,description"),
      supabase
        .from("okr_sets")
        .select(
          "id,number,title,role_label,role_name,customer,pillars,objective,alignment,sort_order",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("key_results")
        .select("id,okr_set_id,kr,text,target,lead,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("initiatives")
        .select("id,okr_set_id,kr_id,text,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("alignment_rows")
        .select("id,pillar,sg,oe,ce,how,sort_order")
        .order("sort_order", { ascending: true }),
    ]);

    const err =
      pillars.error || sets.error || krs.error || inits.error || aligns.error;
    if (err) throw new Error(err.message);

    const initsByKr = new Map<string, InitiativeDTO[]>();
    for (const r of inits.data ?? []) {
      const arr = initsByKr.get(r.kr_id) ?? [];
      arr.push(r as InitiativeDTO);
      initsByKr.set(r.kr_id, arr);
    }
    const krsBySet = new Map<string, KeyResultDTO[]>();
    for (const r of krs.data ?? []) {
      const arr = krsBySet.get(r.okr_set_id) ?? [];
      arr.push({ ...(r as Omit<KeyResultDTO, "initiatives">), initiatives: initsByKr.get(r.id) ?? [] });
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
      key_results: krsBySet.get(s.id) ?? [],
    }));

    return {
      pillars: (pillars.data ?? []) as PillarSummaryDTO[],
      okr_sets,
      alignment_rows: (aligns.data ?? []).map((r) => ({
        ...r,
        sg: r.sg as Contribution,
        oe: r.oe as Contribution,
        ce: r.ce as Contribution,
      })) as AlignmentRowDTO[],
    };
  },
);


// -------- WRITES (editor-only via RLS) --------

const requireOk = <T>(res: { error: { message: string } | null; data: T }) => {
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

// OKR sets
export const updateOkrSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: uuidSchema, patch: okrSetPatchSchema }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("okr_sets")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addOkrSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: maxRow } = await context.supabase
      .from("okr_sets")
      .select("number,sort_order")
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextNumber = (maxRow?.number ?? 0) + 1;
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    const { data, error } = await context.supabase
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
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id };
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
    z.object({ okr_set_id: uuidSchema }).parse(raw),
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
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateKeyResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: uuidSchema, patch: keyResultPatchSchema }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("key_results")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
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
      .object({ okr_set_id: uuidSchema, text: initiativePatchSchema.shape.text })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: maxRow } = await context.supabase
      .from("initiatives")
      .select("sort_order")
      .eq("okr_set_id", data.okr_set_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("initiatives")
      .insert({
        okr_set_id: data.okr_set_id,
        text: data.text,
        sort_order: nextSort,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateInitiative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: uuidSchema, patch: initiativePatchSchema }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("initiatives")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
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
    z.object({ id: uuidSchema, patch: alignmentRowPatchSchema }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("alignment_rows")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
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
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("pillar_summaries")
      .update(data.patch)
      .eq("code", data.code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
