import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ahn_admin_session";

const key = new TextEncoder().encode(
  process.env.SESSION_SECRET?.trim() || "development-session-secret-change-me"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    // Token missing, expired, or tampered — clear cookie and send to login
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  // Runs on every /admin route except the login page and all API routes
  matcher: ["/admin", "/admin/((?!login).*)", "/admin/(?!login)"]
};
