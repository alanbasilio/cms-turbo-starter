import "server-only";

/**
 * Base URL of the Strapi backend for server-to-server calls (BFF proxy and auth
 * Server Actions). Prefer a server-only var; fall back to the public one so a
 * single `NEXT_PUBLIC_API_URL` still works in development.
 */
export function getStrapiBaseUrl(): string {
  return (
    process.env.STRAPI_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:1337"
  );
}
