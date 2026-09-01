import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { applyMyRoles, type AccessRole } from "@/lib/access.functions";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  /** Role mirrored from the ICF Switzerland Welcome app; null = read-only. */
  role: AccessRole;
  canEdit: boolean;
  isAdmin: boolean;
  /**
   * Email of an account that signed in with Google but is not an editor or
   * admin in the Welcome app. The session is ended immediately; this keeps the
   * reason around so /auth can explain what happened.
   */
  rejectedEmail: string | null;
};

const EMPTY: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  role: null,
  canEdit: false,
  isAdmin: false,
  rejectedEmail: null,
};

const AuthContext = createContext<AuthState>(EMPTY);

function withRole(session: Session | null, role: AccessRole): AuthState {
  return {
    user: session?.user ?? null,
    session: session ?? null,
    isLoading: false,
    role,
    canEdit: role === "editor" || role === "admin",
    isAdmin: role === "admin",
    rejectedEmail: null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(EMPTY);

  useEffect(() => {
    let active = true;

    /**
     * Roles live in the Welcome app and are mirrored here by email. On every
     * session change we ask the server to provision this user's role from the
     * mirror, so removals there take effect on the next sign-in.
     */
    const resolve = async (session: Session | null) => {
      if (!session?.user) {
        // The sign-out that follows a rejection must not erase its explanation.
        if (active) setState((prev) => ({ ...withRole(null, null), rejectedEmail: prev.rejectedEmail }));
        return;
      }
      if (active) setState({ ...withRole(session, null), isLoading: true });
      try {
        const { role, allowed, email } = await applyMyRoles();
        if (!allowed) {
          // Welcome governs access: an unknown account never keeps a session here.
          await supabase.auth.signOut();
          if (active) {
            setState({ ...withRole(null, null), rejectedEmail: email || (session.user.email ?? "") });
          }
          return;
        }
        if (active) setState(withRole(session, role));
      } catch {
        // Role service unavailable: stay signed in, but read-only.
        if (active) setState(withRole(session, null));
      }
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      void resolve(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
