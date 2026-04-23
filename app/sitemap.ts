import type { MetadataRoute } from "next";

import { listCategories, listInfoPages, listPublishedArticles } from "@/lib/repositories/cms-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [articles, categories, pages] = await Promise.all([
    listPublishedArticles(),
    listCategories(),
    listInfoPages()
  ]);

  const staticRoutes = ["", "/donate"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));

  return [
    ...staticRoutes,
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt)
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: new Date()
    })),
    ...pages.map((page) => ({
      url: `${siteUrl}/info/${page.slug}`,
      lastModified: new Date(page.updatedAt)
    }))
  ];
}
