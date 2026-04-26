"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import type { Video } from "@/lib/types";

type VideoCardProps = {
  video: Video;
};

function toEmbedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  // YouTube: watch or short link
  const yt = url.match(/(?:youtube\.com\/watch[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };

  // YouTube embed already
  if (url.includes("youtube.com/embed/")) {
    return { kind: "iframe", src: url.includes("autoplay") ? url : `${url}?autoplay=1` };
  }

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };

  // Direct video file
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };

  // Unknown — open as iframe anyway
  return { kind: "iframe", src: url };
}

export function VideoCard({ video }: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const embed = toEmbedSrc(video.videoUrl);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="video-card"
        onClick={() => setOpen(true)}
        aria-label={`Play ${video.title}`}
      >
        <div className="video-thumb">
          <Image src={video.thumbnail} alt={video.title} width={720} height={480} />
          <span className="video-play">▶ Watch</span>
        </div>
        <div className="video-copy">
          <h3>{video.title}</h3>
          <p>{video.excerpt}</p>
          <strong>{video.duration}</strong>
        </div>
      </button>

      {open ? (
        <div
          className="video-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          onClick={close}
        >
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="video-modal-close" onClick={close} aria-label="Close video">
              ✕
            </button>
            {embed.kind === "video" ? (
              <video
                src={embed.src}
                controls
                autoPlay
                className="video-modal-player"
              />
            ) : (
              <iframe
                src={embed.src}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="video-modal-player"
                title={video.title}
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
