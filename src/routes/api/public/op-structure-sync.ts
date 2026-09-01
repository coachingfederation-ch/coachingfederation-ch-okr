import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled refresh of the mirrored operational structure (teams). Protected by
 * the same shared secret the Welcome app uses, so an anonymous caller cannot
 * trigger a sync.
 */
export const Route = createFileRoute("/api/public/op-structure-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["ROLE_DIRECTORY_SECRET"];
        const provided = request.headers.get("x-role-directory-secret") ?? "";
        if (!secret || provided.length !== secret.length || provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { syncOpStructure } = await import("@/lib/op-structure.server");
        const result = await syncOpStructure();
        return Response.json(result, { status: result.ok ? 200 : 502 });
      },
    },
  },
});
