import { createFileRoute } from "@tanstack/react-router";
import { checkRateLimit } from "@/lib/ai-drafts.server";
import { createVoiceSession } from "@/lib/voice.server";

/**
 * Mints a short-lived ElevenLabs conversation token and the live session
 * prompt for Aspira's voice walkthrough. The API key never leaves the server.
 * Rate limited the same way as /api/chat so the public page cannot burn
 * through the chapter's voice minutes.
 */
export const Route = createFileRoute("/api/voice-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { locale?: string; authed?: boolean } = {};
        try {
          body = await request.json();
        } catch {
          /* empty body is fine — English default */
        }

        const clientKey =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "anonymous";
        if (!checkRateLimit(`voice:${clientKey}`, body.authed === true)) {
          return new Response("Too many requests. Please try again in a few minutes.", {
            status: 429,
          });
        }

        try {
          const session = await createVoiceSession(body.locale ?? "en");
          return Response.json(session, {
            headers: { "cache-control": "no-store" },
          });
        } catch (err) {
          console.error("[voice-token] failed", err);
          return new Response(
            err instanceof Error ? err.message : "Voice is unavailable right now.",
            { status: 503 },
          );
        }
      },
    },
  },
});
