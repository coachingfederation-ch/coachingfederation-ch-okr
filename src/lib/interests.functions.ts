import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

/**
 * Volunteer interest capture for the public "Get involved" entry page.
 *
 * Writes go through the publishable key so RLS applies: the table only allows
 * inserts (never public reads), and the policy re-checks the same length
 * bounds validated here.
 */
const interestSchema = z.object({
  initiative_id: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().max(1000).default(""),
});

export const submitInitiativeInterest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => interestSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { error } = await supabase.from("initiative_interests").insert({
      initiative_id: data.initiative_id,
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
