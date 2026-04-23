const read = (key: string) => process.env[key]?.trim() ?? "";

export const env = {
  siteUrl: read("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000",
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  adminEmail: read("ADMIN_EMAIL") || "admin@asuomhealthnews.com",
  adminPassword: read("ADMIN_PASSWORD") || "admin123",
  sessionSecret: read("SESSION_SECRET") || "development-session-secret-change-me"
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
