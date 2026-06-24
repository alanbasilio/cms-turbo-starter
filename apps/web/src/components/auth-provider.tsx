"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useGetUsersMe } from "@/src/generated/hooks/useGetUsersMe";
import type { UsersPermissionsUser } from "@/src/generated/models/UsersPermissionsUser";
import { logoutAction } from "@/src/lib/auth-actions";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: UsersPermissionsUser | undefined;
  status: AuthStatus;
  /** Re-fetch the session after a login/register Server Action sets the cookie. */
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // The token lives in an httpOnly cookie, so the client can't read it. We probe
  // the session by hitting /users/me through the proxy, which attaches the token
  // server-side; a missing or rejected cookie surfaces as a query error.
  const meQuery = useGetUsersMe({
    query: { retry: false, staleTime: 5 * 60 * 1000 },
  });

  const refreshSession = useCallback(async () => {
    await queryClient.invalidateQueries();
    router.refresh();
  }, [queryClient, router]);

  const logout = useCallback(async () => {
    await logoutAction();
    queryClient.clear();
    router.replace("/login");
    router.refresh();
  }, [queryClient, router]);

  const status: AuthStatus = meQuery.isPending
    ? "loading"
    : meQuery.data
      ? "authenticated"
      : "unauthenticated";

  const value = useMemo<AuthContextValue>(
    () => ({ user: meQuery.data, status, refreshSession, logout }),
    [meQuery.data, status, refreshSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
