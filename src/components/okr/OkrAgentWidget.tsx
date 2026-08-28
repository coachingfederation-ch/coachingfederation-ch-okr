import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { X, RotateCcw } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import agentMark from "@/assets/okr-agent-mark.png";

const STORAGE_KEY = "icfs.agent.chat";

/**
 * Aspira opens with a greeting and starter questions that match what the
 * person is looking at, and the same key is sent to the server so the model
 * knows the context of the conversation.
 */
function pageKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/okrs")) return "okrs";
  if (pathname.startsWith("/initiatives")) return "initiatives";
  if (pathname.startsWith("/playground")) return "playground";
  if (pathname.startsWith("/report")) return "report";
  return "";
}

function loadStored(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function OkrAgentWidget() {
  const { t, locale } = useLocale();
  const { session } = useAuth();
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const page = pageKey(pathname);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitial(loadStored());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  return (
    <AgentSurface
      key="agent"
      open={open}
      setOpen={setOpen}
      input={input}
      setInput={setInput}
      initialMessages={initial}
      locale={locale}
      page={page}
      authed={Boolean(session)}
      t={t}
      panelRef={panelRef}
    />
  );
}

type SurfaceProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  input: string;
  setInput: (v: string) => void;
  initialMessages: UIMessage[];
  locale: string;
  page: string;
  authed: boolean;
  t: (k: never) => string;
  panelRef: React.RefObject<HTMLDivElement | null>;
};

function AgentSurface({
  open,
  setOpen,
  input,
  setInput,
  initialMessages,
  locale,
  page,
  authed,
  t,
  panelRef,
}: SurfaceProps) {
  const tr = t as unknown as (k: string) => string;
  const { messages, sendMessage, status, setMessages, error } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ locale, authed, page }),
    }),
  });

  // Persist the rolling conversation in the browser only.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* quota or private mode — the conversation just won't survive a reload */
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  // Fall back to the generic copy on routes without their own context.
  const key = (suffix: string) => {
    const scoped = page ? tr(`agent.ctx.${page}.${suffix}`) : "";
    return scoped && !scoped.startsWith("agent.") ? scoped : tr(`agent.${suffix}`);
  };
  const greeting = key("greeting");
  const starters = [key("s1"), key("s2"), key("s3")];

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? tr("agent.close") : tr("agent.open")}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-5 right-5 z-50 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "transition-transform duration-300 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "motion-safe:animate-[agent-bob_4s_ease-in-out_infinite]",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#EFCB30]/45 motion-safe:animate-[agent-halo_3.2s_ease-in-out_infinite] group-hover:opacity-0 transition-opacity"
        />
        {open ? (
          <X className="relative size-6" />
        ) : (
          <img
            src={agentMark}
            alt=""
            width={512}
            height={512}
            loading="lazy"
            className="relative size-14 drop-shadow-sm motion-safe:animate-[agent-wiggle_6s_ease-in-out_infinite] motion-safe:group-hover:animate-[agent-perk_600ms_ease-out]"
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={tr("agent.title")}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden border border-border bg-card shadow-2xl",
            "inset-x-0 bottom-0 top-0 rounded-none",
            "sm:inset-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(34rem,calc(100vh-8rem))] sm:w-[24rem] sm:rounded-3xl",
            "motion-safe:animate-[agent-pop_260ms_cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        >
          <header className="flex items-start gap-3 border-b border-border bg-[#F8F0E4] px-4 py-3">
            <span className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <img
                src={agentMark}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="size-9 motion-safe:animate-[agent-wiggle_6s_ease-in-out_infinite]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-foreground">
                {tr("agent.title")}
              </p>
              <p className="truncate text-xs text-muted-foreground">{tr("agent.subtitle")}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => {
                setMessages([]);
                try {
                  window.localStorage.removeItem(STORAGE_KEY);
                } catch {
                  /* ignore */
                }
              }}
              aria-label={tr("agent.startOver")}
              title={tr("agent.startOver")}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => setOpen(false)}
              aria-label={tr("agent.close")}
            >
              <X className="size-4" />
            </Button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 px-4 py-4">
              {messages.length === 0 && (
                <div className="motion-safe:animate-[agent-rise_320ms_ease-out] space-y-3">
                  <p className="rounded-2xl bg-muted/60 px-3 py-2 text-sm text-foreground">
                    {greeting}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {starters.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="min-h-11 rounded-full border border-[#5778FA]/35 bg-[#5778FA]/10 px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-[#5778FA]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => {
                const text = m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => (p as { text: string }).text)
                  .join("");
                if (!text) return null;
                return (
                  <Message
                    key={m.id}
                    from={m.role === "user" ? "user" : "assistant"}
                    className="motion-safe:animate-[agent-rise_260ms_ease-out]"
                  >
                    <MessageContent
                      className={cn(
                        "w-full min-w-0 text-sm [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto",
                        m.role === "user" && "bg-primary text-primary-foreground",
                      )}
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}

              {busy && <Shimmer className="text-sm">{tr("agent.thinking")}</Shimmer>}
              {error && <p className="text-sm text-destructive">{tr("agent.error")}</p>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border px-3 py-3">
            <PromptInput
              onSubmit={(_message, event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tr("agent.placeholder")}
                aria-label={tr("agent.placeholder")}
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {tr("agent.disclaimer")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default OkrAgentWidget;
