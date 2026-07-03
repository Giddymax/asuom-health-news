import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/repositories/cms-repository";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: settings.siteName,
    short_name: settings.siteName,
    description: settings.metaDescription || settings.mission,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: settings.theme.bg,
    theme_color: settings.theme.secondary,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
