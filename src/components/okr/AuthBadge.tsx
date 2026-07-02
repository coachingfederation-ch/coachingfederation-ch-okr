import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";

export function AuthBadge() {
  const { user, isLoading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-8 w-24 rounded-md bg-white/10 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="btn-mono inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-4 text-white hover:bg-white/20 transition-colors"
      >
        Sign in to edit
      </Link>
    );
  }

  const onSignOut = async () => {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
    setSigningOut(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
        <UserRound className="h-3.5 w-3.5" />
        {user.email}
      </span>
      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="btn-mono inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
        title="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
