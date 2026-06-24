"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/components/auth-provider";

/** Sends already-authenticated users away from the auth pages. */
export function useRedirectIfAuthenticated(to = "/") {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") router.replace(to);
  }, [status, router, to]);
}
