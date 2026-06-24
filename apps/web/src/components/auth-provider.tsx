"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetUsersMe } from "@/src/generated/hooks/useGetUsersMe";
import type { UsersPermissionsUser } from "@/src/generated/models/UsersPermissionsUser";
import { clearToken, getToken, setToken } from "@/src/lib/api-client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: UsersPermissionsUser | undefined;
  status: AuthStatus;
  login: (jwt: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Read the token after mount so server and client render the same markup.
  const [token, setTokenState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setHydrated(true);
  }, []);

  const meQuery = useGetUsersMe({
    query: {
      enabled: hydrated && Boolean(token),
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  });

  // A token that the backend rejects is no longer useful — drop it.
  useEffect(() => {
    if (meQuery.isError) {
      clearToken();
      setTokenState(null);
    }
  }, [meQuery.isError]);

  const login = useCallback(
    (jwt: string) => {
      setToken(jwt);
      setTokenState(jwt);
      // Refetch /users/me with the new token.
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    queryClient.clear();
    router.replace("/login");
  }, [queryClient, router]);

  const status: AuthStatus = !hydrated
    ? "loading"
    : !token
      ? "unauthenticated"
      : meQuery.isError
        ? "unauthenticated"
        : meQuery.data
          ? "authenticated"
          : "loading";

  const value = useMemo<AuthContextValue>(
    () => ({ user: meQuery.data, status, login, logout }),
    [meQuery.data, status, login, logout],
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
