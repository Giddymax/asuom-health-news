import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

const COOKIE_NAME = "ahn_admin_session";

export const SESSION_DURATION_SECONDS = 35 * 60;

const key = new TextEncoder().encode(env.sessionSecret);

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * In Route Handlers: pass the Request object.
 *   The proxy already verified the JWT and put the email in x-admin-email.
 *   We just read that header — no cookie parsing, no jose call needed.
 *
 * In Server Components / Server Actions: call with no argument.
 *   cookies() from next/headers works reliably in that context.
 */
export async function getAdminSession(request?: Request) {
  if (request) {
    const email = request.headers.get("x-admin-email");
    if (!email) return null;
    return { email, role: "admin" };
  }

  // Server Component / Server Action path
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

export const adminCookieName = COOKIE_NAME;
