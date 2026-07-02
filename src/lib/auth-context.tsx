import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ALLOWED_EMAIL_DOMAIN = "coachingfederation.ch";

function emailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const at = email.lastIndexOf("@");
  return at >= 0 && email.slice(at + 1).toLowerCase() === ALLOWED_EMAIL_DOMAIN;
}

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  canEdit: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  isLoading: true,
  canEdit: false,
});

function toState(session: Session | null): AuthState {
  return {
    user: session?.user ?? null,
    session: session ?? null,
    isLoading: false,
    canEdit: !!session?.user && emailAllowed(session.user.email),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    canEdit: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session ?? null;
      if (session?.user && !emailAllowed(session.user.email)) {
        supabase.auth.signOut();
        return;
      }
      setState(toState(session));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && !emailAllowed(session.user.email)) {
        if (event === "SIGNED_IN") {
          toast.error(`Sign-in is restricted to @${ALLOWED_EMAIL_DOMAIN} accounts.`);
        }
        supabase.auth.signOut();
        setState({ user: null, session: null, isLoading: false, canEdit: false });
        return;
      }
      setState(toState(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

