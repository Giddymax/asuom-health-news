import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ahn_admin_session";

const key = new TextEncoder().encode(
  process.env.SESSION_SECRET?.trim() || "development-session-secret-change-me"
);

// Routes that never require an existing session
const PUBLIC_API = new Set(["/api/admin/login", "/api/admin/logout"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always strip any incoming x-admin-email — prevents external forgery
  const headers = new Headers(request.headers);
  headers.delete("x-admin-email");

  // Login page (GET): redirect authenticated users to admin, clear bad cookies
  if (pathname === "/admin/login") {
    if (request.method !== "GET") {
      return NextResponse.next({ request: { headers } });
    }
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, key);
        // Valid session — send them to the dashboard instead of wiping their login
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Expired/invalid token — clear it and show the login page
        const res = NextResponse.next({ request: { headers } });
        res.cookies.delete(COOKIE_NAME);
        return res;
      }
    }
    return NextResponse.next({ request: { headers } });
  }

  // Login / logout API routes: pass through without auth
  if (PUBLIC_API.has(pathname)) {
    return NextResponse.next({ request: { headers } });
  }

  // All other /admin and /api/admin routes: verify the session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return pathname.startsWith("/api/")
      ? NextResponse.json({ message: "Unauthorized." }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, key);
    const email = typeof payload.email === "string" ? payload.email : "";
    headers.set("x-admin-email", email);
    return NextResponse.next({ request: { headers } });
  } catch {
    // Expired or tampered token
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  // Cover both admin pages and admin API routes
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
