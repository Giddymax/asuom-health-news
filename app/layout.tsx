import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Asuom Health News",
    template: "%s | Asuom Health News"
  },
  description:
    "A production-ready health blogging platform built with Next.js, Supabase, and a responsive newsroom interface.",
  openGraph: {
    title: "Asuom Health News",
    description: "Trusted community health journalism for Ghanaian readers.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
