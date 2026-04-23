import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/site/article-card";
import { Container } from "@/components/ui/container";
import { getArticleBySlug, listArticlesByCategory, listCategories } from "@/lib/repositories/cms-repository";
import { formatDate } from "@/lib/utils";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const [categories, related] = await Promise.all([
    listCategories(),
    listArticlesByCategory(article.categorySlug)
  ]);

  const category = categories.find((item) => item.slug === article.categorySlug) ?? null;
  const relatedArticles = related.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <main className="article-page">
      <section className="article-hero">
        <Container className="article-hero-grid">
          <div>
            {category ? (
              <span className="pill" style={{ "--pill-color": category.color } as CSSProperties}>
                {category.name}
              </span>
            ) : null}
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="article-meta">
              <span>{article.author}</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>{article.readTime}</span>
            </div>
          </div>
          <div className="article-cover">
            <Image src={article.coverImage} alt={article.title} width={1200} height={800} priority />
          </div>
        </Container>
      </section>

      <Container className="article-layout">
        <article className="article-body surface-elevated">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {article.gallery.length ? (
            <div className="gallery-grid">
              {article.gallery.map((item) => (
                <div key={item.id} className="gallery-item">
                  <Image src={item.image} alt={item.alt} width={720} height={520} />
                </div>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="article-sidebar surface-elevated">
          <h2>More Stories</h2>
          <div className="sidebar-stack">
            {relatedArticles.map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                category={categories.find((entry) => entry.slug === item.categorySlug)}
              />
            ))}
          </div>
        </aside>
      </Container>
    </main>
  );
}
