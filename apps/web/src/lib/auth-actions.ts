"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE } from "@/src/lib/auth-constants";
import { getStrapiBaseUrl } from "@/src/lib/strapi";

export type AuthResult = { ok: true } | { ok: false; error: string };

type LoginInput = { identifier: string; password: string };
type RegisterInput = { username: string; email: string; password: string };

/** Calls a Strapi auth endpoint and, on success, stores the JWT httpOnly. */
async function authenticate(
  endpoint: "auth/local" | "auth/local/register",
  payload: LoginInput | RegisterInput,
): Promise<AuthResult> {
  let response: Response;
  try {
    response = await fetch(`${getStrapiBaseUrl()}/api/${endpoint}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "Não foi possível conectar ao servidor." };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.jwt) {
    const message = data?.error?.message ?? "Credenciais inválidas.";
    return { ok: false, error: message };
  }

  (await cookies()).set(AUTH_COOKIE, data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return { ok: true };
}

export async function loginAction(values: LoginInput): Promise<AuthResult> {
  return authenticate("auth/local", values);
}

export async function registerAction(
  values: RegisterInput,
): Promise<AuthResult> {
  return authenticate("auth/local/register", values);
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(AUTH_COOKIE);
}
