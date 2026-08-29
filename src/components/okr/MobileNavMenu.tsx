import * as React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Menu, ShieldCheck, UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n-shared";
import { cn } from "@/lib/utils";

/**
 * Phone-sized navigation. The desktop header cluster (pill nav + language +
 * account) wraps into three rows below `md`, so on mobile we collapse all of
 * it behind one menu button that opens a slide-in panel.
 */

const SECTION_LABEL =
  "px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-hero-foreground/50";

const ROW =
  "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-hero-foreground/80 transition-colors hover:bg-hero-foreground/10 hover:text-hero-foreground";

const ROW_ACTIVE = "bg-hero-foreground text-primary hover:bg-hero-foreground hover:text-primary";

export function MobileNavMenu({ className }: { className?: string }) {
  const { t, locale, setLocale } = useLocale();
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const path = router.state.location.pathname;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const links = [
    { to: "/", label: t("involve.nav"), active: path === "/" },
    { to: "/okrs", label: t("nav.okrs"), active: path.startsWith("/okrs") },
    {
      to: "/initiatives",
      label: t("nav.initiatives"),
      active: path.startsWith("/initiatives"),
    },
    { to: "/voice", label: t("voice.nav"), active: path.startsWith("/voice") },
    { to: "/report", label: t("report.nav"), active: path.startsWith("/report") },
    {
      to: "/playground",
      label: t("playground.nav"),
      active: path.startsWith("/playground"),
    },
  ] as const;

  const onSignOut = async () => {
    setSigningOut(true);
    close();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
    setSigningOut(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menu"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-hero-foreground/25 text-hero-foreground transition-colors hover:border-hero-foreground/60 hover:bg-hero-foreground/10",
          className,
        )}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[86vw] max-w-sm border-l-0 bg-hero p-0 text-hero-foreground"
      >
        <SheetHeader className="px-5 pt-5 pb-2 text-left">
          <SheetTitle className="font-heading text-lg text-hero-foreground">
            {t("nav.more")}
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Primary" className="px-4 pb-2">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={close}
                  aria-current={l.active ? "page" : undefined}
                  className={cn(ROW, l.active && ROW_ACTIVE)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-3 border-t border-hero-foreground/15 px-4 pt-4">
          <p className={SECTION_LABEL}>Sprache · Langue · Lingua · Language</p>
          <ul role="group" aria-label="Language" className="flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={l === locale}
                  onClick={() => {
                    setLocale(l);
                    close();
                  }}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border border-hero-foreground/25 px-4 text-xs font-bold uppercase tracking-wider text-hero-foreground/80 transition-colors hover:bg-hero-foreground/10",
                    l === locale && "border-transparent bg-hero-foreground text-primary",
                  )}
                >
                  {l.toUpperCase()}
                  <span className="sr-only">{LOCALE_LABELS[l]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-hero-foreground/15 px-4 py-4">
          {isLoading ? (
            <div className="h-11 w-full animate-pulse rounded-xl bg-hero-foreground/10" />
          ) : user ? (
            <>
              <p className="px-1 pb-2 text-xs leading-5 break-all text-hero-foreground/60">
                {user.email}
              </p>
              {isAdmin && (
                <Link to="/access" onClick={close} className={ROW}>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Access directory
                </Link>
              )}
              <button
                type="button"
                onClick={() => void onSignOut()}
                disabled={signingOut}
                className={cn(ROW, "disabled:opacity-50")}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={close} className={ROW}>
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Sign in
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
