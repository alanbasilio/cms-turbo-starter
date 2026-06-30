import { client } from "@kubb/plugin-client/clients/axios";
import { isAxiosError } from "axios";
import type { Error as StrapiError } from "@/src/generated/models/Error";

// The generated client talks to the same-origin BFF proxy
// (src/app/api/strapi/[...path]), which injects the JWT from the httpOnly cookie
// server-side. No token ever lives in client-readable storage.
client.setConfig({ baseURL: "/api/strapi" });

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
