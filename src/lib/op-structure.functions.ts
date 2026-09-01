import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StructureUnitDTO = {
  id: string;
  name: string;
  position: number;
  is_community: boolean;
};

export type StructureOverviewDTO = {
  units: StructureUnitDTO[];
  lastRunAt: string | null;
  lastStatus: string;
  lastError: string;
  entryCount: number;
};

/** Admin-only view of the mirrored operational structure and its last sync. */
export const getStructureOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StructureOverviewDTO> => {
    const { assertAdmin } = await import("./access.server");
    const { readStructureOverview } = await import("./op-structure.server");
    await assertAdmin(context.supabase, context.userId);
    return readStructureOverview();
  });

/** Admin-triggered refresh of the teams mirror from the Welcome app. */
export const syncStructure = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./access.server");
    const { syncOpStructure } = await import("./op-structure.server");
    await assertAdmin(context.supabase, context.userId);
    return syncOpStructure();
  });
