import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { env, hasSupabase } from "@/lib/env";
import {
  seedArticles,
  seedCategories,
  seedDonationCampaign,
  seedPages,
  seedSettings,
  seedVideos
} from "@/lib/repositories/seed-data";

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  if (!hasSupabase) {
    return NextResponse.json({ message: "Supabase is not configured." }, { status: 400 });
  }

  const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Categories first (posts and videos reference them)
  for (const cat of seedCategories) {
    const { error } = await client.from("categories").upsert(
      {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        hero_title: cat.heroTitle,
        hero_description: cat.heroDescription,
        hero_image_path: cat.heroImage,
        stats_label: cat.statsLabel
      },
      { onConflict: "slug" }
    );
    if (error) return NextResponse.json({ message: `Category error: ${error.message}` }, { status: 400 });
  }

  // Resolve category slugs → IDs for post inserts
  const { data: catRows } = await client.from("categories").select("id, slug");
  const catMap: Record<string, string> = Object.fromEntries(
    (catRows ?? []).map((c) => [c.slug, c.id])
  );

  // Posts
  for (const post of seedArticles) {
    const categoryId = catMap[post.categorySlug];
    if (!categoryId) continue;
    const { error } = await client.from("posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.join("\n\n"),
        category_id: categoryId,
        author_name: post.author,
        published_at: post.publishedAt,
        read_time_label: post.readTime,
        cover_image_path: post.coverImage,
        status: post.status,
        featured: post.featured,
        featured_rank: post.featuredRank,
        tags: post.tags,
        meta_title: post.metaTitle ?? null,
        meta_description: post.metaDescription ?? null
      },
      { onConflict: "slug" }
    );
    if (error) return NextResponse.json({ message: `Post error: ${error.message}` }, { status: 400 });
  }

  // Videos
  for (const video of seedVideos) {
    const { error } = await client.from("videos").upsert(
      {
        slug: video.slug,
        title: video.title,
        excerpt: video.excerpt,
        thumbnail_path: video.thumbnail,
        duration_label: video.duration,
        video_url: video.videoUrl,
        category_slug: video.categorySlug,
        published_at: video.publishedAt
      },
      { onConflict: "slug" }
    );
    if (error) return NextResponse.json({ message: `Video error: ${error.message}` }, { status: 400 });
  }

  // Info pages
  for (const page of seedPages) {
    const { error } = await client.from("pages").upsert(
      {
        slug: page.slug,
        title: page.title,
        excerpt: page.excerpt,
        content: page.content.join("\n\n"),
        hero_image_path: page.heroImage ?? ""
      },
      { onConflict: "slug" }
    );
    if (error) return NextResponse.json({ message: `Page error: ${error.message}` }, { status: 400 });
  }

  // Donation campaign
  const { error: campError } = await client.from("donation_campaigns").upsert(
    {
      slug: seedDonationCampaign.slug,
      kicker: seedDonationCampaign.kicker,
      title: seedDonationCampaign.title,
      description: seedDonationCampaign.description,
      raised_amount: seedDonationCampaign.raisedAmount,
      goal_amount: seedDonationCampaign.goalAmount,
      payment_label: seedDonationCampaign.paymentLabel,
      payment_number: seedDonationCampaign.paymentNumber,
      payment_link: seedDonationCampaign.paymentLink ?? null,
      image_path: seedDonationCampaign.image,
      is_active: true
    },
    { onConflict: "slug" }
  );
  if (campError) return NextResponse.json({ message: `Campaign error: ${campError.message}` }, { status: 400 });

  // Site settings — only insert if none exist yet
  const { data: existingSettings } = await client
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!existingSettings) {
    const { error: settingsError } = await client.from("site_settings").insert({
      site_name: seedSettings.siteName,
      tagline: seedSettings.tagline,
      featured_topic: seedSettings.featuredTopic,
      mission: seedSettings.mission,
      contact_email: seedSettings.contactEmail,
      ticker_items: seedSettings.tickerItems,
      social_links: seedSettings.socialLinks
    });
    if (settingsError) {
      return NextResponse.json({ message: `Settings error: ${settingsError.message}` }, { status: 400 });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "Demo data loaded successfully." });
}
