import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

const COOKIE_NAME = "ahn_admin_session";

export const SESSION_DURATION_SECONDS = 35 * 60; // 35 min — 5-min buffer above the 5-min client refresh throttle

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

export async function getAdminSession(request?: Request) {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`))
      ?.slice(COOKIE_NAME.length + 1);
  } else {
    const store = await cookies();
    token = store.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch {
    return null;
  }
}

export const adminCookieName = COOKIE_NAME;
