import { NextResponse } from "next/server";

import { createContactSubmission } from "@/lib/repositories/cms-repository";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please complete the contact form properly." }, { status: 400 });
  }

  await createContactSubmission({
    ...parsed.data,
    phone: parsed.data.phone || undefined
  });

  return NextResponse.json({ message: "Message received. The newsroom will review it shortly." });
}
