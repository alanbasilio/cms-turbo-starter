import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, PUBLIC_ROUTES } from "@/src/lib/auth-constants";

// Next 16 renamed the `middleware` convention to `proxy`. This gates page routes
// by session-cookie presence so unauthenticated users never reach (or download
// the JS for) protected pages. Cookie *validity* is still checked client-side by
// the auth provider, which signs out on a rejected token.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on page routes only — skip the BFF proxy (/api), Next internals, and any
  // file with an extension (static assets).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
