import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, session, UNAUTHORIZED_EVENT } from "@/lib/api";
import type { Role, User } from "@/lib/types";

interface AuthCtx {
  user: User | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(() => (session.getToken() ? session.getUser() : null));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Revalidate the stored session once.
    if (!session.getToken()) {
      setReady(true);
      return;
    }
    api
      .me()
      .then((u) => {
        session.setUser(u);
        setUser(u);
      })
      .catch((e) => {
        // Only drop the session on auth errors; keep it if backend is temporarily unreachable.
        if (e?.status === 401 || e?.status === 403) {
          session.clear();
          setUser(null);
        }
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    const onUnauth = () => {
      setUser(null);
      qc.clear();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauth);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauth);
  }, [qc]);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await api.login(username, password);
      session.set(res.accessToken, res.user);
      qc.clear();
      setUser(res.user);
      return res.user;
    },
    [qc],
  );

  const logout = useCallback(() => {
    session.clear();
    qc.clear();
    setUser(null);
  }, [qc]);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}

export const isOfficerPlus = (r?: Role) => r === "SCRUTINY_OFFICER" || r === "REGIONAL_DIRECTOR" || r === "ADMIN";
export const isReviewer = (r?: Role) => r === "SCRUTINY_OFFICER" || r === "REGIONAL_DIRECTOR";
export const canDecide = (r?: Role) => r === "REGIONAL_DIRECTOR";
export const isAdmin = (r?: Role) => r === "ADMIN";
export const isInstitution = (r?: Role) => r === "INSTITUTION";

export function homePathFor(role?: Role) {
  if (role === "INSTITUTION") return "/portal/my-applications";
  return "/portal/dashboard";
}
