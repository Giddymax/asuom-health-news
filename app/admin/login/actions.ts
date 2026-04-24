"use server";

import { redirect } from "next/navigation";

import { createAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { loginSchema } from "@/lib/validators";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? "")
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  if (parsed.data.email !== env.adminEmail || parsed.data.password !== env.adminPassword) {
    return { error: "Invalid admin credentials." };
  }

  await createAdminSession(parsed.data.email);
  redirect("/admin");
}
