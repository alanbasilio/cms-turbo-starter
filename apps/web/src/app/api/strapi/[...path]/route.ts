import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/src/lib/auth-constants";
import { getStrapiBaseUrl } from "@/src/lib/strapi";

/**
 * BFF proxy: forwards `/api/strapi/<path>` to the Strapi REST API, injecting the
 * JWT from the httpOnly cookie as a Bearer token. This keeps the token off the
 * client (XSS-safe) while letting the generated React Query hooks call Strapi as
 * if it were same-origin.
 */
async function handler(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  const target = `${getStrapiBaseUrl()}/api/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType)
    responseHeaders.set("content-type", responseContentType);

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
