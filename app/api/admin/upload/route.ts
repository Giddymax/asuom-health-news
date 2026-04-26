import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getAdminSession } from "@/lib/auth";
import { env, hasSupabase } from "@/lib/env";

const BUCKET = "site-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif"
]);

export async function POST(request: Request) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasSupabase) {
      return NextResponse.json({ message: "Supabase is not configured." }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Only image files are allowed (JPEG, PNG, WebP, GIF, SVG, AVIF)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: "File too large. Maximum 5 MB." }, { status: 400 });
    }

    const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bytes = await file.arrayBuffer();

    const { error } = await client.storage.from(BUCKET).upload(filename, bytes, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const { data } = client.storage.from(BUCKET).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
