"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { getAdminSession } from "@/lib/auth";
import { env, hasSupabase } from "@/lib/env";
import { deleteAdminContent, saveAdminContent } from "@/lib/repositories/cms-repository";
import { adminContentSchema, adminDeleteSchema } from "@/lib/validators";

// ─── Image upload ─────────────────────────────────────────────────────────────

const IMAGE_BUCKET = "site-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif"
]);

export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const session = await getAdminSession();
  if (!session) return { error: "Session expired — please log in again." };

  if (!hasSupabase) return { error: "Supabase is not configured." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided." };

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only image files are allowed (JPEG, PNG, WebP, GIF, SVG, AVIF)." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "File too large. Maximum 5 MB." };
  }

  const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await client.storage.from(IMAGE_BUCKET).upload(filename, bytes, {
    contentType: file.type,
    upsert: false
  });

  if (error) return { error: error.message };

  const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(filename);
  return { url: data.publicUrl };
}

// ─── Content save ─────────────────────────────────────────────────────────────

export async function saveContentAction(
  payload: unknown
): Promise<{ ok: boolean; message: string }> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Session expired — please log in again." };

  const parsed = adminContentSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, message: "The content form is incomplete or invalid." };
  }

  try {
    await saveAdminContent(parsed.data);
    revalidatePath("/", "layout");
    return { ok: true, message: "Content saved successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    return { ok: false, message };
  }
}

// ─── Content delete ───────────────────────────────────────────────────────────

export async function deleteContentAction(
  params: unknown
): Promise<{ ok: boolean; message: string }> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Session expired — please log in again." };

  const parsed = adminDeleteSchema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, message: "The delete request is incomplete or invalid." };
  }

  try {
    await deleteAdminContent(parsed.data);
    revalidatePath("/", "layout");
    return { ok: true, message: "Content deleted successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete content.";
    return { ok: false, message };
  }
}
