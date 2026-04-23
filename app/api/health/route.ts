import { NextResponse } from "next/server";

import { hasSupabase } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    supabaseConfigured: hasSupabase
  });
}
