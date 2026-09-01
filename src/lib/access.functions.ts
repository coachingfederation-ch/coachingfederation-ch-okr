import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AccessRole = "editor" | "admin" | null;

export type DirectoryEntryDTO = {
  email: string;
  role: "editor" | "admin";
  synced_at: string;
};

export type AccessOverviewDTO = {
  entries: DirectoryEntryDTO[];
  lastRunAt: string | null;
  lastStatus: string;
  lastError: string;
  entryCount: number;
};

/**
 * Provision the signed-in user's role from the mirrored Welcome directory.
 * A user can only ever provision themselves — the id comes from their token.
 * `allowed` is false when the Welcome app knows nothing about this address:
 * the dashboard then ends the session rather than leaving a stranger signed in.
 */
export const applyMyRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { applyRolesForUser } = await import("./access.server");
    const email = typeof context.claims["email"] === "string" ? context.claims["email"] : "";
    const role = await applyRolesForUser(context.userId, email);
    return { role: role as AccessRole, allowed: role !== null, email };
  });


/** Admin-only view of the mirror and the last sync run. */
export const getAccessOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccessOverviewDTO> => {
    const { assertAdmin, readAccessOverview } = await import("./access.server");
    await assertAdmin(context.supabase, context.userId);
    return readAccessOverview();
  });

/** Admin-triggered refresh from the Welcome app. */
export const syncAccessDirectory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, syncRoleDirectory } = await import("./access.server");
    await assertAdmin(context.supabase, context.userId);
    return syncRoleDirectory();
  });
