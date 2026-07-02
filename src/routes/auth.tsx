import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

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
  const { user, isLoading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoading && user) navigate({ to: "/", replace: true });
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
        toast.error(
          result.error instanceof Error ? result.error.message : "Google sign-in failed",
        );
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };


  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="btn-mono text-primary/70 hover:text-primary text-xs">
          ← Back to dashboard
        </Link>
        <div className="mt-4 rounded-3xl border border-border/70 bg-card p-8 shadow-[0_1px_2px_rgba(20,20,60,0.04),0_8px_24px_-12px_rgba(20,20,60,0.08)]">
          <p className="eyebrow">ICFS · Editor access</p>
          <h1 className="mt-2 text-2xl font-bold">Sign in to edit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Anyone can view the dashboard. Sign in with your{" "}
            <span className="font-medium text-foreground">@coachingfederation.ch</span>{" "}
            Google account to enable inline editing.
          </p>


          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            {busy ? "Please wait…" : "Continue with Google"}
          </button>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
