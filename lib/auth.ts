import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

const COOKIE_NAME = "ahn_admin_session";

export const SESSION_DURATION_SECONDS = 30 * 60; // 30 minutes

const key = new TextEncoder().encode(env.sessionSecret);

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);

  const store = await cookies();
  // No maxAge — this becomes a session cookie the browser deletes on close
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch {
    return null;
  }
}

export const adminCookieName = COOKIE_NAME;
