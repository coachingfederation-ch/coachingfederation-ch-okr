/**
 * Operational structure mirror.
 *
 * Teams in this dashboard are not maintained here: they are the operational
 * units the ICF Switzerland Welcome app calls `op_projects`, edited by chapter
 * admins in that app's Operational Structure screen. The two apps have separate
 * databases, so the structure travels over HTTP — the same shared-secret
 * pattern the role directory already uses, and only unit names travel.
 *
 * Server-only: every function here uses the service-role client.
 */
import type { Locale } from "@/lib/i18n-shared";

/** Stable URL of the Welcome project's structure endpoint; overridable per environment. */
const DEFAULT_STRUCTURE_URL =
  "https://project--9b53a55c-a944-4840-b29d-ad56f7d750f4.lovable.app/api/public/op-structure";

export type StructureUnit = {
  slug: string;
  name: string;
  name_de: string;
  name_fr: string;
  name_it: string;
  sort_order: number;
  is_community: boolean;
};

type SourceRow = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseStructurePayload(payload: unknown): StructureUnit[] {
  const rows: SourceRow[] = Array.isArray(payload)
    ? (payload as SourceRow[])
    : Array.isArray((payload as { units?: unknown } | null)?.units)
      ? (payload as { units: SourceRow[] }).units
      : [];

  const bySlug = new Map<string, StructureUnit>();
  rows.forEach((row, index) => {
    const slug = str(row["slug"]).toLowerCase();
    const name = str(row["name"]);
    if (!slug || !name) return;
    bySlug.set(slug, {
      slug,
      name,
      name_de: str(row["name_de"]),
      name_fr: str(row["name_fr"]),
      name_it: str(row["name_it"]),
      sort_order: typeof row["sort_order"] === "number" ? row["sort_order"] : index,
      is_community: row["is_community"] === true,
    });
  });
  return [...bySlug.values()].sort((a, b) => a.sort_order - b.sort_order);
}

async function fetchStructure(): Promise<StructureUnit[]> {
  const url = process.env["OP_STRUCTURE_URL"] || DEFAULT_STRUCTURE_URL;
  const secret = process.env["ROLE_DIRECTORY_SECRET"];
  if (!secret) throw new Error("ROLE_DIRECTORY_SECRET is not configured");

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-role-directory-secret": secret, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Welcome structure endpoint responded ${res.status}`);
  return parseStructurePayload(await res.json());
}

/**
 * Loose name comparison for the one-time binding of teams that were seeded
 * locally before the mirror existed: case, punctuation and "and"/"&" differences
 * should not cost an initiative its team.
 */
function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function translationsFor(unit: StructureUnit): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  const add = (locale: Locale, value: string) => {
    if (value) map[locale] = { name: value };
  };
  add("de", unit.name_de);
  add("fr", unit.name_fr);
  add("it", unit.name_it);
  return map;
}

export type StructureSyncResult = { ok: boolean; count: number; error: string };

/** Pull the Welcome structure and make `public.teams` match it. */
export async function syncOpStructure(): Promise<StructureSyncResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  try {
    const units = await fetchStructure();
    if (units.length === 0) {
      // Never empty the team list because the source returned nothing.
      throw new Error("Welcome structure endpoint returned no units");
    }

    const { data: existing, error: readError } = await supabaseAdmin
      .from("teams")
      .select("id, name, external_slug");
    if (readError) throw new Error(readError.message);

    const bySlug = new Map<string, { id: string }>();
    const byName = new Map<string, { id: string }>();
    for (const row of existing ?? []) {
      if (row.external_slug) bySlug.set(row.external_slug, { id: row.id });
      else byName.set(normaliseName(row.name), { id: row.id });
    }

    // Slug wins; a name match binds a locally seeded team to its unit once.
    const rows = units.map((unit, index) => {
      const match = bySlug.get(unit.slug) ?? byName.get(normaliseName(unit.name));
      return {
        ...(match ? { id: match.id } : {}),
        external_slug: unit.slug,
        name: unit.name,
        position: index + 1,
        is_community: unit.is_community,
        is_active: true,
        translations: translationsFor(unit),
        source_lang: "en",
      };
    });

    const { error: upsertError } = await supabaseAdmin
      .from("teams")
      .upsert(rows, { onConflict: "external_slug" });
    if (upsertError) throw new Error(upsertError.message);

    // Anything the structure no longer contains goes away; initiatives that
    // pointed at it fall back to "No team yet" (team_id is nullable).
    const keep = units.map((u) => u.slug);
    const { error: pruneError } = await supabaseAdmin
      .from("teams")
      .delete()
      .not("external_slug", "in", `(${keep.map((s) => `"${s}"`).join(",")})`);
    if (pruneError) throw new Error(pruneError.message);

    const { error: orphanError } = await supabaseAdmin
      .from("teams")
      .delete()
      .is("external_slug", null);
    if (orphanError) throw new Error(orphanError.message);

    await supabaseAdmin
      .from("op_structure_sync_state")
      .update({
        last_run_at: new Date().toISOString(),
        last_status: "ok",
        last_error: "",
        entry_count: units.length,
      })
      .eq("id", true);

    return { ok: true, count: units.length, error: "" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await supabaseAdmin
      .from("op_structure_sync_state")
      .update({ last_run_at: new Date().toISOString(), last_status: "error", last_error: message })
      .eq("id", true);
    return { ok: false, count: 0, error: message };
  }
}

export type StructureOverview = {
  units: { id: string; name: string; position: number; is_community: boolean }[];
  lastRunAt: string | null;
  lastStatus: string;
  lastError: string;
  entryCount: number;
};

/** Admin view of the mirrored structure plus the last sync run. */
export async function readStructureOverview(): Promise<StructureOverview> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: rows }, { data: state }] = await Promise.all([
    supabaseAdmin
      .from("teams")
      .select("id, name, position, is_community")
      .order("position", { ascending: true }),
    supabaseAdmin.from("op_structure_sync_state").select("*").eq("id", true).maybeSingle(),
  ]);

  return {
    units: rows ?? [],
    lastRunAt: state?.last_run_at ?? null,
    lastStatus: state?.last_status ?? "never",
    lastError: state?.last_error ?? "",
    entryCount: state?.entry_count ?? 0,
  };
}
