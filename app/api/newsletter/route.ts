import { NextResponse } from "next/server";

import { createNewsletterSignup } from "@/lib/repositories/cms-repository";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  await createNewsletterSignup(parsed.data);
  return NextResponse.json({ message: "Subscription saved successfully." });
}
