import { NextResponse } from "next/server";

import { createAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid admin email and password." }, { status: 400 });
  }

  if (parsed.data.email !== env.adminEmail || parsed.data.password !== env.adminPassword) {
    return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
  }

  await createAdminSession(parsed.data.email);
  return NextResponse.json({ message: "Signed in successfully." });
}
