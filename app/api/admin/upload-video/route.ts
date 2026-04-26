import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getAdminSession } from "@/lib/auth";
import { env, hasSupabase } from "@/lib/env";

const VIDEO_BUCKET = "site-videos";
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska"
]);

export async function POST(request: Request) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Only video files are allowed (MP4, WebM, OGG, MOV, AVI, MKV)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: "File too large. Maximum 100 MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    if (hasSupabase) {
      const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const { error } = await client.storage.from(VIDEO_BUCKET).upload(filename, bytes, {
        contentType: file.type,
        upsert: false
      });

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      const { data } = client.storage.from(VIDEO_BUCKET).getPublicUrl(filename);
      return NextResponse.json({ url: data.publicUrl });
    }

    // Local fallback — stores in public/videos/ for dev environments
    const videosDir = path.join(process.cwd(), "public", "videos");
    await mkdir(videosDir, { recursive: true });
    await writeFile(path.join(videosDir, filename), Buffer.from(bytes));
    return NextResponse.json({ url: `/videos/${filename}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
