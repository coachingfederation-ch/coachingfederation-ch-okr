import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Lovable AI Gateway provider for the AI SDK. Server-only: the key is read
 * inside the factory so it is never captured at module scope or shipped to
 * the browser.
 */
export function gatewayModel(modelId = "google/gemini-3.7-flash") {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
  });

  return provider.chatModel(modelId);
}
