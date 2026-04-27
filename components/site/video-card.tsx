"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import type { Video } from "@/lib/types";

type VideoCardProps = {
  video: Video;
};

function toEmbedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&playsinline=1` };
  }
  if (url.includes("youtube.com/embed/")) {
    const sep = url.includes("?") ? "&" : "?";
    const withAuto = url.includes("autoplay") ? url : `${url}${sep}autoplay=1`;
    return { kind: "iframe", src: withAuto.includes("playsinline") ? withAuto : `${withAuto}&playsinline=1` };
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&playsinline=1` };
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  return { kind: "iframe", src: url };
}

export function VideoCard({ video }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embed = toEmbedSrc(video.videoUrl);

  function handlePlay() {
    // Must set src/call play() synchronously inside the event handler.
    // iOS Safari ties autoplay permission to the user gesture — React's async
    // re-render breaks that chain, so we bypass it with a direct DOM ref.
    if (embed.kind === "iframe" && iframeRef.current) {
      iframeRef.current.src = embed.src;
    } else if (embed.kind === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(true);
  }

  return (
    <div className="video-card">
      <div className="video-thumb">
        {embed.kind === "video" ? (
          <video
            ref={videoRef}
            src={embed.src}
            controls
            playsInline
            className={`video-inline-player${playing ? "" : " video-player-hidden"}`}
          />
        ) : (
          <iframe
            ref={iframeRef}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className={`video-inline-player${playing ? "" : " video-player-hidden"}`}
            title={video.title}
          />
        )}
        <button
          type="button"
          className={`video-play-btn${playing ? " video-play-btn-hidden" : ""}`}
          onClick={handlePlay}
          aria-label={`Play ${video.title}`}
        >
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
          <span className="video-play">▶ Watch</span>
        </button>
      </div>
      <div className="video-copy">
        <h3>{video.title}</h3>
        <p>{video.excerpt}</p>
        <strong>{video.duration}</strong>
      </div>
    </div>
  );
}
