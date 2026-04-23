"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Article, Category, DonationCampaign, HomepageContent, InfoPage, SiteSettings, Video } from "@/lib/types";
import { defaultHomepageContent, defaultTheme } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { LinksEditor } from "@/components/admin/links-editor";

type AdminContentFormsProps = {
  categories: Category[];
  posts: Article[];
  pages: InfoPage[];
  videos: Video[];
  settings: SiteSettings;
  donationCampaign: DonationCampaign;
  supabaseEnabled: boolean;
};

type FormKind = "post" | "video" | "category" | "page" | "settings" | "donation";

const modeLabels: Record<FormKind, string> = {
  post: "Articles",
  video: "Homepage Videos",
  category: "Categories",
  page: "Pages",
  settings: "Site Settings",
  donation: "Donation"
};

const deleteLabels: Record<Exclude<FormKind, "settings" | "donation">, string> = {
  post: "Article",
  video: "Video",
  category: "Category",
  page: "Page"
};

function parseLinks(raw: FormDataEntryValue | undefined) {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AdminContentForms({
  categories,
  posts,
  pages,
  videos,
  settings,
  donationCampaign,
  supabaseEnabled
}: AdminContentFormsProps) {
  const router = useRouter();
  const [mode, setMode] = useState<FormKind>("post");
  const [selectedSlug, setSelectedSlug] = useState("new");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const options = useMemo(() => {
    switch (mode) {
      case "post":
        return posts.map((item) => ({ value: item.slug, label: item.title }));
      case "video":
        return videos.map((item) => ({ value: item.slug, label: item.title }));
      case "category":
        return categories.map((item) => ({ value: item.slug, label: item.name }));
      case "page":
        return pages.map((item) => ({ value: item.slug, label: item.title }));
      case "settings":
        return [{ value: "settings", label: "Global site settings" }];
      case "donation":
        return [{ value: donationCampaign.slug, label: donationCampaign.title }];
      default:
        return [];
    }
  }, [mode, posts, videos, categories, pages, donationCampaign.slug, donationCampaign.title]);

  const selectedRecord = useMemo(() => {
    if (mode === "post") return posts.find((item) => item.slug === selectedSlug);
    if (mode === "video") return videos.find((item) => item.slug === selectedSlug);
    if (mode === "category") return categories.find((item) => item.slug === selectedSlug);
    if (mode === "page") return pages.find((item) => item.slug === selectedSlug);
    if (mode === "settings") return settings;
    if (mode === "donation") return donationCampaign;
    return null;
  }, [mode, selectedSlug, posts, videos, categories, pages, settings, donationCampaign]);

  async function submitForm(formData: FormData) {
    setPending(true);
    setMessage("");

    const raw = Object.fromEntries(formData.entries());

    const hpc = (key: keyof HomepageContent) =>
      String(raw[`hpc_${key}`] ?? defaultHomepageContent[key]);

    const payload =
      mode === "settings"
        ? {
            entityType: "settings",
            siteName: String(raw.siteName ?? ""),
            tagline: String(raw.tagline ?? ""),
            featuredTopic: String(raw.featuredTopic ?? ""),
            mission: String(raw.mission ?? ""),
            contactEmail: String(raw.contactEmail ?? ""),
            tickerItems: String(raw.tickerItems ?? "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            socialLinks: parseLinks(raw.socialLinksJson),
            theme: {
              primary: String(raw.themePrimary ?? defaultTheme.primary),
              primaryDark: String(raw.themePrimaryDark ?? defaultTheme.primaryDark),
              secondary: String(raw.themeSecondary ?? defaultTheme.secondary),
              bg: String(raw.themeBg ?? defaultTheme.bg),
              surface: String(raw.themeSurface ?? defaultTheme.surface),
              text: String(raw.themeText ?? defaultTheme.text)
            },
            logoImage: String(raw.logoImage ?? ""),
            heroImage: String(raw.heroImage ?? ""),
            midSectionImage: String(raw.midSectionImage ?? ""),
            navLinks: parseLinks(raw.navLinksJson),
            footerExploreLinks: parseLinks(raw.footerExploreJson),
            footerNewsroomLinks: parseLinks(raw.footerNewsroomJson),
            footerCopyright: String(raw.footerCopyright ?? ""),
            homepageContent: {
              heroEyebrow: hpc("heroEyebrow"),
              heroPrimaryBtn: hpc("heroPrimaryBtn"),
              heroSecondaryBtn: hpc("heroSecondaryBtn"),
              topStoriesEyebrow: hpc("topStoriesEyebrow"),
              topStoriesTitle: hpc("topStoriesTitle"),
              topStoriesDescription: hpc("topStoriesDescription"),
              categoriesEyebrow: hpc("categoriesEyebrow"),
              categoriesTitle: hpc("categoriesTitle"),
              categoriesDescription: hpc("categoriesDescription"),
              latestEyebrow: hpc("latestEyebrow"),
              latestTitle: hpc("latestTitle"),
              latestDescription: hpc("latestDescription"),
              videoEyebrow: hpc("videoEyebrow"),
              videoTitle: hpc("videoTitle"),
              videoDescription: hpc("videoDescription"),
              donateBtn: hpc("donateBtn"),
              newsletterEyebrow: hpc("newsletterEyebrow"),
              newsletterTitle: hpc("newsletterTitle"),
              newsletterDescription: hpc("newsletterDescription"),
              contactEyebrow: hpc("contactEyebrow"),
              contactTitle: hpc("contactTitle"),
              contactDescription: hpc("contactDescription")
            },
            metaDescription: String(raw.metaDescription ?? ""),
            ogImage: String(raw.ogImage ?? "")
          }
        : mode === "donation"
          ? {
              entityType: "donation",
              slug: String(raw.slug ?? ""),
              kicker: String(raw.kicker ?? ""),
              title: String(raw.title ?? ""),
              description: String(raw.description ?? ""),
              raisedAmount: Number(raw.raisedAmount ?? 0),
              goalAmount: Number(raw.goalAmount ?? 0),
              paymentLabel: String(raw.paymentLabel ?? ""),
              paymentNumber: String(raw.paymentNumber ?? ""),
              paymentLink: String(raw.paymentLink ?? ""),
              image: String(raw.image ?? ""),
              isActive: raw.isActive === "on"
            }
          : mode === "video"
            ? {
                entityType: "video",
                slug: String(raw.slug ?? ""),
                title: String(raw.title ?? ""),
                excerpt: String(raw.excerpt ?? ""),
                thumbnail: String(raw.thumbnail ?? ""),
                duration: String(raw.duration ?? ""),
                videoUrl: String(raw.videoUrl ?? ""),
                categorySlug: String(raw.categorySlug ?? ""),
                publishedAt: String(raw.publishedAt ?? "")
              }
            : mode === "post"
              ? {
                  entityType: "post",
                  slug: String(raw.slug ?? ""),
                  title: String(raw.title ?? ""),
                  excerpt: String(raw.excerpt ?? ""),
                  content: String(raw.content ?? ""),
                  categorySlug: String(raw.categorySlug ?? ""),
                  author: String(raw.author ?? ""),
                  coverImage: String(raw.coverImage ?? ""),
                  status: String(raw.status ?? "draft"),
                  featured: raw.featured === "on",
                  featuredRank: Number(raw.featuredRank ?? 0),
                  readTime: String(raw.readTime ?? "")
                }
              : {
                  ...raw,
                  entityType: mode
                };

    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };
    setPending(false);
    setMessage(data.message ?? "Saved.");
    if (response.ok) router.refresh();
  }

  function resetForMode(nextMode: FormKind) {
    setMode(nextMode);
    setSelectedSlug(nextMode === "settings" ? "settings" : nextMode === "donation" ? donationCampaign.slug : "new");
    setMessage("");
  }

  return (
    <div className="admin-editor">
      <div className="admin-tabs">
        {(Object.keys(modeLabels) as FormKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            className={mode === kind ? "active" : ""}
            onClick={() => resetForMode(kind)}
          >
            {modeLabels[kind]}
          </button>
        ))}
      </div>

      {!supabaseEnabled ? (
        <div className="admin-warning">
          Supabase is not configured yet. You can browse the editing UI, but save actions stay
          disabled until the database variables are connected.
        </div>
      ) : null}

      <div className="surface-elevated" style={{ marginBottom: 20 }}>
        <div className="admin-picker">
          <label>
            Edit Existing
            <select value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}>
              {mode !== "settings" && mode !== "donation" ? <option value="new">Create new</option> : null}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <form className="admin-form" action={submitForm}>
        {mode === "post" ? (
          <PostFields
            key={selectedSlug}
            categories={categories}
            post={selectedRecord && "excerpt" in selectedRecord ? (selectedRecord as Article) : undefined}
            supabaseEnabled={supabaseEnabled}
          />
        ) : null}

        {mode === "video" ? (
          <VideoFields
            key={selectedSlug}
            categories={categories}
            video={selectedRecord && "videoUrl" in selectedRecord ? (selectedRecord as Video) : undefined}
            supabaseEnabled={supabaseEnabled}
          />
        ) : null}

        {mode === "category" ? (
          <CategoryFields
            key={selectedSlug}
            category={selectedRecord && "heroTitle" in selectedRecord ? (selectedRecord as Category) : undefined}
            supabaseEnabled={supabaseEnabled}
          />
        ) : null}

        {mode === "page" ? (
          <PageFields
            key={selectedSlug}
            page={
              selectedRecord && "content" in selectedRecord && "updatedAt" in selectedRecord
                ? (selectedRecord as InfoPage)
                : undefined
            }
            supabaseEnabled={supabaseEnabled}
          />
        ) : null}

        {mode === "settings" ? (
          <SettingsFields key="settings" settings={settings} supabaseEnabled={supabaseEnabled} />
        ) : null}

        {mode === "donation" ? (
          <DonationFields key="donation" campaign={donationCampaign} supabaseEnabled={supabaseEnabled} />
        ) : null}

        <div className="admin-action-row">
          <button type="submit" className="button button-primary" disabled={pending || !supabaseEnabled}>
            {pending ? "Saving..." : `Save ${modeLabels[mode]}`}
          </button>
          {mode !== "settings" && mode !== "donation" && selectedSlug !== "new" ? (
            <button
              type="button"
              className="button button-danger"
              disabled={pending || !supabaseEnabled}
              onClick={async () => {
                if (!(mode in deleteLabels)) return;
                const confirmed = window.confirm(
                  mode === "category"
                    ? "Delete this category and its related videos? Posts may also be removed depending on your database state."
                    : "Delete this item permanently?"
                );
                if (!confirmed) return;

                setPending(true);
                setMessage("");

                const response = await fetch("/api/admin/content", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ entityType: mode, slug: selectedSlug })
                });

                const data = (await response.json()) as { message?: string };
                setPending(false);
                setMessage(data.message ?? "Deleted.");

                if (response.ok) {
                  setSelectedSlug("new");
                  router.refresh();
                }
              }}
            >
              Delete {deleteLabels[mode as keyof typeof deleteLabels]}
            </button>
          ) : null}
        </div>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </div>
  );
}

function PostFields({ categories, post, supabaseEnabled }: { categories: Category[]; post?: Article; supabaseEnabled: boolean }) {
  return (
    <>
      <label>
        Slug
        <input name="slug" defaultValue={post?.slug ?? ""} required />
      </label>
      <label>
        Title
        <input name="title" defaultValue={post?.title ?? ""} required />
      </label>
      <label className="field-full">
        Excerpt
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} required />
      </label>
      <label>
        Category
        <select name="categorySlug" defaultValue={post?.categorySlug ?? categories[0]?.slug ?? ""} required>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label>
        Author
        <input name="author" defaultValue={post?.author ?? ""} required />
      </label>
      <label>
        Read Time
        <input name="readTime" defaultValue={post?.readTime ?? "5 min read"} required />
      </label>
      <label>
        Status
        <select name="status" defaultValue={post?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <label>
        Featured on Homepage
        <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} />
      </label>
      <label>
        Featured Rank
        <input type="number" name="featuredRank" min="0" defaultValue={post?.featuredRank ?? 0} />
      </label>
      <ImageUploadField
        name="coverImage"
        label="Cover Image"
        defaultValue={post?.coverImage ?? "/images/placeholders/clinic.svg"}
        supabaseEnabled={supabaseEnabled}
      />
      <label className="field-full">
        Content
        <textarea name="content" defaultValue={post?.body?.join("\n\n") ?? ""} rows={12} required />
      </label>
    </>
  );
}

function VideoFields({ categories, video, supabaseEnabled }: { categories: Category[]; video?: Video; supabaseEnabled: boolean }) {
  return (
    <>
      <label>
        Slug
        <input name="slug" defaultValue={video?.slug ?? ""} required />
      </label>
      <label>
        Title
        <input name="title" defaultValue={video?.title ?? ""} required />
      </label>
      <label className="field-full">
        Excerpt
        <textarea name="excerpt" defaultValue={video?.excerpt ?? ""} rows={3} required />
      </label>
      <label>
        Duration Label
        <input name="duration" defaultValue={video?.duration ?? "5:00"} required />
      </label>
      <label>
        Video URL
        <input name="videoUrl" type="url" defaultValue={video?.videoUrl ?? ""} required />
      </label>
      <label>
        Category
        <select name="categorySlug" defaultValue={video?.categorySlug ?? categories[0]?.slug ?? ""} required>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label>
        Published At
        <input
          name="publishedAt"
          type="datetime-local"
          defaultValue={video?.publishedAt ? video.publishedAt.slice(0, 16) : ""}
          required
        />
      </label>
      <ImageUploadField
        name="thumbnail"
        label="Thumbnail"
        defaultValue={video?.thumbnail ?? "/images/placeholders/video-postnatal.svg"}
        supabaseEnabled={supabaseEnabled}
      />
    </>
  );
}

function CategoryFields({ category, supabaseEnabled }: { category?: Category; supabaseEnabled: boolean }) {
  return (
    <>
      <label>
        Slug
        <input name="slug" defaultValue={category?.slug ?? ""} required />
      </label>
      <label>
        Name
        <input name="name" defaultValue={category?.name ?? ""} required />
      </label>
      <label>
        Accent Colour
        <input type="color" name="color" defaultValue={category?.color ?? "#2ECC8E"} required />
      </label>
      <label className="field-full">
        Description
        <textarea name="description" defaultValue={category?.description ?? ""} rows={3} required />
      </label>
      <label className="field-full">
        Hero Title
        <input name="heroTitle" defaultValue={category?.heroTitle ?? ""} required />
      </label>
      <label className="field-full">
        Hero Description
        <textarea name="heroDescription" defaultValue={category?.heroDescription ?? ""} rows={5} required />
      </label>
      <ImageUploadField
        name="heroImage"
        label="Hero Image"
        defaultValue={category?.heroImage ?? "/images/placeholders/community.svg"}
        supabaseEnabled={supabaseEnabled}
      />
    </>
  );
}

function PageFields({ page, supabaseEnabled }: { page?: InfoPage; supabaseEnabled: boolean }) {
  return (
    <>
      <label>
        Slug
        <input name="slug" defaultValue={page?.slug ?? ""} required />
      </label>
      <label>
        Title
        <input name="title" defaultValue={page?.title ?? ""} required />
      </label>
      <label className="field-full">
        Excerpt
        <textarea name="excerpt" defaultValue={page?.excerpt ?? ""} rows={3} required />
      </label>
      <ImageUploadField
        name="heroImage"
        label="Hero Image"
        defaultValue={page?.heroImage ?? "/images/placeholders/about.svg"}
        supabaseEnabled={supabaseEnabled}
      />
      <label className="field-full">
        Content
        <textarea name="content" defaultValue={page?.content?.join("\n\n") ?? ""} rows={12} required />
      </label>
    </>
  );
}

function SettingsFields({ settings, supabaseEnabled }: { settings: SiteSettings; supabaseEnabled: boolean }) {
  const theme = settings.theme ?? defaultTheme;
  const hpc = settings.homepageContent ?? defaultHomepageContent;

  return (
    <>
      {/* ── Branding ── */}
      <label>
        Site Name
        <input name="siteName" defaultValue={settings.siteName} required />
      </label>
      <label>
        Tagline
        <input name="tagline" defaultValue={settings.tagline} required />
      </label>
      <label className="field-full">
        Homepage Headline
        <input name="featuredTopic" defaultValue={settings.featuredTopic} required />
      </label>
      <label className="field-full">
        Mission Copy
        <textarea name="mission" defaultValue={settings.mission} rows={4} required />
      </label>
      <label>
        Contact Email
        <input name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
      </label>
      <label className="field-full">
        Breaking News Ticker Items (one per line)
        <textarea name="tickerItems" defaultValue={settings.tickerItems.join("\n")} rows={5} required />
      </label>

      {/* ── Navigation ── */}
      <p className="field-full admin-section-label">Navigation Links</p>
      <LinksEditor
        name="navLinksJson"
        sectionLabel="Header Navigation"
        defaultLinks={settings.navLinks}
        labelPlaceholder="Link label (e.g. Community)"
        hrefPlaceholder="Path or URL (e.g. /categories/community-health)"
      />

      {/* ── Footer ── */}
      <p className="field-full admin-section-label">Footer</p>
      <LinksEditor
        name="footerExploreJson"
        sectionLabel="Explore Column Links"
        defaultLinks={settings.footerExploreLinks}
        labelPlaceholder="Label"
        hrefPlaceholder="/categories/slug"
      />
      <LinksEditor
        name="footerNewsroomJson"
        sectionLabel="Newsroom Column Links"
        defaultLinks={settings.footerNewsroomLinks}
        labelPlaceholder="Label"
        hrefPlaceholder="/info/slug"
      />
      <label className="field-full">
        Copyright Text
        <input name="footerCopyright" defaultValue={settings.footerCopyright} />
      </label>

      {/* ── Social Links ── */}
      <p className="field-full admin-section-label">Social Media Links</p>
      <LinksEditor
        name="socialLinksJson"
        sectionLabel="Social Profiles"
        defaultLinks={settings.socialLinks}
        labelPlaceholder="Platform (e.g. Facebook)"
        hrefPlaceholder="https://..."
      />

      {/* ── Homepage Section Text ── */}
      <p className="field-full admin-section-label">Homepage — Hero Section</p>
      <label>
        Eyebrow Text
        <input name="hpc_heroEyebrow" defaultValue={hpc.heroEyebrow} />
      </label>
      <label>
        Primary Button Text
        <input name="hpc_heroPrimaryBtn" defaultValue={hpc.heroPrimaryBtn} />
      </label>
      <label>
        Secondary Button Text
        <input name="hpc_heroSecondaryBtn" defaultValue={hpc.heroSecondaryBtn} />
      </label>

      <p className="field-full admin-section-label">Homepage — Top Stories Section</p>
      <label>
        Eyebrow
        <input name="hpc_topStoriesEyebrow" defaultValue={hpc.topStoriesEyebrow} />
      </label>
      <label>
        Title
        <input name="hpc_topStoriesTitle" defaultValue={hpc.topStoriesTitle} />
      </label>
      <label className="field-full">
        Description
        <input name="hpc_topStoriesDescription" defaultValue={hpc.topStoriesDescription} />
      </label>

      <p className="field-full admin-section-label">Homepage — Categories Section</p>
      <label>
        Eyebrow
        <input name="hpc_categoriesEyebrow" defaultValue={hpc.categoriesEyebrow} />
      </label>
      <label>
        Title
        <input name="hpc_categoriesTitle" defaultValue={hpc.categoriesTitle} />
      </label>
      <label className="field-full">
        Description
        <input name="hpc_categoriesDescription" defaultValue={hpc.categoriesDescription} />
      </label>

      <p className="field-full admin-section-label">Homepage — Latest Articles Section</p>
      <label>
        Eyebrow
        <input name="hpc_latestEyebrow" defaultValue={hpc.latestEyebrow} />
      </label>
      <label>
        Title
        <input name="hpc_latestTitle" defaultValue={hpc.latestTitle} />
      </label>
      <label className="field-full">
        Description
        <input name="hpc_latestDescription" defaultValue={hpc.latestDescription} />
      </label>

      <p className="field-full admin-section-label">Homepage — Video Briefings Section</p>
      <label>
        Eyebrow
        <input name="hpc_videoEyebrow" defaultValue={hpc.videoEyebrow} />
      </label>
      <label>
        Title
        <input name="hpc_videoTitle" defaultValue={hpc.videoTitle} />
      </label>
      <label className="field-full">
        Description
        <input name="hpc_videoDescription" defaultValue={hpc.videoDescription} />
      </label>

      <p className="field-full admin-section-label">Homepage — Donation & Other Sections</p>
      <label>
        Donate Button Text
        <input name="hpc_donateBtn" defaultValue={hpc.donateBtn} />
      </label>
      <label>
        Newsletter Eyebrow
        <input name="hpc_newsletterEyebrow" defaultValue={hpc.newsletterEyebrow} />
      </label>
      <label className="field-full">
        Newsletter Title
        <input name="hpc_newsletterTitle" defaultValue={hpc.newsletterTitle} />
      </label>
      <label className="field-full">
        Newsletter Description
        <input name="hpc_newsletterDescription" defaultValue={hpc.newsletterDescription} />
      </label>
      <label>
        Contact Eyebrow
        <input name="hpc_contactEyebrow" defaultValue={hpc.contactEyebrow} />
      </label>
      <label className="field-full">
        Contact Title
        <input name="hpc_contactTitle" defaultValue={hpc.contactTitle} />
      </label>
      <label className="field-full">
        Contact Description
        <input name="hpc_contactDescription" defaultValue={hpc.contactDescription} />
      </label>

      {/* ── Site Images ── */}
      <p className="field-full admin-section-label">Site Images</p>
      <ImageUploadField name="logoImage" label="Site Logo" defaultValue={settings.logoImage} supabaseEnabled={supabaseEnabled} />
      <ImageUploadField name="heroImage" label="Homepage Hero Background" defaultValue={settings.heroImage} supabaseEnabled={supabaseEnabled} />
      <ImageUploadField name="midSectionImage" label="Mid-Section Banner" defaultValue={settings.midSectionImage} supabaseEnabled={supabaseEnabled} />

      {/* ── SEO ── */}
      <p className="field-full admin-section-label">SEO / Metadata</p>
      <label className="field-full">
        Meta Description
        <textarea name="metaDescription" defaultValue={settings.metaDescription} rows={3} />
      </label>
      <ImageUploadField name="ogImage" label="Open Graph / Social Share Image" defaultValue={settings.ogImage} supabaseEnabled={supabaseEnabled} />

      {/* ── Colour Theme ── */}
      <p className="field-full admin-section-label">Colour Theme</p>
      <label>
        Primary Colour
        <input type="color" name="themePrimary" defaultValue={theme.primary} />
      </label>
      <label>
        Primary Dark
        <input type="color" name="themePrimaryDark" defaultValue={theme.primaryDark} />
      </label>
      <label>
        Secondary Colour
        <input type="color" name="themeSecondary" defaultValue={theme.secondary} />
      </label>
      <label>
        Background
        <input type="color" name="themeBg" defaultValue={theme.bg} />
      </label>
      <label>
        Surface / Cards
        <input type="color" name="themeSurface" defaultValue={theme.surface} />
      </label>
      <label>
        Body Text
        <input type="color" name="themeText" defaultValue={theme.text} />
      </label>
    </>
  );
}

function DonationFields({ campaign, supabaseEnabled }: { campaign: DonationCampaign; supabaseEnabled: boolean }) {
  return (
    <>
      <label>
        Slug
        <input name="slug" defaultValue={campaign.slug} required />
      </label>
      <label>
        Kicker
        <input name="kicker" defaultValue={campaign.kicker} required />
      </label>
      <label className="field-full">
        Title
        <input name="title" defaultValue={campaign.title} required />
      </label>
      <label className="field-full">
        Description
        <textarea name="description" defaultValue={campaign.description} rows={5} required />
      </label>
      <label>
        Raised Amount
        <input type="number" min="0" name="raisedAmount" defaultValue={campaign.raisedAmount} required />
      </label>
      <label>
        Goal Amount
        <input type="number" min="1" name="goalAmount" defaultValue={campaign.goalAmount} required />
      </label>
      <label>
        Payment Label
        <input name="paymentLabel" defaultValue={campaign.paymentLabel} required />
      </label>
      <label>
        Payment Number
        <input name="paymentNumber" defaultValue={campaign.paymentNumber} required />
      </label>
      <label>
        Payment Link
        <input name="paymentLink" defaultValue={campaign.paymentLink ?? ""} />
      </label>
      <ImageUploadField
        name="image"
        label="Campaign Image"
        defaultValue={campaign.image}
        supabaseEnabled={supabaseEnabled}
      />
      <label>
        Active Campaign
        <input type="checkbox" name="isActive" defaultChecked />
      </label>
    </>
  );
}
