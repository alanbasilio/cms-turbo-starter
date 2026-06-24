import { axiosInstance, client } from "@kubb/plugin-client/clients/axios";
import { isAxiosError } from "axios";
import type { Error as StrapiError } from "@/src/generated/models/Error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";

// Strapi mounts its REST API under /api.
client.setConfig({ baseURL: `${API_URL}/api` });

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

// Attach the JWT to every request once the user is authenticated.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/** Pull a human-readable message out of a Strapi/axios error. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
): string {
  if (isAxiosError<StrapiError>(error)) {
    return error.response?.data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
