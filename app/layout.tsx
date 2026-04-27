import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteSettings } from "@/lib/repositories/cms-repository";
import "@/app/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const description = settings.metaDescription || settings.mission;
  const logoUrl = settings.logoImage || "/images/brand/ahn.jpg";

  return {
    metadataBase: base,
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`
    },
    description,
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl
    },
    openGraph: {
      title: settings.siteName,
      description,
      type: "website",
      ...(settings.ogImage ? { images: [{ url: settings.ogImage }] } : {})
    }
  };
}

const hexPattern = /^#[0-9a-fA-F]{3,8}$/;
function safeColor(value: string, fallback: string): string {
  return hexPattern.test(value) ? value : fallback;
}
function safeNum(value: number | undefined, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" && isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, n));
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const settings = await getSiteSettings();
  const { theme } = settings;

  const themeCSS = `:root {
  --primary: ${safeColor(theme.primary, "#2ecc8e")};
  --primary-dark: ${safeColor(theme.primaryDark, "#1ba870")};
  --secondary: ${safeColor(theme.secondary, "#153a28")};
  --bg: ${safeColor(theme.bg, "#f7faf7")};
  --surface: ${safeColor(theme.surface, "#ffffff")};
  --text: ${safeColor(theme.text, "#23312b")};
  --hero-opacity: ${safeNum(settings.heroImageOpacity, 0.28, 0, 1)};
  --img-contrast: ${safeNum(settings.imageContrast, 1, 0.5, 2)};
  --img-saturation: ${safeNum(settings.imageSaturation, 1, 0.5, 2)};
  --img-brightness: ${safeNum(settings.imageBrightness, 1, 0.5, 1.5)};
}`;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
