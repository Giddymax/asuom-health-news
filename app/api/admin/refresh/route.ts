import { NextResponse } from "next/server";

import { createAdminSession, getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession(request);

  if (!session || typeof session.email !== "string") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  await createAdminSession(session.email);
  return NextResponse.json({ ok: true });
}
