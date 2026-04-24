import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import type { Article, Category } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  category?: Category | null;
  featured?: boolean;
  adminActions?: ReactNode;
};

export function ArticleCard({ article, category, featured = false, adminActions }: ArticleCardProps) {
  return (
    <article className={featured ? "article-card article-card-featured" : "article-card"}>
      <Link href={`/articles/${article.slug}`} className="article-media">
        <Image src={article.coverImage} alt={article.title} width={900} height={580} />
      </Link>
      <div className="article-copy">
        <span className="pill" style={{ "--pill-color": category?.color ?? "#2ECC8E" } as CSSProperties}>
          {category?.name ?? "Health"}
        </span>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <div className="article-meta">
          <span>{article.author}</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readTime}</span>
        </div>
      </div>
      {adminActions}
    </article>
  );
}
