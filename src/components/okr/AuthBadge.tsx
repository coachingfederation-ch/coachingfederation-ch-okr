import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { HEADER_MENU, HEADER_MENU_ITEM, HEADER_PILL, useDismissable } from "./use-dismissable";

/**
 * Header account control. Signed out it is an outlined "Sign in" pill; signed
 * in it opens an account menu, matching the public ICF Switzerland header.
 */
export function AuthBadge() {
  const { user, isLoading } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  const ref = useDismissable(open, close);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-10 w-28 animate-pulse rounded-full bg-hero-foreground/10" />;
  }

  if (!user) {
    return (
      <Link to="/auth" className={HEADER_PILL}>
        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
        Sign in
      </Link>
    );
  }

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
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className={HEADER_PILL}
      >
        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
        My account
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className={cn(HEADER_MENU, "min-w-[14rem]")}>
          <p className="border-b border-border/70 px-4 py-3 text-xs leading-5 text-muted-foreground break-all">
            {user.email}
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={() => void onSignOut()}
            disabled={signingOut}
            className={cn(HEADER_MENU_ITEM, "disabled:opacity-50")}
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
