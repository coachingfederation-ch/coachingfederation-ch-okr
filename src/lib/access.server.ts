/**
 * Access directory: roles are owned by the ICF Switzerland Welcome app and
 * mirrored here by email address. The two apps have separate user stores, so
 * a person signs in here with the same Google account and we grant the role
 * their Welcome membership says they should have.
 *
 * Server-only: every function here uses the service-role client.
 */
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

/** Welcome roles that map onto this app's two levels. Everything else is read-only. */
const ADMIN_SOURCE_ROLES = new Set(["admin", "administrator"]);
const EDITOR_SOURCE_ROLES = new Set(["editor", "publisher", "organizer"]);

/** Highest level wins; null means "no edit rights here". */
export function mapSourceRoles(roles: readonly string[]): AppRole | null {
  const normalised = roles.map((r) => r.trim().toLowerCase());
  if (normalised.some((r) => ADMIN_SOURCE_ROLES.has(r))) return "admin";
  if (normalised.some((r) => EDITOR_SOURCE_ROLES.has(r))) return "editor";
  return null;
}

export function normaliseEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/** Stable URL of the Welcome project's role endpoint; overridable per environment. */
const DEFAULT_DIRECTORY_URL =
  "https://project--9b53a55c-a944-4840-b29d-ad56f7d750f4.lovable.app/api/public/role-directory";

type DirectoryEntry = { email: string; role: AppRole; source_roles: string[] };

type SourceRow = { email?: unknown; roles?: unknown };

function parseDirectoryPayload(payload: unknown): DirectoryEntry[] {
  const rows: SourceRow[] = Array.isArray(payload)
    ? (payload as SourceRow[])
    : Array.isArray((payload as { members?: unknown } | null)?.members)
      ? (payload as { members: SourceRow[] }).members
      : [];

  const byEmail = new Map<string, DirectoryEntry>();
  for (const row of rows) {
    const email = normaliseEmail(typeof row.email === "string" ? row.email : "");
    if (!email.includes("@")) continue;
    const sourceRoles = Array.isArray(row.roles)
      ? row.roles.filter((r): r is string => typeof r === "string")
      : [];
    const role = mapSourceRoles(sourceRoles);
    if (!role) continue;
    // admin beats editor when a person appears twice
    const existing = byEmail.get(email);
    if (existing && existing.role === "admin") continue;
    byEmail.set(email, { email, role, source_roles: sourceRoles });
  }
  return [...byEmail.values()];
}

async function fetchDirectory(): Promise<DirectoryEntry[]> {
  const url = process.env["ROLE_DIRECTORY_URL"] || DEFAULT_DIRECTORY_URL;
  const secret = process.env["ROLE_DIRECTORY_SECRET"];
  if (!secret) throw new Error("ROLE_DIRECTORY_SECRET is not configured");

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-role-directory-secret": secret, accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Welcome directory responded ${res.status}`);
  }
  return parseDirectoryPayload(await res.json());
}

/** Map every known auth user's email to their user id (paged, service role). */
async function listUserIdsByEmail(): Promise<Map<string, string>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const byEmail = new Map<string, string>();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    for (const user of data.users) {
      const email = normaliseEmail(user.email);
      if (email) byEmail.set(email, user.id);
    }
    if (data.users.length < 200) break;
  }
  return byEmail;
}

/** Bring public.user_roles in line with the mirrored directory. */
async function reconcileUserRoles(entries: DirectoryEntry[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const wanted = new Map(entries.map((e) => [e.email, e.role]));
  const idsByEmail = await listUserIdsByEmail();

  const { data: existing, error } = await supabaseAdmin
    .from("user_roles")
    .select("id, user_id, role");
  if (error) throw new Error(error.message);

  const idToEmail = new Map([...idsByEmail].map(([email, id]) => [id, email]));

  const staleIds = (existing ?? [])
    .filter((row) => wanted.get(idToEmail.get(row.user_id) ?? "") !== row.role)
    .map((row) => row.id);

  if (staleIds.length > 0) {
    const { error: delError } = await supabaseAdmin.from("user_roles").delete().in("id", staleIds);
    if (delError) throw new Error(delError.message);
  }

  const inserts = [...wanted]
    .map(([email, role]) => ({ user_id: idsByEmail.get(email), role }))
    .filter((row): row is { user_id: string; role: AppRole } => !!row.user_id);

  if (inserts.length > 0) {
    const { error: insError } = await supabaseAdmin
      .from("user_roles")
      .upsert(inserts, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (insError) throw new Error(insError.message);
  }
}

export type SyncResult = { ok: boolean; count: number; error: string };

/** Pull the Welcome directory, replace the mirror, then reconcile local roles. */
export async function syncRoleDirectory(): Promise<SyncResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  try {
    const fetched = await fetchDirectory();
    if (fetched.length === 0) {
      // Never wipe access because the source returned an empty list.
      throw new Error("Welcome directory returned no editors or admins");
    }

    /**
     * Local overrides cover people whose Welcome membership uses a different
     * address than the Google account they sign in with here. They are merged
     * on top of the fetched directory and win on conflict.
     */
    const { data: overrides } = await supabaseAdmin
      .from("role_overrides")
      .select("email, role");
    const merged = new Map(fetched.map((e) => [e.email, e]));
    for (const row of overrides ?? []) {
      const email = normaliseEmail(row.email);
      if (!email.includes("@")) continue;
      merged.set(email, { email, role: row.role as AppRole, source_roles: ["override"] });
    }
    const entries = [...merged.values()];


    const syncedAt = new Date().toISOString();
    const { error: upsertError } = await supabaseAdmin.from("role_directory").upsert(
      entries.map((e) => ({ ...e, synced_at: syncedAt })),
      { onConflict: "email" },
    );
    if (upsertError) throw new Error(upsertError.message);

    const { error: pruneError } = await supabaseAdmin
      .from("role_directory")
      .delete()
      .not("email", "in", `(${entries.map((e) => `"${e.email}"`).join(",")})`);
    if (pruneError) throw new Error(pruneError.message);

    await reconcileUserRoles(entries);

    await supabaseAdmin
      .from("role_sync_state")
      .update({
        last_run_at: syncedAt,
        last_status: "ok",
        last_error: "",
        entry_count: entries.length,
      })
      .eq("id", true);

    return { ok: true, count: entries.length, error: "" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await supabaseAdmin
      .from("role_sync_state")
      .update({ last_run_at: new Date().toISOString(), last_status: "error", last_error: message })
      .eq("id", true);
    return { ok: false, count: 0, error: message };
  }
}

/**
 * Refresh the mirror when it is older than an hour. Sign-ins are the natural
 * trigger, so no scheduled job (and no shared key inside the database) is
 * needed. Failures are swallowed: a stale mirror is better than a failed login.
 */
const MAX_MIRROR_AGE_MS = 60 * 60 * 1000;

async function refreshMirrorIfStale(): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: state } = await supabaseAdmin
      .from("role_sync_state")
      .select("last_run_at")
      .eq("id", true)
      .maybeSingle();

    const lastRun = state?.last_run_at ? Date.parse(state.last_run_at) : 0;
    if (Date.now() - lastRun < MAX_MIRROR_AGE_MS) return;
    await syncRoleDirectory();
  } catch {
    // Mirror stays as-is; applyRolesForUser still reads the last known state.
  }
}

/**
 * The teams list mirrors the same Welcome app, so it rides on the same trigger:
 * refresh it at most hourly when someone signs in. Kept separate from the role
 * mirror so a failure on one side never blocks the other.
 */
async function refreshStructureIfStale(): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: state } = await supabaseAdmin
      .from("op_structure_sync_state")
      .select("last_run_at")
      .eq("id", true)
      .maybeSingle();

    const lastRun = state?.last_run_at ? Date.parse(state.last_run_at) : 0;
    if (Date.now() - lastRun < MAX_MIRROR_AGE_MS) return;
    const { syncOpStructure } = await import("./op-structure.server");
    await syncOpStructure();
  } catch {
    // Teams stay as they are; a stale team list is better than a failed sign-in.
  }
}

/** Give the signed-in user exactly the role the mirror says they should have. */
export async function applyRolesForUser(userId: string, email: string): Promise<AppRole | null> {
  await refreshMirrorIfStale();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalised = normaliseEmail(email);

  const { data: entry } = await supabaseAdmin
    .from("role_directory")
    .select("role")
    .eq("email", normalised)
    .maybeSingle();

  const role = (entry?.role ?? null) as AppRole | null;

  const { data: current } = await supabaseAdmin
    .from("user_roles")
    .select("id, role")
    .eq("user_id", userId);

  const stale = (current ?? []).filter((row) => row.role !== role).map((row) => row.id);
  if (stale.length > 0) {
    await supabaseAdmin.from("user_roles").delete().in("id", stale);
  }

  if (role && !(current ?? []).some((row) => row.role === role)) {
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role }, { onConflict: "user_id,role", ignoreDuplicates: true });
  }

  return role;
}

/** Throws unless the caller holds the admin role in this app. */
export async function assertAdmin(
  supabase: {
    rpc: (
      fn: "has_role",
      args: { _user_id: string; _role: AppRole },
    ) => PromiseLike<{ data: unknown }>;
  },
  userId: string,
): Promise<void> {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden");
}

export type AccessOverview = {
  entries: { email: string; role: AppRole; synced_at: string }[];
  lastRunAt: string | null;
  lastStatus: string;
  lastError: string;
  entryCount: number;
};

/** Admin view of the mirror plus the last sync run. */
export async function readAccessOverview(): Promise<AccessOverview> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: rows }, { data: state }] = await Promise.all([
    supabaseAdmin.from("role_directory").select("email, role, synced_at").order("email"),
    supabaseAdmin.from("role_sync_state").select("*").eq("id", true).maybeSingle(),
  ]);

  return {
    entries: rows ?? [],
    lastRunAt: state?.last_run_at ?? null,
    lastStatus: state?.last_status ?? "never",
    lastError: state?.last_error ?? "",
    entryCount: state?.entry_count ?? 0,
  };
}
