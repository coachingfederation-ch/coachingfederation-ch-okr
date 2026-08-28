import { tool } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Read-only assistant tools. They use the publishable (anon) key, so they can
 * only ever see the data the public dashboard already shows, and RLS still
 * applies. No tool writes anything.
 */
function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Supabase public credentials missing");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { apikey: key } },
  });
}

export const assistantTools = {
  list_objectives: tool({
    description:
      "List the chapter's current objectives (OKR sets) with number, title, steward, customer and strategic focus areas.",
    inputSchema: z.object({}),
    execute: async () => {
      const { data, error } = await publicClient()
        .from("okr_sets")
        .select("id, number, title, role_label, role_name, customer, pillars, objective")
        .order("sort_order", { ascending: true });
      if (error) return { error: error.message };
      return { objectives: data ?? [] };
    },
  }),

  get_objective: tool({
    description:
      "Get one objective with its key results and measurement state. Identify it by its number (1-5).",
    inputSchema: z.object({ number: z.number().int().min(1).max(20) }),
    execute: async ({ number }) => {
      const db = publicClient();
      const { data: set, error } = await db
        .from("okr_sets")
        .select("id, number, title, role_label, role_name, customer, pillars, objective, alignment")
        .eq("number", number)
        .maybeSingle();
      if (error) return { error: error.message };
      if (!set) return { found: false };
      const { data: krs } = await db
        .from("key_results")
        .select(
          "id, kr, text, measure, instrument, baseline_2026, current_value, current_as_of, target_2027, milestone_status",
        )
        .eq("okr_set_id", set.id)
        .order("sort_order", { ascending: true });
      return { found: true, objective: set, key_results: krs ?? [] };
    },
  }),

  search_initiatives: tool({
    description:
      "Search the initiative portfolio by free text. Returns title, owner, status, phase and availability, plus a link path.",
    inputSchema: z.object({
      query: z.string().max(120).optional(),
      limit: z.number().int().min(1).max(15).optional(),
    }),
    execute: async ({ query, limit }) => {
      let q = publicClient()
        .from("initiatives")
        .select("id, text, owner, description, status, phase, availability, commitment")
        .limit(limit ?? 8);
      if (query && query.trim()) q = q.ilike("text", `%${query.trim()}%`);
      const { data, error } = await q;
      if (error) return { error: error.message };
      return {
        initiatives: (data ?? []).map((i) => ({ ...i, path: `/initiatives/${i.id}` })),
      };
    },
  }),

  draft_okr: tool({
    description:
      "Produce teaching drafts for an objective, a key result or an initiative. Pass the user's answers (up to 3 short strings) and, where relevant, the parent objective or key result text as context.",
    inputSchema: z.object({
      mode: z.enum(["objective", "kr", "initiative"]),
      answers: z.array(z.string().max(600)).max(3),
      context: z.string().max(600).optional(),
      locale: z.enum(["en", "de", "fr", "it"]).optional(),
    }),
    execute: async ({ mode, answers, context, locale }) => {
      const { generateDrafts } = await import("@/lib/ai-drafts.server");
      try {
        return await generateDrafts({
          mode,
          answers,
          context,
          locale: locale ?? "en",
        });
      } catch (err) {
        return { error: err instanceof Error ? err.message : "drafting unavailable" };
      }
    },
  }),
};
