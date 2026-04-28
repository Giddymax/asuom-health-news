import type { Video } from "@/lib/types";

type VideoCardProps = {
  video: Video;
};

function toEmbedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?rel=0&playsinline=1` };
  }
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

export function VideoCard({ video }: VideoCardProps) {
  const embed = toEmbedSrc(video.videoUrl);

  return (
    <div className="video-card">
      <div className="video-thumb">
        {embed.kind === "video" ? (
          <video
            src={embed.src}
            controls
            playsInline
            className="video-inline-player"
            poster={video.thumbnail}
          />
        ) : (
          <iframe
            src={embed.src}
            loading="lazy"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="video-inline-player"
            title={video.title}
          />
        )}
      </div>
      <div className="video-copy">
        <h3>{video.title}</h3>
        <p>{video.excerpt}</p>
        <strong>{video.duration}</strong>
      </div>
    </div>
  );
}
