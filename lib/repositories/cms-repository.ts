import { createClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "@/lib/env";
import { slugify } from "@/lib/utils";
import type {
  AdminContentInput,
  AdminDeleteInput,
  Article,
  Category,
  ContactSubmission,
  DashboardStats,
  DonationCampaign,
  DonationSubmission,
  InfoPage,
  NewsletterSignup,
  SiteSettings,
  Video
} from "@/lib/types";
import {
  defaultFooterExploreLinks,
  defaultFooterNewsroomLinks,
  defaultHomepageContent,
  defaultNavLinks,
  defaultTheme
} from "@/lib/types";
import {
  seedArticles,
  seedCategories,
  seedDonationCampaign,
  seedPages,
  seedSettings,
  seedVideos
} from "@/lib/repositories/seed-data";

const serviceClient = hasSupabase
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author_name: string;
  published_at: string;
  read_time_label: string;
  cover_image_path: string;
  status: "draft" | "published";
  featured: boolean;
  featured_rank: number;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  categories: {
    slug: string;
  } | null;
};

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  hero_title: string;
  hero_description: string;
  hero_image_path: string;
  stats_label: string;
};

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  color: row.color,
  heroTitle: row.hero_title,
  heroDescription: row.hero_description,
  heroImage: row.hero_image_path,
  statsLabel: row.stats_label
});

const mapPost = (row: PostRow): Article => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  body: row.body.split("\n\n").filter(Boolean),
  author: row.author_name,
  publishedAt: row.published_at,
  readTime: row.read_time_label,
  coverImage: row.cover_image_path,
  status: row.status,
  featured: row.featured,
  featuredRank: row.featured_rank,
  categorySlug: row.categories?.slug ?? "",
  tags: row.tags ?? [],
  gallery: [],
  metaTitle: row.meta_title ?? undefined,
  metaDescription: row.meta_description ?? undefined
});

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!serviceClient) return seedSettings;

  const { data } = await serviceClient.from("site_settings").select("*").limit(1).maybeSingle();
  if (!data) return seedSettings;

  return {
    siteName: data.site_name ?? seedSettings.siteName,
    tagline: data.tagline ?? seedSettings.tagline,
    featuredTopic: data.featured_topic ?? seedSettings.featuredTopic,
    mission: data.mission ?? seedSettings.mission,
    contactEmail: data.contact_email ?? seedSettings.contactEmail,
    tickerItems: Array.isArray(data.ticker_items) ? data.ticker_items : seedSettings.tickerItems,
    socialLinks: Array.isArray(data.social_links) ? data.social_links : seedSettings.socialLinks,
    theme:
      data.theme && typeof data.theme === "object" && !Array.isArray(data.theme)
        ? { ...defaultTheme, ...(data.theme as object) }
        : defaultTheme,
    logoImage: data.logo_image ?? seedSettings.logoImage,
    heroImage: data.hero_image ?? seedSettings.heroImage,
    midSectionImage: data.mid_section_image ?? seedSettings.midSectionImage,
    navLinks:
      Array.isArray(data.nav_links) && data.nav_links.length > 0
        ? data.nav_links
        : defaultNavLinks,
    footerExploreLinks:
      Array.isArray(data.footer_explore_links) && data.footer_explore_links.length > 0
        ? data.footer_explore_links
        : defaultFooterExploreLinks,
    footerNewsroomLinks:
      Array.isArray(data.footer_newsroom_links) && data.footer_newsroom_links.length > 0
        ? data.footer_newsroom_links
        : defaultFooterNewsroomLinks,
    footerCopyright: data.footer_copyright || seedSettings.footerCopyright,
    homepageContent:
      data.homepage_content && typeof data.homepage_content === "object" && !Array.isArray(data.homepage_content)
        ? { ...defaultHomepageContent, ...(data.homepage_content as object) }
        : defaultHomepageContent,
    metaDescription: data.meta_description || seedSettings.metaDescription,
    ogImage: data.og_image ?? seedSettings.ogImage,
    heroImageOpacity: typeof data.hero_image_opacity === "number" ? data.hero_image_opacity : seedSettings.heroImageOpacity,
    imageContrast: typeof data.image_contrast === "number" ? data.image_contrast : seedSettings.imageContrast,
    imageSaturation: typeof data.image_saturation === "number" ? data.image_saturation : seedSettings.imageSaturation,
    imageBrightness: typeof data.image_brightness === "number" ? data.image_brightness : seedSettings.imageBrightness
  };
}

export async function listCategories(): Promise<Category[]> {
  if (!serviceClient) return seedCategories;

  const { data, error } = await serviceClient
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) return [];
  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await listCategories();
  return categories.find((item) => item.slug === slug) ?? null;
}

export async function listPublishedArticles(): Promise<Article[]> {
  if (!serviceClient) {
    return seedArticles
      .filter((article) => article.status === "published")
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }

  const { data, error } = await serviceClient
    .from("posts")
    .select(
      "id, slug, title, excerpt, body, author_name, published_at, read_time_label, cover_image_path, status, featured, featured_rank, tags, meta_title, meta_description, categories:category_id(slug)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data ?? []).map((row) => mapPost(row as unknown as PostRow));
}

export async function listAllArticles(): Promise<Article[]> {
  if (!serviceClient) {
    return [...seedArticles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }

  const { data, error } = await serviceClient
    .from("posts")
    .select(
      "id, slug, title, excerpt, body, author_name, published_at, read_time_label, cover_image_path, status, featured, featured_rank, tags, meta_title, meta_description, categories:category_id(slug)"
    )
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data ?? []).map((row) => mapPost(row as unknown as PostRow));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await listPublishedArticles();
  return articles.find((item) => item.slug === slug) ?? null;
}

export async function listFeaturedArticles(): Promise<Article[]> {
  const articles = await listPublishedArticles();
  return articles
    .filter((article) => article.featured)
    .sort((a, b) => a.featuredRank - b.featuredRank);
}

export async function listArticlesByCategory(slug: string): Promise<Article[]> {
  const articles = await listPublishedArticles();
  return articles.filter((article) => article.categorySlug === slug);
}

export async function listVideos(): Promise<Video[]> {
  if (!serviceClient) return seedVideos;

  const { data, error } = await serviceClient
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    thumbnail: row.thumbnail_path,
    duration: row.duration_label,
    videoUrl: row.video_url,
    categorySlug: row.category_slug,
    publishedAt: row.published_at
  }));
}

export async function getAdminSiteSnapshot() {
  const [posts, categories, pages, videos, settings, donationCampaign] = await Promise.all([
    listAllArticles(),
    listCategories(),
    listInfoPages(),
    listVideos(),
    getSiteSettings(),
    getActiveDonationCampaign()
  ]);

  return { posts, categories, pages, videos, settings, donationCampaign };
}

export async function listInfoPages(): Promise<InfoPage[]> {
  if (!serviceClient) return seedPages;

  const { data, error } = await serviceClient.from("pages").select("*").order("title");
  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: String(row.content ?? "")
      .split("\n\n")
      .filter(Boolean),
    updatedAt: row.updated_at,
    heroImage: row.hero_image_path
  }));
}

export async function getInfoPageBySlug(slug: string): Promise<InfoPage | null> {
  const pages = await listInfoPages();
  return pages.find((item) => item.slug === slug) ?? null;
}

export async function getActiveDonationCampaign(): Promise<DonationCampaign> {
  if (!serviceClient) return seedDonationCampaign;

  const { data } = await serviceClient
    .from("donation_campaigns")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return seedDonationCampaign;

  return {
    id: data.id,
    slug: data.slug,
    kicker: data.kicker,
    title: data.title,
    description: data.description,
    raisedAmount: data.raised_amount,
    goalAmount: data.goal_amount,
    paymentLabel: data.payment_label,
    paymentNumber: data.payment_number,
    paymentLink: data.payment_link ?? undefined,
    image: data.image_path
  };
}

export async function createNewsletterSignup(input: NewsletterSignup) {
  if (!serviceClient) {
    return { ok: true, mode: "demo" as const };
  }

  const { error } = await serviceClient.from("newsletter_signups").upsert(
    {
      email: input.email,
      source: input.source
    },
    { onConflict: "email" }
  );

  if (error) throw new Error(error.message);
  return { ok: true, mode: "database" as const };
}

export async function createDonation(input: DonationSubmission) {
  if (!serviceClient) {
    return { ok: true, mode: "demo" as const };
  }

  const { error } = await serviceClient.from("donations").insert({
    full_name: input.fullName,
    location: input.location,
    amount: input.amount,
    payment_method: input.paymentMethod,
    phone: input.phone,
    email: input.email ?? null,
    note: input.note ?? null
  });

  if (error) throw new Error(error.message);
  return { ok: true, mode: "database" as const };
}

export async function createContactSubmission(input: ContactSubmission) {
  if (!serviceClient) {
    return { ok: true, mode: "demo" as const };
  }

  const { error } = await serviceClient.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    topic: input.topic,
    message: input.message
  });

  if (error) throw new Error(error.message);
  return { ok: true, mode: "database" as const };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!serviceClient) {
    return {
      articleCount: seedArticles.length,
      categoryCount: seedCategories.length,
      newsletterCount: 0,
      donationCount: 0
    };
  }

  const [posts, categories, newsletter, donations] = await Promise.all([
    serviceClient.from("posts").select("id", { count: "exact", head: true }),
    serviceClient.from("categories").select("id", { count: "exact", head: true }),
    serviceClient.from("newsletter_signups").select("id", { count: "exact", head: true }),
    serviceClient.from("donations").select("id", { count: "exact", head: true })
  ]);

  return {
    articleCount: posts.count ?? seedArticles.length,
    categoryCount: categories.count ?? seedCategories.length,
    newsletterCount: newsletter.count ?? 0,
    donationCount: donations.count ?? 0
  };
}

export async function listRecentDonations() {
  if (!serviceClient) return [];

  const { data } = await serviceClient
    .from("donations")
    .select("id, full_name, amount, payment_method, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return data ?? [];
}

export async function saveAdminContent(input: AdminContentInput) {
  if (!serviceClient) {
    throw new Error(
      "Supabase is not configured yet. Add your Supabase environment variables before creating or editing content."
    );
  }

  if (input.entityType === "post") {
    const { data: category } = await serviceClient
      .from("categories")
      .select("id")
      .eq("slug", input.categorySlug)
      .maybeSingle();

    if (!category) {
      throw new Error("Category not found. Create the category first.");
    }

    const { error } = await serviceClient.from("posts").upsert(
      {
        slug: slugify(input.slug),
        title: input.title,
        excerpt: input.excerpt,
        body: input.content,
        category_id: category.id,
        author_name: input.author,
        cover_image_path: input.coverImage,
        read_time_label: input.readTime,
        status: input.status,
        featured: input.featured,
        featured_rank: input.featuredRank
      },
      { onConflict: "slug" }
    );

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "category") {
    const { error } = await serviceClient.from("categories").upsert(
      {
        slug: slugify(input.slug),
        name: input.name,
        description: input.description,
        color: input.color,
        hero_title: input.heroTitle,
        hero_description: input.heroDescription,
        hero_image_path: input.heroImage,
        stats_label: `${input.name} stories`
      },
      { onConflict: "slug" }
    );

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "video") {
    const { error } = await serviceClient.from("videos").upsert(
      {
        slug: slugify(input.slug),
        title: input.title,
        excerpt: input.excerpt,
        thumbnail_path: input.thumbnail,
        duration_label: input.duration,
        video_url: input.videoUrl,
        category_slug: input.categorySlug,
        published_at: input.publishedAt
      },
      { onConflict: "slug" }
    );

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "settings") {
    const { data: existing } = await serviceClient.from("site_settings").select("id").limit(1).maybeSingle();
    const { error } = await serviceClient.from("site_settings").upsert(
      {
        id: existing?.id,
        site_name: input.siteName,
        tagline: input.tagline,
        featured_topic: input.featuredTopic,
        mission: input.mission,
        contact_email: input.contactEmail,
        ticker_items: input.tickerItems,
        social_links: input.socialLinks,
        theme: input.theme,
        logo_image: input.logoImage,
        hero_image: input.heroImage,
        mid_section_image: input.midSectionImage,
        nav_links: input.navLinks,
        footer_explore_links: input.footerExploreLinks,
        footer_newsroom_links: input.footerNewsroomLinks,
        footer_copyright: input.footerCopyright,
        homepage_content: input.homepageContent,
        meta_description: input.metaDescription,
        og_image: input.ogImage,
        hero_image_opacity: input.heroImageOpacity,
        image_contrast: input.imageContrast,
        image_saturation: input.imageSaturation,
        image_brightness: input.imageBrightness
      },
      existing?.id ? { onConflict: "id" } : undefined
    );

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "donation") {
    const { error } = await serviceClient.from("donation_campaigns").upsert(
      {
        slug: slugify(input.slug),
        kicker: input.kicker,
        title: input.title,
        description: input.description,
        raised_amount: input.raisedAmount,
        goal_amount: input.goalAmount,
        payment_label: input.paymentLabel,
        payment_number: input.paymentNumber,
        payment_link: input.paymentLink || null,
        image_path: input.image,
        is_active: input.isActive
      },
      { onConflict: "slug" }
    );

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await serviceClient.from("pages").upsert(
    {
      slug: slugify(input.slug),
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      hero_image_path: input.heroImage
    },
    { onConflict: "slug" }
  );

  if (error) throw new Error(error.message);
}

export async function deleteAdminContent(input: AdminDeleteInput) {
  if (!serviceClient) {
    throw new Error(
      "Supabase is not configured yet. Add your Supabase environment variables before deleting content."
    );
  }

  if (input.entityType === "post") {
    const { error } = await serviceClient.from("posts").delete().eq("slug", input.slug);
    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "video") {
    const { error } = await serviceClient.from("videos").delete().eq("slug", input.slug);
    if (error) throw new Error(error.message);
    return;
  }

  if (input.entityType === "page") {
    const { error } = await serviceClient.from("pages").delete().eq("slug", input.slug);
    if (error) throw new Error(error.message);
    return;
  }

  await serviceClient.from("videos").delete().eq("category_slug", input.slug);
  const { error } = await serviceClient.from("categories").delete().eq("slug", input.slug);
  if (error) throw new Error(error.message);
}
