import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ICFS OKR Dashboard" },
      { name: "description", content: "Sign in to edit the ICFS 2026 OKR dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading, rejectedEmail } = useAuth();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoading && user) navigate({ to: "/okrs", replace: true });
  }, [user, isLoading, navigate]);

  const onGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: {
          hd: "coachingfederation.ch",
          prompt: "select_account",
        },
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/okrs", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="btn-mono text-primary/70 hover:text-primary text-xs">
          {t("auth.back")}
        </Link>
        <div className="mt-4 rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
          <p className="eyebrow">{t("auth.editorAccess")}</p>
          <h1 className="mt-2 text-2xl font-bold">{t("auth.pageTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.pageSubtitle")}</p>
          <p className="mt-3 text-sm text-muted-foreground">{t("auth.welcomeHint")}</p>

          {rejectedEmail ? (
            <div role="status" className="mt-5 rounded-2xl border border-border/70 bg-muted/50 p-4">
              <p className="text-sm font-semibold">{t("auth.notAuthorizedTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{rejectedEmail}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("auth.notAuthorizedBody")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("auth.notAuthorizedHelp")}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            {busy
              ? t("auth.pleaseWait")
              : rejectedEmail
                ? t("auth.tryAnotherAccount")
                : t("auth.continueWithGoogle")}
          </button>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
