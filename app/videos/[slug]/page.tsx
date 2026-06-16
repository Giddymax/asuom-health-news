export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { VideoCard } from "@/components/site/video-card";
import { Container } from "@/components/ui/container";
import { getVideoBySlug, listVideosByCategory, listCategories } from "@/lib/repositories/cms-repository";
import { formatDate } from "@/lib/utils";

type VideoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://asuomhealthnews.com").replace(/\/$/, "");
  const thumbUrl = video.thumbnail.startsWith("http") ? video.thumbnail : `${siteUrl}${video.thumbnail}`;

  return {
    title: video.title,
    description: video.excerpt,
    openGraph: {
      title: video.title,
      description: video.excerpt,
      type: "video.other",
      url: `${siteUrl}/videos/${slug}`,
      images: [{ url: thumbUrl, width: 1200, height: 675, alt: video.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.excerpt,
      images: [thumbUrl]
    }
  };
}

function toEmbedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?rel=0&playsinline=1` };
  if (url.includes("youtube.com/embed/")) {
    const base = url.replace(/[&?]autoplay=\d/g, "");
    const sep = base.includes("?") ? "&" : "?";
    return { kind: "iframe", src: base.includes("playsinline") ? base : `${base}${sep}playsinline=1` };
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?playsinline=1` };
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  return { kind: "iframe", src: url };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) notFound();

  const [categories, related] = await Promise.all([
    listCategories(),
    listVideosByCategory(video.categorySlug)
  ]);

  const category = categories.find((c) => c.slug === video.categorySlug) ?? null;
  const relatedVideos = related.filter((v) => v.slug !== video.slug).slice(0, 3);
  const embed = toEmbedSrc(video.videoUrl);

  return (
    <main className="video-page">
      <section className="video-detail-hero">
        <Container>
          <div className="video-detail-meta">
            {category ? (
              <Link href={`/categories/${category.slug}`} className="pill">
                {category.name}
              </Link>
            ) : null}
            <span className="video-detail-duration">{video.duration}</span>
            <span className="muted">{formatDate(video.publishedAt)}</span>
          </div>
          <h1>{video.title}</h1>
          <p className="video-detail-excerpt">{video.excerpt}</p>
        </Container>
      </section>

      <Container className="video-detail-layout">
        <div className="video-detail-player surface-elevated">
          <div className="video-detail-embed">
            {embed.kind === "video" ? (
              <video
                src={embed.src}
                controls
                playsInline
                poster={video.thumbnail}
                className="video-embed-el"
              />
            ) : (
              <iframe
                src={embed.src}
                loading="lazy"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="video-embed-el"
                title={video.title}
              />
            )}
          </div>
        </div>

        <aside className="video-detail-sidebar surface-elevated">
          <h2>More Videos</h2>
          <div className="sidebar-stack">
            {relatedVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
            {relatedVideos.length === 0 ? (
              <p className="muted">No other videos in this category yet.</p>
            ) : null}
          </div>
        </aside>
      </Container>
    </main>
  );
}
