import { NextResponse } from "next/server";

import { createDonation } from "@/lib/repositories/cms-repository";
import { donationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = donationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please complete every required donation field." }, { status: 400 });
  }

  await createDonation({
    ...parsed.data,
    email: parsed.data.email || undefined,
    note: parsed.data.note || undefined
  });

  return NextResponse.json({ message: "Donation details received. Thank you for supporting the newsroom." });
}
