"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Article, Category, DonationCampaign, InfoPage, SiteSettings, Video } from "@/lib/types";

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
              .map((item) => item.trim())
              .filter(Boolean),
            socialLinks: String(raw.socialLinks ?? "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => {
                const [label, href] = item.split("|").map((part) => part.trim());
                return { label, href };
              })
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
    if (response.ok) {
      router.refresh();
    }
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
            <select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
              {mode !== "settings" && mode !== "donation" ? <option value="new">Create new</option> : null}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <form className="admin-form" action={submitForm}>
        {mode === "post" ? (
          <PostFields categories={categories} post={selectedRecord && "excerpt" in selectedRecord ? (selectedRecord as Article) : undefined} />
        ) : null}

        {mode === "video" ? (
          <VideoFields
            categories={categories}
            video={selectedRecord && "videoUrl" in selectedRecord ? (selectedRecord as Video) : undefined}
          />
        ) : null}

        {mode === "category" ? (
          <CategoryFields category={selectedRecord && "heroTitle" in selectedRecord ? (selectedRecord as Category) : undefined} />
        ) : null}

        {mode === "page" ? (
          <PageFields page={selectedRecord && "content" in selectedRecord && "updatedAt" in selectedRecord ? (selectedRecord as InfoPage) : undefined} />
        ) : null}

        {mode === "settings" ? <SettingsFields settings={settings} /> : null}
        {mode === "donation" ? <DonationFields campaign={donationCampaign} /> : null}

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
                    ? "Delete this category and its related videos? Posts are linked by foreign key and may also be removed depending on your database state."
                    : "Delete this item permanently?"
                );

                if (!confirmed) return;

                setPending(true);
                setMessage("");

                const response = await fetch("/api/admin/content", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    entityType: mode,
                    slug: selectedSlug
                  })
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

function PostFields({ categories, post }: { categories: Category[]; post?: Article }) {
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
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Author
        <input name="author" defaultValue={post?.author ?? ""} required />
      </label>
      <label>
        Cover Image Path
        <input name="coverImage" defaultValue={post?.coverImage ?? "/images/placeholders/clinic.svg"} required />
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
      <label className="field-full">
        Content
        <textarea name="content" defaultValue={post?.body?.join("\n\n") ?? ""} rows={12} required />
      </label>
    </>
  );
}

function VideoFields({ categories, video }: { categories: Category[]; video?: Video }) {
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
        Thumbnail Path
        <input name="thumbnail" defaultValue={video?.thumbnail ?? "/images/placeholders/video-postnatal.svg"} required />
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
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
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
    </>
  );
}

function CategoryFields({ category }: { category?: Category }) {
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
        Accent Color
        <input name="color" defaultValue={category?.color ?? "#2ECC8E"} required />
      </label>
      <label>
        Hero Image Path
        <input name="heroImage" defaultValue={category?.heroImage ?? "/images/placeholders/community.svg"} required />
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
    </>
  );
}

function PageFields({ page }: { page?: InfoPage }) {
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
      <label>
        Hero Image Path
        <input name="heroImage" defaultValue={page?.heroImage ?? "/images/placeholders/about.svg"} required />
      </label>
      <label className="field-full">
        Excerpt
        <textarea name="excerpt" defaultValue={page?.excerpt ?? ""} rows={3} required />
      </label>
      <label className="field-full">
        Content
        <textarea name="content" defaultValue={page?.content?.join("\n\n") ?? ""} rows={12} required />
      </label>
    </>
  );
}

function SettingsFields({ settings }: { settings: SiteSettings }) {
  return (
    <>
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
        <textarea name="mission" defaultValue={settings.mission} rows={5} required />
      </label>
      <label>
        Contact Email
        <input name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
      </label>
      <label className="field-full">
        Breaking News Ticker Items
        <textarea name="tickerItems" defaultValue={settings.tickerItems.join("\n")} rows={6} required />
      </label>
      <label className="field-full">
        Social Links
        <textarea
          name="socialLinks"
          defaultValue={settings.socialLinks.map((item) => `${item.label} | ${item.href}`).join("\n")}
          rows={5}
          required
        />
      </label>
    </>
  );
}

function DonationFields({ campaign }: { campaign: DonationCampaign }) {
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
      <label>
        Image Path
        <input name="image" defaultValue={campaign.image} required />
      </label>
      <label>
        Active Campaign
        <input type="checkbox" name="isActive" defaultChecked />
      </label>
    </>
  );
}
