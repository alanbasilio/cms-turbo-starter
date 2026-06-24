// Name of the httpOnly cookie that stores the Strapi JWT. Shared by the proxy
// (route gating), the auth Server Actions, and the BFF request proxy.
export const AUTH_COOKIE = "auth_token";

// The session cookie lifespan, in seconds (7 days).
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

// Routes reachable without a session; authenticated users are bounced away.
export const PUBLIC_ROUTES = ["/login", "/register"];
