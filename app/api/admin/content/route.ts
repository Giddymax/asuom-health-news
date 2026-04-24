import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { deleteAdminContent, saveAdminContent } from "@/lib/repositories/cms-repository";
import { adminContentSchema, adminDeleteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = adminContentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "The content form is incomplete or invalid." }, { status: 400 });
  }

  try {
    await saveAdminContent(parsed.data);
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Content saved successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = adminDeleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "The delete request is incomplete or invalid." }, { status: 400 });
  }

  try {
    await deleteAdminContent(parsed.data);
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Content deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete content.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
