import { randomUUID } from "crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { recordVisit } from "@/lib/repositories/cms-repository";
import { visitSchema } from "@/lib/validators";

const VISITOR_COOKIE = "ahn_vid";
const VISITED_TODAY_COOKIE = "ahn_visited";
const YEAR_SECONDS = 60 * 60 * 24 * 365;
const DAY_SECONDS = 60 * 60 * 24;
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body.path === "string" && body.path ? body.path.slice(0, 300) : "/";

  const store = await cookies();
  let visitorId = store.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = randomUUID();
    store.set(VISITOR_COOKIE, visitorId, { ...cookieOpts, maxAge: YEAR_SECONDS });
  }

  if (store.get(VISITED_TODAY_COOKIE)?.value === "1") {
    return NextResponse.json({ counted: false });
  }

  const parsed = visitSchema.safeParse({ visitorId, path });
  if (!parsed.success) {
    return NextResponse.json({ counted: false });
  }

  await recordVisit(parsed.data);
  store.set(VISITED_TODAY_COOKIE, "1", { ...cookieOpts, maxAge: DAY_SECONDS });

  return NextResponse.json({ counted: true });
}
