import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ahn_admin_session";

const key = new TextEncoder().encode(
  process.env.SESSION_SECRET?.trim() || "development-session-secret-change-me"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page — clear any existing session on page load (GET) so fresh credentials
  // are always required. Do NOT touch POST requests — those are the server action
  // submitting the login form, which sets the new session cookie.
  if (pathname === "/admin/login") {
    if (request.method !== "GET") return NextResponse.next();
    const response = NextResponse.next();
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  // API routes pass through untouched
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    // Token expired or tampered — clear cookie and send to login
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};
