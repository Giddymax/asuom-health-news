import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getAdminSession } from "@/lib/auth";
import { env, hasSupabase } from "@/lib/env";

const VIDEO_BUCKET = "site-videos";
const MAX_BYTES = 100 * 1024 * 1024;
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

    if (!hasSupabase) {
      return NextResponse.json({ useServerUpload: true });
    }

    const { name, type, size } = await request.json();

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { message: "Only video files are allowed (MP4, WebM, OGG, MOV, AVI, MKV)." },
        { status: 400 }
      );
    }

    if (size > MAX_BYTES) {
      return NextResponse.json({ message: "File too large. Maximum 100 MB." }, { status: 400 });
    }

    const ext = String(name).split(".").pop()?.toLowerCase() ?? "mp4";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await client.storage.from(VIDEO_BUCKET).createSignedUploadUrl(filename);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const { data: urlData } = client.storage.from(VIDEO_BUCKET).getPublicUrl(filename);

    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl: urlData.publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create upload URL.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
