"use client";

import { useState } from "react";

type VideoShareButtonProps = {
  title: string;
  excerpt: string;
  videoUrl: string;
};

export function VideoShareButton({ title, excerpt, videoUrl }: VideoShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = { title, text: excerpt, url: videoUrl };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or API unavailable — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (e.g. non-secure context) — silently ignore
    }
  }

  return (
    <button
      type="button"
      className={`video-share-btn${copied ? " video-share-btn--copied" : ""}`}
      onClick={handleShare}
      aria-label={copied ? "Link copied!" : "Share this video"}
      title={copied ? "Link copied!" : "Share this video"}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
